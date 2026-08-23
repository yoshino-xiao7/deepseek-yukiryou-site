/**
 * 下载中心客户端逻辑（全站共享，随 Base 布局加载）。
 *
 * 1. 读取国内 OSS 清单 latest.json（CORS 已对本站放行）
 * 2. 成功：绑定四个直链（DMG / macOS ZIP / Windows Setup / Windows 便携版），
 *    按系统切换主按钮标签与链接，并刷新版本号徽章与安装区文件名
 * 3. 失败（国内源不可用 / 海外被 ESA 拦截）：所有下载入口统一跳转 GitHub 最新发行页
 *
 * 无 JS / 脚本失败时，所有链接保持 SSR 默认的 GitHub 最新发行页，行为一致。
 */
const MANIFEST_URL = 'https://download-cn.suzuki.ink/downloads/latest.json';
const GITHUB_LATEST =
  'https://github.com/yoshino-xiao7/deepseek-harness-desktop-yukiryou/releases/latest';

interface Artifact {
  name?: string;
  url?: string;
  size?: number;
  sha256?: string;
}

interface Manifest {
  version?: string;
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

async function main() {
  let manifest: Manifest | null = null;
  try {
    const res = await fetch(MANIFEST_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    manifest = (await res.json()) as Manifest;
  } catch {
    manifest = null;
  }

  const os = detectOS();
  const ready =
    !!manifest?.platforms?.['darwin-arm64'] && !!manifest?.platforms?.['win32-x64'];

  const urlFor = (platform: string, kind: Kind): string =>
    manifest?.platforms?.[platform]?.[kind]?.url || GITHUB_LATEST;
  const nameFor = (platform: string, kind: Kind): string | undefined =>
    manifest?.platforms?.[platform]?.[kind]?.name;
  const sizeFor = (platform: string, kind: Kind): number | undefined =>
    manifest?.platforms?.[platform]?.[kind]?.size;

  // 版本号徽章（data-dl-version）
  if (manifest?.version) {
    document.querySelectorAll<HTMLElement>('[data-dl-version]').forEach((el) => {
      el.textContent = manifest!.version!;
    });
  }

  // 主下载按钮：按系统切换标签与链接
  document.querySelectorAll<HTMLAnchorElement>('[data-dl-main]').forEach((btn) => {
    const label = btn.querySelector<HTMLElement>('[data-dl-label]');
    if (ready && os && label) {
      label.textContent =
        os === 'mac' ? (label.dataset.labelMac ?? '') : (label.dataset.labelWin ?? '');
      btn.href = urlFor(os === 'mac' ? 'darwin-arm64' : 'win32-x64', 'primary');
    } else {
      // 清单不可用 / 系统未知：统一跳 GitHub 最新发行页
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
    } else {
      link.href = GITHUB_LATEST;
    }
  });

  // 安装区文件名（data-dl-file，替换 <version> 占位符）
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
