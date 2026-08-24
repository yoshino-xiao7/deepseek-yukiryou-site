#!/usr/bin/env node
/**
 * 构建前获取下载清单，生成下载配置：
 * - src/generated/downloads.json：供页面 SSR 内联，首屏即为正确直链（零运行时请求）
 * - public/downloads.json：同域静态资源，作为运行时兜底读取路径（无跨域依赖）
 *
 * 获取优先级（每级失败都记录原因，绝不静默）：
 * 1. 国内 OSS 清单 latest.json（国内构建：四个 OSS 直链，source: "oss"）
 * 2. GitHub Releases 资产（海外 CI 构建：清单被 ESA 拦截时，用最新 Release 的
 *    资产 URL 构造同结构配置，source: "github"——版本号与链接仍然是最新）
 * 3. 已有配置（最后成功生成的配置，可能落后一个版本）
 * 4. source: "github" 空配置（页面统一回退 GitHub 最新发行页）
 *
 * 用法：pnpm build 会自动在 astro build 之前执行本脚本。
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outSrc = join(root, 'src', 'generated', 'downloads.json');
const outPublic = join(root, 'public', 'downloads.json');

const MANIFEST_URL = 'https://download-cn.suzuki.ink/downloads/latest.json';
const MIRROR_BASE = 'https://download-cn.suzuki.ink/releases';
const GITHUB_API =
  'https://api.github.com/repos/yoshino-xiao7/deepseek-harness-desktop-yukiryou/releases/latest';
const EMPTY = { schemaVersion: 1, version: null, source: 'github', platforms: {} };

/** 读取已有配置作为回退基准（最后成功生成的配置） */
function readExisting() {
  try {
    if (existsSync(outSrc)) {
      const data = JSON.parse(readFileSync(outSrc, 'utf8'));
      if (data && typeof data === 'object' && data.platforms && typeof data.platforms === 'object') {
        return data;
      }
      console.warn('[fetch-downloads] 已有下载配置结构异常，忽略并回退空配置');
    }
  } catch (err) {
    console.warn(`[fetch-downloads] 读取已有下载配置失败（${err.message}），将使用空配置`);
  }
  return null;
}

function writeConfig(config) {
  const json = JSON.stringify(config, null, 2) + '\n';
  mkdirSync(dirname(outSrc), { recursive: true });
  mkdirSync(dirname(outPublic), { recursive: true });
  writeFileSync(outSrc, json);
  writeFileSync(outPublic, json);
  console.log(
    `[fetch-downloads] 下载配置已生成（来源: ${config.source}${config.version ? `，版本 v${config.version}` : ''}）`
  );
}

/** 从国内 OSS 清单获取（国内构建的主路径） */
async function fetchFromManifest() {
  const res = await fetch(MANIFEST_URL, {
    headers: { Accept: 'application/json', 'User-Agent': 'deepseek-yukiryou-site' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

/**
 * 从 GitHub Releases 最新资产构造配置（海外 CI 的兜底路径：
 * 国内清单被 ESA 拦截时，GitHub API 全球可达）。
 */
async function fetchFromGithub() {
  const res = await fetch(GITHUB_API, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'deepseek-yukiryou-site',
    },
  });
  if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);
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

  // 首屏面向国内访客：镜像与 GitHub 的资产文件名一致，按镜像模板改写 URL；
  // 海外访客的链接在运行时由 /api/downloads 按 GEO 改回 GitHub。
  const toMirror = (a) =>
    a ? { ...a, url: `${MIRROR_BASE}/v${version}/${a.name}` } : undefined;

  return {
    schemaVersion: 1,
    version,
    source: 'oss',
    dataSource: 'github',
    platforms: {
      'darwin-arm64': {
        primary: toMirror(macDmg),
        alternative: toMirror(find(/darwin-arm64.*\.zip$/i)),
      },
      'win32-x64': {
        primary: toMirror(winExe),
        alternative: toMirror(find(/win32-x64.*portable.*\.zip$/i)),
      },
    },
  };
}

async function main() {
  // 1) 国内 OSS 清单
  try {
    writeConfig(await fetchFromManifest());
    return;
  } catch (err) {
    console.warn(
      `[fetch-downloads] 获取国内下载清单失败（${err instanceof Error ? err.message : String(err)}）`
    );
  }

  // 2) GitHub Release 资产（海外 CI 主回退）
  try {
    const config = await fetchFromGithub();
    writeConfig(config);
    console.warn(
      `[fetch-downloads] 已改用 GitHub Release 资产构造配置（版本 v${config.version}，首屏链接按镜像模板改写；海外访客由 /api/downloads 运行时改回 GitHub）`
    );
    return;
  } catch (err) {
    console.warn(
      `[fetch-downloads] 从 GitHub Release 构造配置失败（${err instanceof Error ? err.message : String(err)}）`
    );
  }

  // 3) 已有配置
  const existing = readExisting();
  if (existing) {
    writeConfig(existing);
    console.warn(
      `[fetch-downloads] 回退已有配置（来源: ${existing.source ?? '未知'}${existing.version ? `，版本 v${existing.version}` : ''}）`
    );
    return;
  }

  // 4) 空配置
  writeConfig(EMPTY);
  console.error('[fetch-downloads] 所有来源均不可用，页面将回退 GitHub 最新发行页');
}

main();
