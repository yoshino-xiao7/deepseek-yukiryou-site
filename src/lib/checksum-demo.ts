/**
 * Hero 终端校验演示的唯一格式化来源。
 *
 * 同时被两处使用，保证构建产物与运行时刷新后完全一致：
 * - `components/Hero.astro`（SSR：用构建时下载清单渲染首屏）
 * - `scripts/downloads.ts`（客户端：拿到 /api/downloads 的实时配置后重写）
 *
 * 该文件刻意不引入任何生成的 JSON，以免把清单打进客户端包。
 */

/** 演示模式：macOS 用 shasum，Windows 用 PowerShell Get-FileHash */
export type ChecksumMode = 'shasum' | 'filehash';

export interface ChecksumDemo {
  /** 提示符，Windows 用 PS> 以免误导用户在 PowerShell 里执行 sh 语法 */
  prompt: string;
  /** 可复制的命令本体 */
  cmd: string;
  /** 命令下方的模拟输出；缺少哈希时为空字符串 */
  outText: string;
}

/** 各平台在演示里使用的安装包类型与命令形态 */
export const CHECKSUM_TARGETS: {
  platform: string;
  kind: 'primary';
  mode: ChecksumMode;
  fallbackName: string;
}[] = [
  {
    platform: 'darwin-arm64',
    kind: 'primary',
    mode: 'shasum',
    fallbackName: 'DeepSeek.YukiRyou-arm64.dmg',
  },
  {
    platform: 'win32-x64',
    kind: 'primary',
    mode: 'filehash',
    fallbackName: 'DeepSeek.YukiRyou-win32-x64-Setup.exe',
  },
];

/**
 * 根据文件名与 SHA-256 生成演示文本。
 *
 * 关键约束：哈希缺失或与文件名不成对时**不输出任何哈希**，
 * 只保留命令。展示过期或凭空构造的校验值比不展示更危险。
 */
export function formatChecksumDemo(
  mode: ChecksumMode,
  name: string | undefined,
  sha256: string | undefined,
  fallbackName: string
): ChecksumDemo {
  const file = name || fallbackName;
  // 只接受形如 64 位十六进制的真实 SHA-256
  const hash = typeof sha256 === 'string' && /^[0-9a-f]{64}$/i.test(sha256) ? sha256 : '';
  // 哈希必须与本次拿到的文件名成对出现，否则不展示
  const paired = hash && name ? hash : '';

  if (mode === 'filehash') {
    const cmd = `Get-FileHash .\\${file} -Algorithm SHA256`;
    const outText = paired
      ? `\nAlgorithm  Hash\n---------  ----\nSHA256     ${paired.toUpperCase()}`
      : '';
    return { prompt: 'PS> ', cmd, outText };
  }

  const cmd = `shasum -a 256 ${file}`;
  const outText = paired ? `\n${paired}  ${file}` : '';
  return { prompt: '$ ', cmd, outText };
}
