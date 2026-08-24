#!/usr/bin/env node
/**
 * astro build 之后把 EdgeOne Edge Functions（edge-functions/）复制进 dist/。
 *
 * EdgeOne Makers 部署时从构建产物（outputDirectory）中识别函数目录；
 * 无论控制台流水线还是 `edgeone makers deploy ./dist`，dist 里带函数目录才能发布函数。
 */
import { cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'edge-functions');
const dest = join(root, 'dist', 'edge-functions');

if (!existsSync(src)) {
  console.warn('[copy-functions] 未找到 edge-functions/ 目录，跳过函数复制');
  process.exit(0);
}

try {
  cpSync(src, dest, { recursive: true });
  console.log('✔ edge-functions/ 已复制到 dist/（Edge Functions 随部署发布）');
} catch (err) {
  console.error(`✘ 复制 edge-functions 失败：${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
