#!/usr/bin/env node
/**
 * 素材准备脚本：
 * 1. 从 GitHub 仓库下载应用图标（优先使用本地仓库文件）
 * 2. 用 sips 生成 favicon / apple-touch-icon / PWA 图标
 * 3. 用 Pillow 绘制 1200x630 的 OG 封面图（public/og-cover.png）
 *
 * 用法：pnpm assets
 * 提示：Pillow 不可用时，若 public/og-cover.png 已存在则跳过；
 *       需要重新生成时请先 `pip install pillow` 或设置 PYTHONPATH。
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, copyFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const tmpDir = join(root, '.assets-tmp');

const ICON_URL =
  'https://raw.githubusercontent.com/yoshino-xiao7/deepseek-harness-desktop-yukiryou/main/resources/icons/deepseek-yukiryou.png';

mkdirSync(tmpDir, { recursive: true });

function run(cmd, args, opts = {}) {
  execFileSync(cmd, args, { stdio: 'inherit', ...opts });
}

/** 1. 获取图标源文件（优先本地仓库文件） */
const localIcon = join(root, 'resources', 'icons', 'deepseek-yukiryou.png');
const iconSrc = join(tmpDir, 'icon-src.png');
if (existsSync(localIcon)) {
  copyFileSync(localIcon, iconSrc);
  console.log('✔ 使用本地图标', localIcon);
} else {
  console.log('⬇ 下载图标...');
  run('curl', ['-sL', '--max-time', '60', ICON_URL, '-o', iconSrc]);
  console.log('✔ 图标下载完成');
}
if (!existsSync(iconSrc) || readFileSync(iconSrc).length < 1000) {
  console.error('✘ 图标获取失败');
  process.exit(1);
}

/** 2. 生成各尺寸图标 */
const sizes = [
  ['favicon-32.png', 32],
  ['app-icon-180.png', 180],
  ['app-icon-192.png', 192],
  ['app-icon-512.png', 512],
];
for (const [name, size] of sizes) {
  run('sips', ['-z', String(size), String(size), iconSrc, '--out', join(publicDir, name)]);
  console.log(`✔ ${name} (${size}x${size})`);
}

/** 3. 生成 OG 封面图 */
const ogPng = join(publicDir, 'og-cover.png');
const pyScript = join(__dirname, 'og_cover.py');
const pyEnv = { ...process.env, OG_OUT: ogPng, OG_ICON: iconSrc };
const pyRunner = `
import os, runpy, importlib.util
ok = importlib.util.find_spec("PIL")
if ok is None:
    raise SystemExit("Pillow not available")
runpy.run_path(os.environ["OG_SCRIPT"], run_name="__main__")
`;

function tryPillow() {
  const candidates = ['/usr/bin/python3', 'python3', 'python'];
  for (const py of candidates) {
    try {
      run(py, ['-c', pyRunner], { env: { ...pyEnv, OG_SCRIPT: pyScript } });
      console.log('✔ og-cover.png 生成完成（Pillow）');
      return true;
    } catch {
      /* 尝试下一个解释器 */
    }
  }
  return false;
}

if (!tryPillow()) {
  if (existsSync(ogPng)) {
    console.log('⚠ Pillow 不可用，保留已有 public/og-cover.png');
  } else {
    console.error(
      '✘ 未能生成 OG 图：请安装 Pillow（pip install pillow）后重试，或手动提供 public/og-cover.png（1200x630）'
    );
    process.exit(1);
  }
}

console.log('\n素材准备完毕。');
