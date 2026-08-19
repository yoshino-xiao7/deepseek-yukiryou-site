/**
 * 全站中英双语内容字典。
 * 简体中文为默认语言（挂在 / 下），英文挂在 /en/ 下。
 */

export type Lang = 'zh-CN' | 'en';

export const LANGS: Lang[] = ['zh-CN', 'en'];

export const LANG_LABEL: Record<Lang, string> = {
  'zh-CN': '中文',
  en: 'EN',
};

/** 应用与项目相关的常量（两种语言共用） */
export const PROJECT = {
  name: 'DeepSeek YukiRyou',
  repo: 'https://github.com/yoshino-xiao7/deepseek-harness-desktop-yukiryou',
  releases:
    'https://github.com/yoshino-xiao7/deepseek-harness-desktop-yukiryou/releases',
  latest:
    'https://github.com/yoshino-xiao7/deepseek-harness-desktop-yukiryou/releases/latest',
  issues:
    'https://github.com/yoshino-xiao7/deepseek-harness-desktop-yukiryou/issues',
  license: 'https://github.com/yoshino-xiao7/deepseek-harness-desktop-yukiryou/blob/main/LICENSE',
  icon: '/app-icon-512.png',
  version: '0.2.1-beta.1',
  dmgName: 'DeepSeek.YukiRyou-<version>-arm64.dmg',
} as const;

export interface NavItem {
  href: string;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export interface StepItem {
  title: string;
  desc: string;
}

export interface RoadmapItem {
  status: 'dev' | 'planned';
  statusLabel: string;
  title: string;
  desc: string;
}

export interface Dict {
  htmlLang: string;
  /** 页面级 SEO */
  meta: {
    title: string;
    description: string;
    ogTitle: string;
  };
  /** 导航 */
  nav: {
    features: string;
    why: string;
    how: string;
    install: string;
    roadmap: string;
    security: string;
    faq: string;
    download: string;
    viewOnGitHub: string;
  };
  /** Hero */
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    disclaimer: string;
    requirements: string[];
    versionLabel: string;
  };
  /** 应用窗口示意图 */
  window: {
    tabFiles: string;
    tabChanges: string;
    fileTree: string;
    gitChanges: string;
    linesAdded: string;
    linesRemoved: string;
    chatPlaceholder: string;
    balance: string;
  };
  /** 功能特性 */
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: FeatureItem[];
  };
  /** 为什么选择 */
  why: {
    eyebrow: string;
    title: string;
    subtitle: string;
    points: FeatureItem[];
    compareTitle: string;
    compare: {
      header: [string, string, string, string];
      rows: Array<[string, string, string, string]>;
      highlight: number;
    };
  };
  /** 工作原理 */
  how: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: StepItem[];
    notes: string[];
  };
  /** 安装 */
  install: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: StepItem[];
    requirementsTitle: string;
    requirements: string[];
    fileNameTitle: string;
    fileNameDesc: string;
    shaNote: string;
    cta: string;
  };
  /** 路线图 */
  roadmap: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: RoadmapItem[];
    note: string;
  };
  /** 安全与隐私 */
  security: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: FeatureItem[];
  };
  /** FAQ */
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: FaqItem[];
  };
  /** 底部 CTA */
  cta: {
    title: string;
    subtitle: string;
    download: string;
    star: string;
    feedback: string;
  };
  /** 页脚 */
  footer: {
    tagline: string;
    disclaimer: string;
    license: string;
    copyright: string;
    projectLinks: string;
    navTitle: string;
  };
}

