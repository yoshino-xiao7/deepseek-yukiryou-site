#!/usr/bin/env node
/**
 * 构建前获取最新 GitHub Release 版本号，写入 src/generated/release.json。
 *
 * - 成功：写入 GitHub 返回的最新版本
 * - 失败：保留已有文件（或写入内置默认值），不阻塞构建
 *
 * 用法：pnpm build 会自动在 astro build 之前执行本脚本。
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = join(__dirname, '..', 'src', 'generated', 'release.json');

const REPO = 'yoshino-xiao7/deepseek-harness-desktop-yukiryou';
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
const DEFAULT = { version: '0.2.1-beta.2', tagName: 'v0.2.1-beta.2', source: 'default' };

/** 读取已有文件作为回退基准（最后已知有效版本） */
function readExisting() {
  try {
    if (existsSync(outFile)) {
      const data = JSON.parse(readFileSync(outFile, 'utf8'));
      if (data && data.version) return data;
    }
  } catch (err) {
    console.warn(
      `[fetch-release] 读取已有 release.json 失败（${err instanceof Error ? err.message : String(err)}），使用内置默认版本`
    );
  }
  return DEFAULT;
}

async function main() {
  const fallback = readExisting();
  let release = fallback;

  try {
    const res = await fetch(API_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'deepseek-yukiryou-site',
      },
    });
    if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);
    const data = await res.json();
    const version = String(data.tag_name ?? '').replace(/^v/, '');
    if (version) {
      release = { version, tagName: data.tag_name, source: 'github' };
    }
  } catch (err) {
    console.warn(
      `[fetch-release] 获取最新 Release 失败（${err.message}），使用已有版本 ${fallback.tagName}`
    );
  }

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(release, null, 2) + '\n');
  console.log(`[fetch-release] 版本号: ${release.tagName}（来源: ${release.source}）`);
}

main();
