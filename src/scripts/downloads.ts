/**
 * 下载中心客户端逻辑（全站共享，随 Base 布局加载）。
 *
 * 架构：下载配置在构建时由 scripts/fetch-downloads.mjs 生成，随页面 SSR 内联
 * （#downloads-config），四个下载链接在首屏 HTML 中即为正确直链——
 * 不依赖任何浏览器跨域 fetch。
 *
 * 本脚本只做三件事：
 * 1. 读取内联配置；缺失时回退同域静态 /downloads.json（无跨域问题）
 * 2. 按系统切换主按钮标签与链接（纯本地逻辑）
 * 3. 处理“其他下载”下拉菜单交互
 *
 * 失败处理（绝不静默）：每一步失败都记录具体原因；
 * 配置彻底不可用时，所有下载入口统一指向 GitHub 最新发行页并记录回退原因。
 */
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

/** 读取下载配置：优先内联 JSON（构建时生成），缺失时回退同域 /downloads.json */
async function loadConfig(): Promise<DownloadConfig | null> {
  // 1) 页面内联配置（发布时生成，主路径，零网络请求）
  const inlineEl = document.getElementById('downloads-config');
  if (inlineEl) {
    try {
      const parsed = JSON.parse(inlineEl.textContent ?? '');
      if (isConfig(parsed)) return parsed;
      console.error('[downloads] 内联下载配置结构异常，改用同域 /downloads.json');
    } catch (err) {
      console.error(
        `[downloads] 解析内联下载配置失败（${err instanceof Error ? err.message : String(err)}），改用同域 /downloads.json`
      );
    }
  }

  // 2) 同域静态配置（发布时生成，随 dist 一起部署，无跨域）
  try {
    const res = await fetch('/downloads.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed: unknown = await res.json();
    if (isConfig(parsed)) return parsed;
    console.error('[downloads] 同域 /downloads.json 结构异常，将回退 GitHub 最新发行页');
  } catch (err) {
    console.error(
      `[downloads] 读取同域 /downloads.json 失败（${err instanceof Error ? err.message : String(err)}），将回退 GitHub 最新发行页`
    );
  }
  return null;
}

async function main() {
  const config = await loadConfig();
  const os = detectOS();

  const platforms = config?.platforms;
  const ready =
    !!platforms?.['darwin-arm64'] && !!platforms?.['win32-x64'];

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

  // 版本号徽章：内联/同域配置可能比 SSR 值更新（旧缓存页面场景）
  if (config?.version) {
    document.querySelectorAll<HTMLElement>('[data-dl-version]').forEach((el) => {
      el.textContent = config.version!;
    });
  }

  // 主下载按钮：按系统切换标签与链接（仅本地逻辑，无网络请求）
  document.querySelectorAll<HTMLAnchorElement>('[data-dl-main]').forEach((btn) => {
    const label = btn.querySelector<HTMLElement>('[data-dl-label]');
    if (ready && os && label) {
      label.textContent =
        os === 'mac' ? (label.dataset.labelMac ?? '') : (label.dataset.labelWin ?? '');
      btn.href = urlFor(os === 'mac' ? 'darwin-arm64' : 'win32-x64', 'primary');
    } else if (!ready) {
      // 配置不可用：统一指向 GitHub 最新发行页（原因已在上面记录）
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

  // “其他下载”下拉菜单交互
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

main();