export const t: Record<Lang, Dict> = {
  'zh-CN': {
    htmlLang: 'zh-CN',
    meta: {
      title: 'DeepSeek YukiRyou — 让 DeepSeek Harness 真正像一个 Mac 应用',
      description:
        '面向 Apple Silicon 的独立 DeepSeek Harness 桌面工作台：内置运行时、账户余额、工作区审阅、文件预览与可信更新，打开即可工作。macOS 14+。',
      ogTitle: 'DeepSeek YukiRyou — DeepSeek Harness Desktop for macOS',
    },
    nav: {
      features: '功能',
      why: '为什么选择',
      how: '工作原理',
      install: '安装',
      roadmap: '路线图',
      security: '安全',
      faq: 'FAQ',
      download: '下载',
      viewOnGitHub: '在 GitHub 上查看',
    },
    hero: {
      badge: 'Apple Silicon Beta',
      title: '让 DeepSeek Harness',
      titleAccent: '真正像一个 Mac 应用',
      subtitle:
        '为 Apple Silicon 打造的独立桌面工作台：内置运行时、账户余额、工作区审阅、文件预览与可信更新，打开即可工作。',
      ctaPrimary: '下载应用',
      ctaSecondary: '在 GitHub 上查看',
      disclaimer: '社区开源项目，非 DeepSeek 官方产品',
      requirements: ['macOS 14+', 'Apple Silicon (M1+)', 'MIT License'],
      versionLabel: '最新版本',
    },
    window: {
      tabFiles: '文件',
      tabChanges: '变更',
      fileTree: '文件树',
      gitChanges: '相对 HEAD 的 Git 变更',
      linesAdded: '新增',
      linesRemoved: '删除',
      chatPlaceholder: 'Harness Web UI 运行于此窗口',
      balance: '账户余额',
    },
    features: {
      eyebrow: '功能特性',
      title: '把 Harness 收进一个可安装的 Mac 应用',
      subtitle:
        '不是 Harness 的重写，也不改变 Agent 的工作方式——专注把 Harness 稳定、安全、可恢复地交付到桌面。',
      items: [
        {
          icon: 'rocket',
          title: '打开即用',
          desc: '内置固定版本的 Node.js、pnpm 与 DeepSeek Harness，不读取全局环境，首次启动也无需联网安装依赖。',
        },
        {
          icon: 'mac',
          title: '原生体验',
          desc: '原生交通灯、可拖动顶栏，浅色、深色与跟随系统主题同步生效，侧栏动画与 Harness 视觉状态融为一体。',
        },
        {
          icon: 'wallet',
          title: '账户余额',
          desc: '在设置上方直接查看当前 DeepSeek 凭据所属账户的余额，一眼掌握用量。',
        },
        {
          icon: 'git',
          title: '工作区审阅',
          desc: '可收起右栏提供当前工作区文件树、相对 HEAD 的 Git 变更、增删行统计与只读 diff。',
        },
        {
          icon: 'file',
          title: '适合阅读的预览',
          desc: 'Markdown 可在排版与源码之间切换，纯文本与常见图片也能在应用内直接预览。',
        },
        {
          icon: 'list',
          title: '逐轮变更入口',
          desc: '在 Harness 原生“产物”行下方展示本轮确认变更，点击即可进入对应文件审核。',
        },
        {
          icon: 'heart',
          title: '安静的生命周期',
          desc: '单实例运行，关闭窗口可隐藏；Harness 与本地界面异常时分别恢复，不让一个区域的故障拖垮整个窗口。',
        },
        {
          icon: 'shield',
          title: '可信更新',
          desc: 'Developer ID 签名、Apple 公证、SHA-256 校验与应用内检查更新，下载完成后由你确认重启安装。',
        },
      ],
    },
    why: {
      eyebrow: '为什么选择 YukiRyou',
      title: '官方 Web UI 之外的桌面能力',
      subtitle:
        '官方 DeepSeek Harness 提供 Web UI，但日常使用仍需要准备运行环境、启动命令、管理端口和处理异常退出。YukiRyou 把这些收进一个应用。',
      points: [
        {
          icon: 'rocket',
          title: '不是网页快捷方式',
          desc: '独立应用携带固定运行时与 Harness，双击启动、退出回收自己创建的进程，不依赖你电脑上的全局环境。',
        },
        {
          icon: 'git',
          title: '工作区审阅闭环',
          desc: '在对话之外直接查看文件树、当前 Git 变更、逐轮变更、增删行和 Markdown 渲染结果，一站式完成审阅。',
        },
        {
          icon: 'check',
          title: '发布结果可验证',
          desc: '公开包经过 Developer ID 签名、Apple 公证、全新环境安装与真实应用稳定性验证，并附带 SHA-256 校验文件。',
        },
      ],
      compareTitle: '与其它方式对比',
      compare: {
        header: ['对比项', '官方 Web UI', '浏览器快捷方式', 'DeepSeek YukiRyou'],
        rows: [
          ['运行环境准备', '需要 Node、pnpm 与启动命令', '需要先自行启动服务', '应用内置，打开即用'],
          ['桌面能力', '无', '无', '账户余额、文件树、Git 变更、diff 与预览'],
          ['进程管理', '手动启动与清理', '手动', '单实例、自动恢复、退出回收'],
          ['更新方式', '手动', '手动', '应用内检查，签名与公证校验'],
          ['离线可复现', '依赖本机环境', '依赖本机环境', '内置固定版本运行时'],
        ],
        highlight: 3,
      },
    },
    how: {
      eyebrow: '它如何运行',
      title: '稳定、隔离、可恢复',
      subtitle: 'Harness 运行在应用内置的固定版本运行时中，只对本地可见。',
      steps: [
        { title: 'DeepSeek YukiRyou.app', desc: '双击启动，应用拉起内置运行时' },
        { title: 'Electron 主进程', desc: '负责原生窗口、更新与恢复' },
        { title: '应用内置 Node.js', desc: '不读取用户全局安装' },
        { title: '固定版本 Harness', desc: '与桌面壳一起作为原子发布单元' },
        { title: '随机 127.0.0.1 端口', desc: '只监听回环地址，不暴露到局域网' },
        { title: '隔离的 WebContentsView', desc: '关闭 Node 集成、上下文隔离与沙盒' },
      ],
      notes: [
        'Harness 只监听随机回环地址，不向局域网暴露服务。',
        '网页运行在关闭 Node 集成、启用上下文隔离与沙盒的独立视图中。',
        '桌面桥只开放经过校验的少量能力。',
      ],
    },
    install: {
      eyebrow: '下载与安装',
      title: '三步开始工作',
      subtitle: '前往 GitHub Releases 下载适用于 Apple Silicon 的 DMG，拖入“应用程序”即可。',
      steps: [
        {
          title: '下载 DMG',
          desc: '从 GitHub Releases 下载 DeepSeek.YukiRyou-<version>-arm64.dmg',
        },
        {
          title: '拖入应用程序',
          desc: '打开 DMG，将 DeepSeek YukiRyou 拖入“应用程序”目录',
        },
        {
          title: '启动并配置',
          desc: '从 Launchpad 启动，在 Harness 界面完成所需的服务配置',
        },
      ],
      requirementsTitle: '系统要求',
      requirements: ['Apple Silicon Mac（M1 或更新芯片）', 'macOS 14 或更高版本'],
      fileNameTitle: '安装包命名',
      fileNameDesc: '每个正式版本同时提供 SHA-256 校验文件，请只从 GitHub Releases 下载。',
      shaNote:
        '应用与更新包均使用 Developer ID 签名并经过 Apple 公证；不要从非可信来源下载安装包。',
      cta: '前往 Releases 下载',
    },
    roadmap: {
      eyebrow: '路线图',
      title: '下一步',
      subtitle: '路线图表示产品方向，不承诺具体发布日期；安全模型或上游接口准备不足时，功能会继续保持不可用。',
      items: [
        {
          status: 'dev',
          statusLabel: '开发中',
          title: 'DeepSeek 宠物',
          desc: '在 Companion 宠物活动区实现稳定角色形象、待机眨眼、睡眠/唤醒与运行时“疯狂进食 token”状态。',
        },
        {
          status: 'planned',
          statusLabel: '规划中',
          title: '手机远程控制',
          desc: '通过明确配对与权限边界，在手机端查看任务状态、接收必要提醒，并在确认后继续任务。',
        },
        {
          status: 'planned',
          statusLabel: '规划中',
          title: '插件市场',
          desc: '提供插件发现、详情、安装、更新、移除与权限说明，在设计验证后再开放安装能力。',
        },
      ],
      note: '产品方向不代表承诺：不会通过不稳定的 DOM 注入或降低系统安全要求来提前上线功能。',
    },
    security: {
      eyebrow: '安全与隐私',
      title: '边界清晰，开箱可信',
      subtitle: '从网络边界、渲染隔离到发布供应链，每一层都有明确的安全设计。',
      items: [
        {
          icon: 'lock',
          title: '随机回环端口',
          desc: 'Harness 只监听随机的 127.0.0.1 地址，不向局域网暴露服务，也不开放公网访问。',
        },
        {
          icon: 'shield',
          title: '隔离的网页视图',
          desc: '网页运行在关闭 Node 集成、启用上下文隔离与沙盒的独立视图中，桌面桥仅开放少量校验过的能力。',
        },
        {
          icon: 'privacy',
          title: '隐私友好的诊断',
          desc: '导出的诊断包只包含脱敏后的环境摘要和有界日志，不打包项目源码、会话或凭据。',
        },
        {
          icon: 'check',
          title: '可信发布链',
          desc: '候选包经过 Developer ID 签名、异机安装、真实应用稳定性测试、Apple 公证与最终复验后才公开。',
        },
      ],
    },
    faq: {
      eyebrow: '常见问题',
      title: 'FAQ',
      subtitle: '更多问题可以在 GitHub Issues 中找到答案。',
      items: [
        {
          question: '这是 DeepSeek 官方客户端吗？',
          answer:
            '不是。这是由社区独立开发的 macOS 桌面项目，与 DeepSeek 官方没有隶属或背书关系。',
        },
        {
          question: '支持 Intel Mac 或 Windows 吗？',
          answer: '当前只交付 Apple Silicon arm64 版本。Intel、Windows 和 Linux 不在当前发布范围内。',
        },
        {
          question: '为什么安装包比较大？',
          answer:
            '为了做到离线可启动和版本可复现，应用内置了经过校验的 Node.js、pnpm 与 Harness 运行时，而不是依赖用户电脑上的全局环境。',
        },
        {
          question: '遇到启动问题怎么办？',
          answer:
            '先使用应用菜单导出诊断包，再到 GitHub Issues 描述 macOS 版本、应用版本与复现步骤。提交前请确认附件中没有不希望公开的信息。',
        },
        {
          question: '如何更新应用？',
          answer:
            '应用启动后会自动检查公开 GitHub Release，也可以在“设置 → 关于”中手动检查。下载完成后由你确认重启安装。',
        },
      ],
    },
    cta: {
      title: '开始使用 DeepSeek YukiRyou',
      subtitle:
        '下载应用，让 DeepSeek Harness 像真正的 Mac 应用一样工作。如果这个项目对你有帮助，欢迎点一个 Star。',
      download: '下载应用',
      star: '⭐ Star 支持',
      feedback: '反馈问题',
    },
    footer: {
      tagline: '面向 Apple Silicon 的 DeepSeek Harness 桌面工作台',
      disclaimer:
        '本项目是由社区独立开发的开源项目，与 DeepSeek 官方没有隶属或背书关系。DeepSeek 与 DeepSeek Harness 名称归其各自权利人所有。',
      license: '基于 MIT License 开源',
      copyright: '© 2026 YukiRyou · yoshino-xiao7',
      projectLinks: '项目链接',
      navTitle: '站点导航',
    },
  },
  en: {
    htmlLang: 'en',
    meta: {
      title: 'DeepSeek YukiRyou — Make DeepSeek Harness Feel Like a Real Mac App',
      description:
        'A standalone DeepSeek Harness desktop workbench for Apple Silicon: bundled runtime, account balance, workspace review, file preview, and trusted updates. Open and run. macOS 14+.',
      ogTitle: 'DeepSeek YukiRyou — DeepSeek Harness Desktop for macOS',
    },
    nav: {
      features: 'Features',
      why: 'Why YukiRyou',
      how: 'How it works',
      install: 'Install',
      roadmap: 'Roadmap',
      security: 'Security',
      faq: 'FAQ',
      download: 'Download',
      viewOnGitHub: 'View on GitHub',
    },
    hero: {
      badge: 'Apple Silicon Beta',
      title: 'Make DeepSeek Harness',
      titleAccent: 'feel like a real Mac app',
      subtitle:
        'A standalone desktop workbench for Apple Silicon: bundled runtime, account balance, workspace review, file preview, and trusted updates. Open and run.',
      ctaPrimary: 'Download App',
      ctaSecondary: 'View on GitHub',
      disclaimer: 'An open-source community project, not an official DeepSeek product',
      requirements: ['macOS 14+', 'Apple Silicon (M1+)', 'MIT License'],
      versionLabel: 'Latest release',
    },
    window: {
      tabFiles: 'Files',
      tabChanges: 'Changes',
      fileTree: 'File tree',
      gitChanges: 'Git changes vs HEAD',
      linesAdded: 'added',
      linesRemoved: 'removed',
      chatPlaceholder: 'Harness Web UI runs in this window',
      balance: 'Account balance',
    },
    features: {
      eyebrow: 'Features',
      title: 'Put Harness into an installable Mac app',
      subtitle:
        'Not a rewrite of Harness, and it never changes how Agents work — it delivers Harness to your desktop stably, securely, and recoverably.',
      items: [
        {
          icon: 'rocket',
          title: 'Open and run',
          desc: 'Ships with pinned Node.js, pnpm, and DeepSeek Harness. Ignores your global environment, and no first-run dependency downloads.',
        },
        {
          icon: 'mac',
          title: 'Native experience',
          desc: 'Native traffic lights and a draggable title bar. Light, dark, and system themes stay in sync with Harness visuals.',
        },
        {
          icon: 'wallet',
          title: 'Account balance',
          desc: 'See the balance of the DeepSeek account behind your credentials, right above Settings.',
        },
        {
          icon: 'git',
          title: 'Workspace review',
          desc: 'A collapsible companion panel with the file tree, Git changes vs HEAD, added/removed line stats, and read-only diff.',
        },
        {
          icon: 'file',
          title: 'Readable previews',
          desc: 'Toggle Markdown between rendered and source views; preview plain text and common images right in the app.',
        },
        {
          icon: 'list',
          title: 'Per-turn changes',
          desc: 'Confirmed changes for each turn appear below native Harness outputs — one click opens the file for review.',
        },
        {
          icon: 'heart',
          title: 'Quiet lifecycle',
          desc: 'Single instance; hide instead of quit. Harness and the local UI recover independently, so one failure never takes down the window.',
        },
        {
          icon: 'shield',
          title: 'Trusted updates',
          desc: 'Developer ID signed, Apple notarized, SHA-256 verified, with in-app update checks. You confirm before restarting to install.',
        },
      ],
    },
    why: {
      eyebrow: 'Why YukiRyou',
      title: 'Desktop capabilities beyond the official Web UI',
      subtitle:
        'The official DeepSeek Harness ships a Web UI, but daily use still means preparing a runtime, typing launch commands, juggling ports, and handling crashes. YukiRyou folds all of that into one app.',
      points: [
        {
          icon: 'rocket',
          title: 'Not a web shortcut',
          desc: 'A standalone app with a pinned runtime and Harness: double-click to launch, and it cleans up its own processes on quit.',
        },
        {
          icon: 'git',
          title: 'A complete review loop',
          desc: 'Beyond chat: file tree, current Git changes, per-turn changes, line stats, and rendered Markdown in one place.',
        },
        {
          icon: 'check',
          title: 'Verifiable releases',
          desc: 'Public packages are Developer ID signed, Apple notarized, installed on clean machines, and stability-tested — with SHA-256 checksums.',
        },
      ],
      compareTitle: 'Compared with the alternatives',
      compare: {
        header: ['', 'Official Web UI', 'Browser shortcut', 'DeepSeek YukiRyou'],
        rows: [
          ['Runtime setup', 'Needs Node, pnpm, CLI', 'Service must be started first', 'Bundled — open and run'],
          ['Desktop capabilities', 'None', 'None', 'Balance, file tree, Git diff, previews'],
          ['Process management', 'Manual start/cleanup', 'Manual', 'Single instance, self-healing, cleanup on quit'],
          ['Updates', 'Manual', 'Manual', 'In-app check, signed and notarized'],
          ['Reproducible offline', 'Depends on local env', 'Depends on local env', 'Pinned bundled runtime'],
        ],
        highlight: 3,
      },
    },
    how: {
      eyebrow: 'How it works',
      title: 'Stable, isolated, recoverable',
      subtitle: 'Harness runs on a pinned runtime bundled inside the app, visible only to your machine.',
      steps: [
        { title: 'DeepSeek YukiRyou.app', desc: 'Double-click to launch; the app starts its bundled runtime' },
        { title: 'Electron main process', desc: 'Owns the native window, updates, and recovery' },
        { title: 'Bundled Node.js', desc: 'Never touches your global installs' },
        { title: 'Pinned Harness version', desc: 'Shipped as one atomic unit with the desktop shell' },
        { title: 'Random 127.0.0.1 port', desc: 'Loopback only — never exposed to the LAN' },
        { title: 'Isolated WebContentsView', desc: 'Node integration off, context isolation and sandbox on' },
      ],
      notes: [
        'Harness only listens on a random loopback address and is never exposed to the LAN.',
        'Web content runs in a sandboxed view with Node integration disabled and context isolation enabled.',
        'The desktop bridge exposes only a small set of validated capabilities.',
      ],
    },
    install: {
      eyebrow: 'Download & install',
      title: 'Three steps to start',
      subtitle: 'Grab the Apple Silicon DMG from GitHub Releases and drag it into Applications.',
      steps: [
        {
          title: 'Download the DMG',
          desc: 'Download DeepSeek.YukiRyou-<version>-arm64.dmg from GitHub Releases',
        },
        {
          title: 'Drag into Applications',
          desc: 'Open the DMG and drag DeepSeek YukiRyou into your Applications folder',
        },
        {
          title: 'Launch and configure',
          desc: 'Launch from Launchpad, then configure services in the Harness UI',
        },
      ],
      requirementsTitle: 'System requirements',
      requirements: ['Apple Silicon Mac (M1 or newer)', 'macOS 14 or later'],
      fileNameTitle: 'Package naming',
      fileNameDesc: 'Every release ships SHA-256 checksums. Only download from GitHub Releases.',
      shaNote:
        'The app and update packages are Developer ID signed and Apple notarized. Never install from untrusted sources.',
      cta: 'Go to Releases',
    },
    roadmap: {
      eyebrow: 'Roadmap',
      title: 'What\u2019s next',
      subtitle:
        'The roadmap signals direction, not release dates; features stay unavailable until the security model or upstream interfaces are ready.',
      items: [
        {
          status: 'dev',
          statusLabel: 'In development',
          title: 'DeepSeek Pet',
          desc: 'A stable companion character with idle blinking, sleep/wake states, and a “gobbling tokens” runtime animation — confined to its activity area.',
        },
        {
          status: 'planned',
          statusLabel: 'Planned',
          title: 'Mobile remote control',
          desc: 'With explicit pairing and permission boundaries: check task status on your phone, get essential alerts, and confirm before the agent continues.',
        },
        {
          status: 'planned',
          statusLabel: 'Planned',
          title: 'Plugin marketplace',
          desc: 'Plugin discovery, details, install, update, removal, and permission disclosure — after design, signature, and compatibility validation.',
        },
      ],
      note: 'Direction, not promises: features are never shipped early via unstable DOM injection or by lowering security requirements.',
    },
    security: {
      eyebrow: 'Security & privacy',
      title: 'Clear boundaries, trustworthy out of the box',
      subtitle: 'From network edges to rendering isolation and the release supply chain, every layer has an explicit security design.',
      items: [
        {
          icon: 'lock',
          title: 'Random loopback port',
          desc: 'Harness listens only on a random 127.0.0.1 address — never exposed to the LAN and never open to the public internet.',
        },
        {
          icon: 'shield',
          title: 'Isolated web view',
          desc: 'Web content runs in a sandboxed view with Node integration disabled and context isolation enabled; the bridge exposes only validated capabilities.',
        },
        {
          icon: 'privacy',
          title: 'Privacy-friendly diagnostics',
          desc: 'Exported diagnostics contain only a sanitized environment summary and bounded logs — no source code, sessions, or credentials.',
        },
        {
          icon: 'check',
          title: 'Trusted supply chain',
          desc: 'Candidates ship only after Developer ID signing, clean-machine installs, real-world stability testing, Apple notarization, and final verification.',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      subtitle: 'Find more answers on GitHub Issues.',
      items: [
        {
          question: 'Is this an official DeepSeek client?',
          answer:
            'No. This is an independently developed open-source macOS project with no affiliation or endorsement from DeepSeek.',
        },
        {
          question: 'Does it support Intel Macs or Windows?',
          answer:
            'Only Apple Silicon arm64 builds are shipped today. Intel, Windows, and Linux are out of scope for now.',
        },
        {
          question: 'Why is the installer so large?',
          answer:
            'For offline startup and reproducible versions, the app bundles verified Node.js, pnpm, and Harness runtimes instead of relying on your global environment.',
        },
        {
          question: 'What if the app fails to start?',
          answer:
            'Export a diagnostics package from the app menu, then open a GitHub Issue with your macOS version, app version, and steps to reproduce. Review the attachment for anything you do not want public.',
        },
        {
          question: 'How do updates work?',
          answer:
            'The app checks public GitHub Releases in the background and offers updates in Settings → About. You confirm before restarting to install.',
        },
      ],
    },
    cta: {
      title: 'Get started with DeepSeek YukiRyou',
      subtitle:
        'Download the app and let DeepSeek Harness work like a real Mac app. If this project helps you, give it a star.',
      download: 'Download App',
      star: '⭐ Star us',
      feedback: 'Report an issue',
    },
    footer: {
      tagline: 'A DeepSeek Harness desktop workbench for Apple Silicon',
      disclaimer:
        'An open-source community project with no affiliation or endorsement from DeepSeek. DeepSeek and DeepSeek Harness names belong to their respective owners.',
      license: 'Open source under the MIT License',
      copyright: '© 2026 YukiRyou · yoshino-xiao7',
      projectLinks: 'Project',
      navTitle: 'Site',
    },
  },
};

export const faqJsonLd = (lang: Lang): FaqItem[] => t[lang].faq.items;
