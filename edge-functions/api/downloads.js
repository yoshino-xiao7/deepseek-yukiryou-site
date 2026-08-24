/**
 * 下载清单同域代理（EdgeOne Edge Function，路由 /api/downloads）。
 *
 * 页面每次加载都会请求本端点，实时获取最新下载配置（版本号 + 四个直链），
 * 与官网构建流水线完全解耦：发布新版本后无需重新构建部署，刷新页面即同步。
 *
 * 获取优先级（每级失败都记录原因，绝不静默）：
 * 1. 国内 OSS 清单 download-cn.suzuki.ink —— 可达时返回 OSS 直链（source: oss）
 * 2. GitHub 最新 Release 资产 —— 海外边缘节点被 ESA 拦截时，
 *    用最新 Release 的资产 URL 构造同结构配置（source: github，链接指向 GitHub）
 * 3. 全部失败 —— 返回 502，前端记录原因并保持页面内联（构建时生成）配置
 *
 * 响应带 60 秒缓存：发布新版本后最多 60 秒内全站同步。
 * 部署：代码推送到仓库后由 EdgeOne Makers 自动构建发布（Edge Functions）。
 */
const MANIFEST_URL = 'https://download-cn.suzuki.ink/downloads/latest.json';
const GITHUB_API =
  'https://api.github.com/repos/yoshino-xiao7/deepseek-harness-desktop-yukiryou/releases/latest';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  });
}

/** 1) 国内 OSS 清单 */
async function fetchFromManifest() {
  const res = await fetch(MANIFEST_URL, {
    headers: { Accept: 'application/json', 'User-Agent': 'deepseek-yukiryou-site' },
  });
  if (!res.ok) throw new Error(`清单 HTTP ${res.status}`);
  const data = await res.json();
  const platforms = data?.platforms;
  if (!platforms || typeof platforms !== 'object') {
    throw new Error('清单缺少 platforms 字段');
  }
  if (!platforms['darwin-arm64'] || !platforms['win32-x64']) {
    throw new Error('清单缺少 darwin-arm64 或 win32-x64 平台配置');
  }
  return { schemaVersion: 1, version: data.version ?? null, source: 'oss', platforms };
}

/** 2) GitHub 最新 Release 资产（海外节点回退） */
async function fetchFromGithub() {
  const res = await fetch(GITHUB_API, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'deepseek-yukiryou-site' },
  });
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
  const data = await res.json();
  const version = String(data.tag_name ?? '').replace(/^v/, '');
  const assets = Array.isArray(data.assets) ? data.assets : [];

  const find = (pattern) => {
    const hit = assets.find((a) => a?.name && pattern.test(a.name));
    return hit
      ? { name: hit.name, url: hit.browser_download_url, size: hit.size }
      : undefined;
  };

  const macDmg = find(/arm64\.dmg$/i);
  const winExe = find(/win32-x64.*Setup\.exe$/i);
  if (!version || !macDmg || !winExe) {
    throw new Error('GitHub 最新 Release 缺少必要资产（DMG 或 Setup.exe）');
  }

  return {
    schemaVersion: 1,
    version,
    source: 'github',
    platforms: {
      'darwin-arm64': {
        primary: macDmg,
        alternative: find(/darwin-arm64.*\.zip$/i),
      },
      'win32-x64': {
        primary: winExe,
        alternative: find(/win32-x64.*portable.*\.zip$/i),
      },
    },
  };
}

export default async function onRequest() {
  try {
    try {
      return json(await fetchFromManifest());
    } catch (err) {
      console.error(
        `[downloads-proxy] 国内清单获取失败（${err instanceof Error ? err.message : String(err)}），改用 GitHub Release`
      );
      return json(await fetchFromGithub());
    }
  } catch (err) {
    console.error(
      `[downloads-proxy] GitHub 回退也失败（${err instanceof Error ? err.message : String(err)}）`
    );
    return json(
      { error: 'downloads-unavailable', message: String(err instanceof Error ? err.message : err) },
      502
    );
  }
}
