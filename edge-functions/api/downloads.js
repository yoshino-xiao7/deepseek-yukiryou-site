/**
 * 下载清单同域代理（EdgeOne Edge Function，路由 /api/downloads）。
 *
 * 页面每次加载都会请求本端点，实时获取最新下载配置（版本号 + 四个下载链接），
 * 与官网构建流水线完全解耦：发布新版本后无需重新构建部署，刷新页面即同步。
 *
 * 按访客地区决定链接来源（context.request.eo.geo）：
 * - 中国大陆访客（CN）→ 强制返回国内镜像直链 download-cn.suzuki.ink
 * - 其他地区访客 → 返回 GitHub Release 资产链接
 *
 * 数据来源优先级（每级失败都记录原因，绝不静默）：
 * 1. 国内 OSS 清单 latest.json —— 镜像的权威状态（含 sha256），国内节点可达时使用
 * 2. GitHub 最新 Release —— 海外边缘节点被 ESA 拦截时使用；此时国内访客的镜像直链
 *    由「版本号 + 资产文件名」按镜像 URL 模板构造（两侧文件名一致）
 * 3. 全部失败 —— 返回 502，前端记录原因并保持页面内联（构建时生成）配置
 *
 * 缓存：private, max-age=60 —— 响应随访客地区不同，禁止 CDN 共享缓存造成跨地区污染；
 * 浏览器本地缓存 60 秒，兼顾实时性与请求量。
 */
const REPO = 'yoshino-xiao7/deepseek-harness-desktop-yukiryou';
const MANIFEST_URL = 'https://download-cn.suzuki.ink/downloads/latest.json';
const MIRROR_BASE = 'https://download-cn.suzuki.ink/releases';
const GITHUB_API = `https://api.github.com/repos/${REPO}/releases/latest`;

/** 四个产物：平台 / 类型 / GitHub 资产名匹配规则 */
const ARTIFACTS = [
  ['darwin-arm64', 'primary', /arm64\.dmg$/i],
  ['darwin-arm64', 'alternative', /darwin-arm64.*\.zip$/i],
  ['win32-x64', 'primary', /win32-x64.*Setup\.exe$/i],
  ['win32-x64', 'alternative', /win32-x64.*portable.*\.zip$/i],
];

const mirrorUrl = (version, name) => `${MIRROR_BASE}/v${version}/${name}`;
const githubUrl = (version, name) =>
  `https://github.com/${REPO}/releases/download/v${version}/${name}`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // 响应按地区分化：禁止共享缓存，仅允许浏览器本地缓存
      'cache-control': 'private, max-age=60',
    },
  });
}

/** 1) 国内 OSS 清单（镜像权威状态） */
async function fromManifest() {
  const res = await fetch(MANIFEST_URL, {
    headers: { Accept: 'application/json', 'User-Agent': 'deepseek-yukiryou-site' },
  });
  if (!res.ok) throw new Error(`清单 HTTP ${res.status}`);
  const data = await res.json();
  const platforms = data?.platforms;
  if (!platforms || typeof platforms !== 'object') throw new Error('清单缺少 platforms 字段');
  if (!platforms['darwin-arm64'] || !platforms['win32-x64']) {
    throw new Error('清单缺少 darwin-arm64 或 win32-x64 平台配置');
  }
  const version = String(data.version ?? '');
  if (!version) throw new Error('清单缺少 version');

  const artifacts = {};
  for (const [platform, kind] of ARTIFACTS) {
    const a = platforms[platform]?.[kind];
    if (!a?.name) continue;
    artifacts[platform] = artifacts[platform] || {};
    artifacts[platform][kind] = {
      name: a.name,
      url: a.url,
      size: a.size,
      sha256: a.sha256,
    };
  }
  return { version, artifacts, dataSource: 'manifest' };
}

/** 2) GitHub 最新 Release（海外节点回退） */
async function fromGithub() {
  const res = await fetch(GITHUB_API, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'deepseek-yukiryou-site' },
  });
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
  const data = await res.json();
  const version = String(data.tag_name ?? '').replace(/^v/, '');
  const assets = Array.isArray(data.assets) ? data.assets : [];
  if (!version) throw new Error('GitHub Release 缺少 tag_name');

  const artifacts = {};
  for (const [platform, kind, pattern] of ARTIFACTS) {
    const hit = assets.find((a) => a?.name && pattern.test(a.name));
    if (!hit) continue;
    artifacts[platform] = artifacts[platform] || {};
    artifacts[platform][kind] = {
      name: hit.name,
      url: hit.browser_download_url,
      size: hit.size,
    };
  }
  if (!artifacts['darwin-arm64']?.primary || !artifacts['win32-x64']?.primary) {
    throw new Error('GitHub 最新 Release 缺少必要资产（DMG 或 Setup.exe）');
  }
  return { version, artifacts, dataSource: 'github' };
}

/** 按访客地区拼装最终配置：国内 → 镜像直链，海外 → GitHub 链接 */
function buildConfig(data, region) {
  const platforms = {};
  for (const [platform, kind] of ARTIFACTS) {
    const a = data.artifacts[platform]?.[kind];
    if (!a?.name) continue;

    // 同来源用原始 URL，跨来源按模板构造（两侧资产文件名一致）
    const url =
      region === 'cn'
        ? data.dataSource === 'manifest'
          ? a.url
          : mirrorUrl(data.version, a.name)
        : data.dataSource === 'github'
          ? a.url
          : githubUrl(data.version, a.name);

    platforms[platform] = platforms[platform] || {};
    platforms[platform][kind] = {
      name: a.name,
      url,
      ...(a.size ? { size: a.size } : {}),
      ...(a.sha256 ? { sha256: a.sha256 } : {}),
    };
  }

  return {
    schemaVersion: 1,
    version: data.version,
    // source 表示链接指向：oss = 国内镜像直链，github = GitHub 资产
    source: region === 'cn' ? 'oss' : 'github',
    region,
    dataSource: data.dataSource,
    platforms,
  };
}

export default async function onRequest(context) {
  // 访客地区：中国大陆走国内镜像，其余走 GitHub；取不到 GEO 时按海外处理（全球可达）
  const geo = context?.request?.eo?.geo;
  const country = String(geo?.countryCodeAlpha2 ?? '').toUpperCase();
  if (!country) {
    console.warn('[downloads-proxy] 未取到访客 GEO 信息，按海外处理（返回 GitHub 链接）');
  }
  const region = country === 'CN' ? 'cn' : 'global';

  let data = null;
  try {
    data = await fromManifest();
  } catch (err) {
    console.error(
      `[downloads-proxy] 国内清单获取失败（${err instanceof Error ? err.message : String(err)}），改用 GitHub Release${region === 'cn' ? '（国内访客的镜像直链将按文件名构造）' : ''}`
    );
    try {
      data = await fromGithub();
    } catch (err2) {
      console.error(
        `[downloads-proxy] GitHub 回退也失败（${err2 instanceof Error ? err2.message : String(err2)}）`
      );
      return json(
        {
          error: 'downloads-unavailable',
          message: String(err2 instanceof Error ? err2.message : err2),
          region,
        },
        502
      );
    }
  }

  return json(buildConfig(data, region));
}
