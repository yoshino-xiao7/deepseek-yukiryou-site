/**
 * 下载中心客户端逻辑（全站共享，随 Base 布局加载）。
 *
 * 架构：下载配置来自三层，实时性从高到低：
 * 1. 同域代理 /api/downloads（EdgeOne Edge Function）——页面每次加载都请求，
 *    实时返回最新下载配置（版本号 + 四个下载链接）。发布新版本后刷新页面即同步，
 *    与构建流水线解耦；并按访客地区分化：中国大陆访客拿国内镜像直链，其余拿 GitHub。
 * 2. 页面内联配置 #downloads-config——构建时生成，SSR 首屏即为正确链接（零请求）。
 * 3. 同域静态 /downloads.json——构建产物，内联缺失时的兜底。
 *
 * 失败处理（绝不静默）：每一步失败都 console 记录具体原因；
 * 全部不可用时保持 SSR 内联配置（构建时生成，仍然可用），并记录回退原因。
 */
import { formatChecksumDemo, type ChecksumMode } from '../lib/checksum-demo';

const GITHUB_LATEST =
  'https://github.com/yoshino-xiao7/deepseek-harness-desktop-yukiryou/releases/latest';

interface Artifact {
  name?: string;
  url?: string;
  size?: number;
  sha256?: string;
}

interface DownloadConfig {
  schemaVersion?: number;
  version?: string | null;
  source?: string;
  platforms?: Record<string, { primary?: Artifact; alternative?: Artifact }>;
}

type Kind = 'primary' | 'alternative';

function detectOS(): 'mac' | 'win' | null {
  const uaData = (navigator as unknown as {
    userAgentData?: { platform?: string };
  }).userAgentData;
  const platform = String(uaData?.platform ?? navigator.platform ?? '').toLowerCase();
  const ua = navigator.userAgent.toLowerCase();
  if (/mac/.test(platform) || /macintosh|mac os|iphone|ipad/.test(ua)) return 'mac';
  if (/win/.test(platform) || /windows/.test(ua)) return 'win';
  return null;
}

function formatSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${i === 0 || n >= 10 ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}

function isConfig(value: unknown): value is DownloadConfig {
  return (
    !!value &&
    typeof value === 'object' &&
    'platforms' in (value as object) &&
    typeof (value as DownloadConfig).platforms === 'object'
  );
}

/** 页面内联配置（构建时生成） */
function loadInlineConfig(): DownloadConfig | null {
  const inlineEl = document.getElementById('downloads-config');
  if (!inlineEl) return null;
  try {
    const parsed: unknown = JSON.parse(inlineEl.textContent ?? '');
    if (isConfig(parsed)) return parsed;
    console.error('[downloads] 内联下载配置结构异常');
  } catch (err) {
    console.error(
      `[downloads] 解析内联下载配置失败（${err instanceof Error ? err.message : String(err)}）`
    );
  }
  return null;
}

