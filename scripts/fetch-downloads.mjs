#!/usr/bin/env node
/**
 * 构建前获取国内 OSS 下载清单（latest.json），生成下载配置：
 * - src/generated/downloads.json：供页面 SSR 内联，首屏即为正确直链（零运行时请求）
 * - public/downloads.json：同域静态资源，作为运行时兜底读取路径（无跨域依赖）
 *
 * 失败时绝不静默：记录具体原因；优先保留已有配置作为回退基准；
 * 若无已有配置则写入 source:"github" 的空配置（页面统一回退 GitHub 最新发行页）。
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

async function main() {
  try {
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
    writeConfig({
      schemaVersion: 1,
      version: data.version ?? null,
      source: 'oss',
      platforms,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const existing = readExisting();
    if (existing) {
      writeConfig(existing);
      console.warn(
        `[fetch-downloads] 获取下载清单失败（${message}），回退已有配置（来源: ${existing.source ?? '未知'}）`
      );
    } else {
      writeConfig(EMPTY);
      console.error(
        `[fetch-downloads] 获取下载清单失败（${message}）且无已有配置，页面将回退 GitHub 最新发行页`
      );
    }
  }
}

main();