/** 同域静态 /downloads.json（构建产物兜底） */
async function loadStaticConfig(): Promise<DownloadConfig | null> {
  try {
    const res = await fetch('/downloads.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed: unknown = await res.json();
    if (isConfig(parsed)) return parsed;
    console.error('[downloads] 同域 /downloads.json 结构异常');
  } catch (err) {
    console.error(
      `[downloads] 读取同域 /downloads.json 失败（${err instanceof Error ? err.message : String(err)}）`
    );
  }
  return null;
}

/** 1) 同域实时代理（EdgeOne Edge Function）：发布新版本后刷新页面即同步 */
async function loadLiveConfig(): Promise<DownloadConfig | null> {
  try {
    const res = await fetch('/api/downloads', { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed: unknown = await res.json();
    if (isConfig(parsed)) {
      const cfg = parsed as DownloadConfig & { region?: string };
      if (cfg.region === 'cn' && cfg.source !== 'oss') {
        console.warn('[downloads] 国内访客未取到镜像直链，实际来源：' + String(cfg.source));
      }
      return parsed;
    }
    console.error('[downloads] 同域代理 /api/downloads 返回结构异常');
  } catch (err) {
    console.error(
      `[downloads] 读取同域代理 /api/downloads 失败（${err instanceof Error ? err.message : String(err)}），回退页面内联配置`
    );
  }
  return null;
}

/** 用配置绑定页面元素（版本徽章 / 主按钮 / 四个直链 / 文件名） */
function applyConfig(config: DownloadConfig | null) {
  const os = detectOS();
  const platforms = config?.platforms;
  const ready = !!platforms?.['darwin-arm64'] && !!platforms?.['win32-x64'];

  if (!config) {
    console.warn('[downloads] 下载配置不可用：所有下载入口回退 GitHub 最新发行页');
  } else if (!ready) {
    console.warn('[downloads] 下载配置缺少平台数据（构建时所有来源均不可用）：使用 GitHub 最新发行页');
  }

  const urlFor = (platform: string, kind: Kind): string =>
    platforms?.[platform]?.[kind]?.url || GITHUB_LATEST;
  const nameFor = (platform: string, kind: Kind): string | undefined =>
    platforms?.[platform]?.[kind]?.name;
  const sizeFor = (platform: string, kind: Kind): number | undefined =>
    platforms?.[platform]?.[kind]?.size;
  const sha256For = (platform: string, kind: Kind): string | undefined =>
    platforms?.[platform]?.[kind]?.sha256;

  // 版本号徽章
  if (config?.version) {
    document.querySelectorAll<HTMLElement>('[data-dl-version]').forEach((el) => {
      el.textContent = config.version!;
    });
  }

  // 主下载按钮：按系统切换标签与链接
  document.querySelectorAll<HTMLAnchorElement>('[data-dl-main]').forEach((btn) => {
    const label = btn.querySelector<HTMLElement>('[data-dl-label]');
    if (ready && os && label) {
      label.textContent =
        os === 'mac' ? (label.dataset.labelMac ?? '') : (label.dataset.labelWin ?? '');
      btn.href = urlFor(os === 'mac' ? 'darwin-arm64' : 'win32-x64', 'primary');
    } else if (!ready) {
      btn.href = GITHUB_LATEST;
    }
  });

  // 四个直链条目（“其他下载”菜单）
  document.querySelectorAll<HTMLAnchorElement>('[data-dl-link]').forEach((link) => {
    const platform = link.dataset.platform ?? '';
    const kind = link.dataset.kind;
    if (ready && platform && (kind === 'primary' || kind === 'alternative')) {
      link.href = urlFor(platform, kind);
      const meta = link.querySelector<HTMLElement>('[data-dl-meta]');
      if (meta) {
        const name = nameFor(platform, kind);
        const size = formatSize(sizeFor(platform, kind));
        meta.textContent = [name, size].filter(Boolean).join(' · ');
        meta.hidden = !meta.textContent;
      }
    } else if (!ready) {
      link.href = GITHUB_LATEST;
    }
  });

  // 安装区文件名（data-dl-file）
  document.querySelectorAll<HTMLElement>('[data-dl-file]').forEach((el) => {
    const platform = el.dataset.platform ?? '';
    const kind = el.dataset.kind;
    if (kind !== 'primary' && kind !== 'alternative') return;
    const name = nameFor(platform, kind);
    if (name) el.textContent = name;
  });

  // Hero 终端校验演示：版本更新后必须同步文件名与 SHA-256，
  // 否则会把上一版的哈希留在页面上，用户照着核对必然失败。
  document.querySelectorAll<HTMLElement>('[data-term-pre]').forEach((pre) => {
    const platform = pre.dataset.termPlatform ?? '';
    const kind = pre.dataset.termKind;
    const mode = pre.dataset.termMode;
    const fallbackName = pre.dataset.termFallback ?? '';
    if (kind !== 'primary' && kind !== 'alternative') return;
    if (mode !== 'shasum' && mode !== 'filehash') return;

    const promptEl = pre.querySelector<HTMLElement>('[data-term-prompt]');
    const cmdEl = pre.querySelector<HTMLElement>('[data-term-cmd]');
    const outEl = pre.querySelector<HTMLElement>('[data-term-out]');
    if (!cmdEl) return;

    const demo = formatChecksumDemo(
      mode as ChecksumMode,
      nameFor(platform, kind),
      sha256For(platform, kind),
      fallbackName
    );
    if (promptEl) promptEl.textContent = demo.prompt;
    cmdEl.textContent = demo.cmd;
    if (outEl) outEl.textContent = demo.outText;
  });
}

/** “其他下载”下拉菜单交互 */
function bindMenuInteractions() {
  document.querySelectorAll<HTMLElement>('[data-dl-wrap]').forEach((wrap) => {
    const toggle = wrap.querySelector<HTMLButtonElement>('[data-dl-toggle]');
    const menu = wrap.querySelector<HTMLElement>('[data-dl-menu]');
    if (!toggle || !menu) return;
    const close = () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', close);
    document.addEventListener('click', (event) => {
      if (!wrap.contains(event.target as Node)) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  });
}

async function main() {
  // 实时代理优先；失败回退内联（构建时生成）→ 同域静态产物，每步失败都记录原因
  const live = await loadLiveConfig();
  const config = live ?? (loadInlineConfig() ?? (await loadStaticConfig()));

  applyConfig(config);
  bindMenuInteractions();
}

main();
