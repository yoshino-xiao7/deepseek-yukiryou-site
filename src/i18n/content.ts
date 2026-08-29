/**
 * 全站中英双语内容字典。
 * 简体中文为默认语言（挂在 / 下），英文挂在 /en/ 下。
 */
import release from '../generated/release.json';
import downloads from '../generated/downloads.json';

export type Lang = 'zh-CN' | 'en';

export const LANGS: Lang[] = ['zh-CN', 'en'];

export const LANG_LABEL: Record<Lang, string> = {
  'zh-CN': '中文',
  en: 'EN',
};

export interface DownloadArtifact {
  name?: string;
  url?: string;
  size?: number;
  sha256?: string;
}

/**
 * 下载配置：构建时由 scripts/fetch-downloads.mjs 从国内 OSS 清单生成。
 * source 为 'oss' 时四个直链可用；为 'github' 时页面回退 GitHub 最新发行页。
 */
export interface DownloadConfig {
  schemaVersion: number;
  version: string | null;
  source: 'oss' | 'github';
  platforms: Record<
    string,
    { primary?: DownloadArtifact; alternative?: DownloadArtifact }
  >;
}

export const DOWNLOADS = downloads as DownloadConfig;

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
  /** 版本号：构建时由 scripts/fetch-release.mjs 从 GitHub Releases 动态获取 */
  version: release.version,
  /** 安装包文件名：SSR 回退值，运行时由下载清单 latest.json 覆盖为实际文件名 */
  dmgName: `DeepSeek.YukiRyou-${release.version}-arm64.dmg`,
  winExeName: `DeepSeek.YukiRyou-${release.version}-win32-x64-Setup.exe`,
  winZipName: `DeepSeek.YukiRyou-win32-x64-${release.version}-portable.zip`,
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
  /** 卡片下方的等宽小标签（对齐 Harness 官网卡片版式），可选 */
  mono?: string;
}

/** 概念区三卡：标题 + 等宽副标签 + 说明，可带外链 */
export interface ConceptItem {
  icon: string;
  title: string;
  mono: string;
  desc: string;
  href?: string;
}

/** 平台切换区的单个 Tab */
export interface PlatformTab {
  id: string;
  label: string;
  icon: string;
  title: string;
  desc: string;
  points: string[];
}

export interface StepItem {
  title: string;
  desc: string;
}

export interface RoadmapItem {
  status: 'dev' | 'planned' | 'paused';
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
    concept: string;
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
    /** Hero 上方一行说明（对齐 Harness 官网的 preview label） */
    kicker: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    /** Hero 副文案第二段 */
    subtitle2: string;
    ctaPrimary: string;
    ctaSecondary: string;
    disclaimer: string;
    requirements: string[];
    versionLabel: string;
    shotAlt: string;
    shotCaption: string;
    /** 终端卡片：双 Tab（安装 / 启动）与复制按钮 */
    terminal: {
      tabs: [string, string];
      cmds: [string, string];
      copy: string;
      copied: string;
    };
  };
  /** 概念区：Agent = Model + Harness */
  concept: {
    eyebrow: string;
    titleLead: string;
    titleRest: string;
    lines: string[];
    items: ConceptItem[];
  };
  /** 设计理念（左文右图，两条大图文） */
  approach: {
    eyebrow: string;
    title: string;
    items: Array<{
      title: string;
      desc: string;
      image?: string;
      imageAlt?: string;
    }>;
  };
  /** 平台切换区（Tabs） */
  platforms: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tabs: PlatformTab[];
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
  /** 下载中心（构建时生成的下载配置，SSR 内联直链） */
  download: {
    app: string;
    mac: string;
    windows: string;
    menu: string;
    macDmg: string;
    macZip: string;
    windowsSetup: string;
    windowsPortable: string;
    github: string;
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
      title: 'DeepSeek YukiRyou — 让 DeepSeek Harness 真正像一个原生桌面应用',
      description:
        '面向 macOS 与 Windows 的独立 DeepSeek Harness 桌面工作台：内置运行时、账户余额、工作区审阅、文件预览、社区插件市场与可信更新，打开即可工作。macOS 14+ 与 Windows 11。',
      ogTitle: 'DeepSeek YukiRyou — DeepSeek Harness Desktop for macOS & Windows',
    },
    nav: {
      concept: '理念',
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
      badge: 'macOS & Windows Beta',
      kicker: 'DeepSeek Harness 桌面版 · 社区项目',
      title: '不用配环境的',
      titleAccent: 'Harness 桌面版',
      subtitle:
        'DeepSeek YukiRyou 把 DeepSeek Harness 封装成一个可安装的桌面应用，内置固定版本运行时，双击即可开始工作。',
      subtitle2:
        '账户余额、工作区审阅、Git 变更、文件预览、社区插件市场与可信更新，全部收在一个原生窗口里。',
      ctaPrimary: '下载应用',
      ctaSecondary: '在 GitHub 上查看',
      disclaimer: '社区开源项目，非 DeepSeek 官方产品',
      requirements: ['macOS 14+（Apple Silicon）', 'Windows 11 x64（Beta）', 'MIT License'],
      versionLabel: '最新版本',
      shotAlt: 'DeepSeek YukiRyou 应用截图：原生窗口中的 Harness 工作台',
      shotCaption: 'DeepSeek YukiRyou · 原生窗口中的 Harness 工作台',
      terminal: {
        tabs: ['校验（macOS）', '校验（Windows）'],
        cmds: [
          'shasum -a 256 DeepSeek.YukiRyou-*-arm64.dmg',
          'Get-FileHash .\\DeepSeek.YukiRyou-*-Setup.exe -Algorithm SHA256',
        ],
        copy: '复制',
        copied: '已复制',
      },
    },
    concept: {
      eyebrow: 'Harness = Runtime + Desktop',
      titleLead: '桌面壳',
      titleRest: '让 Harness 稳定运行在你的电脑上',
      lines: [
        'Harness 是 Agent 的躯体。',
        '桌面壳负责把这个躯体装进操作系统：管好运行时、进程、窗口与更新。',
      ],
      items: [
        {
          icon: 'rocket',
          title: '固定版本运行时',
          mono: 'PINNED RUNTIME',
          desc: '应用自带经过校验的 Node.js、pnpm 与 DeepSeek Harness，不读取全局环境，首次启动无需联网装依赖。',
        },
        {
          icon: 'mac',
          title: '原生桌面外壳',
          mono: 'NATIVE SHELL',
          desc: 'Electron 主进程负责原生窗口、交通灯、托盘与更新；单实例运行，关窗即隐藏，退出回收自己拉起的进程。',
        },
        {
          icon: 'shield',
          title: '隔离的回环边界',
          mono: 'LOOPBACK ONLY',
          desc: 'Harness 只监听应用持久选择的稳定 127.0.0.1 回环地址，不向局域网暴露；网页跑在关闭 Node 集成、启用上下文隔离与沙盒的独立视图中。',
        },
      ],
    },
    approach: {
      eyebrow: 'Design approach',
      title: '打开即用，每次发布都可验证。',
      items: [
        {
          title: '打开即用',
          desc: '不需要准备 Node、不需要记启动命令、不需要管端口。应用携带固定版本的运行时与 Harness 作为一个原子发布单元，双击图标即进入工作台；Harness 与本地界面异常时分别恢复，一个区域的故障不会拖垮整个窗口。',
          image: '/app-screenshot.png',
          imageAlt: 'DeepSeek YukiRyou 主界面：原生窗口中的 Harness 工作台',
        },
        {
          title: '每次变更都可审阅',
          desc: '文件树、相对 HEAD 的 Git 变更、增删行统计与只读 diff 都在应用内：支持搜索、筛选、顺序审阅与预览内查找，文件与代码行可直接拖入对话。每一轮确认的变更展示在产物行下方，点击即进入对应文件审核。',
        },
        {
          title: '发布链路可核验',
          desc: 'macOS 公开包经过 Developer ID 签名、Apple 公证、全新环境安装与真实应用稳定性验证，并附带 SHA-256 校验文件。插件安装前核验目录来源、npm 精确身份、依赖图、SHA-512 与官方 tarball，不降低安全要求。',
        },
      ],
    },
    platforms: {
      eyebrow: 'Get started',
      title: '选择你的平台',
      subtitle: '同一个 Release 同时交付 macOS 与 Windows 产物，来自同一提交、携带同一固定运行时。',
      tabs: [
        {
          id: 'mac',
          label: 'macOS',
          icon: 'apple',
          title: 'macOS 14+（Apple Silicon）',
          desc: '公开版经 Developer ID 签名与 Apple 公证，下载 DMG 拖入「应用程序」即可。',
          points: [
            'DMG 安装版，或 ZIP 直接解压运行',
            '原生交通灯、可拖动顶栏、侧栏自适应停靠',
            '浅色 / 深色 / 跟随系统主题同步生效',
            '应用内检查更新，下载完成后由你确认重启安装',
          ],
        },
        {
          id: 'win',
          label: 'Windows',
          icon: 'windows',
          title: 'Windows 11 x64（Beta）',
          desc: '提供 NSIS 安装包与免安装便携版；当前产物未经 Authenticode 签名，安装前请核对 SHA-256。',
          points: [
            'Setup.exe 安装版，或便携 ZIP 解压即用',
            '平台化运行时与 ConPTY 终端支持',
            '与 macOS 同版本、同提交交付',
            '首次运行可能出现 SmartScreen 提示',
          ],
        },
      ],
    },
    features: {
      eyebrow: 'Capabilities',
      title: '把 Harness 收进一个可安装的 Mac 应用',
      subtitle:
        '不是 Harness 的重写，也不改变 Agent 的工作方式——专注把 Harness 稳定、安全、可恢复地交付到桌面。',
      items: [
        {
          icon: 'rocket',
          title: '打开即用',
          mono: 'OPEN AND RUN',
          desc: '内置固定版本的 Node.js、pnpm 与 DeepSeek Harness，不读取全局环境，首次启动也无需联网安装依赖。',
        },
        {
          icon: 'mac',
          title: '原生体验',
          mono: 'NATIVE EXPERIENCE',
          desc: '原生交通灯、可拖动顶栏，侧栏窄窗口覆盖、宽窗口停靠；浅色、深色与跟随系统主题同步生效，与 Harness 视觉融为一体。',
        },
        {
          icon: 'wallet',
          title: '账户余额',
          mono: 'ACCOUNT BALANCE',
          desc: '在设置上方直接查看当前 DeepSeek 凭据所属账户的余额，一眼掌握用量。',
        },
        {
          icon: 'git',
          title: '工作区审阅',
          mono: 'WORKSPACE REVIEW',
          desc: '文件树、相对 HEAD 的 Git 变更、增删行统计与只读 diff；支持搜索、筛选、顺序审阅与预览内查找，文件与代码行可拖入对话。',
        },
        {
          icon: 'file',
          title: '适合阅读的预览',
          mono: 'READABLE PREVIEW',
          desc: 'Markdown 可在排版与源码之间切换，纯文本与常见图片也能在应用内直接预览。',
        },
        {
          icon: 'list',
          title: '逐轮变更入口',
          mono: 'PER-TURN CHANGES',
          desc: '在 Harness 原生“产物”行下方展示本轮确认变更，点击即可进入对应文件审核。',
        },
        {
          icon: 'heart',
          title: '安静的生命周期',
          mono: 'QUIET LIFECYCLE',
          desc: '单实例运行，关闭窗口可隐藏；Harness 与本地界面异常时分别恢复，不让一个区域的故障拖垮整个窗口。',
        },
        {
          icon: 'shield',
          title: '可信更新',
          mono: 'TRUSTED UPDATES',
          desc: 'Developer ID 签名、Apple 公证、SHA-256 校验与应用内检查更新，下载完成后由你确认重启安装。',
        },
        {
          icon: 'plugin',
          title: '社区插件市场',
          mono: 'PLUGIN MARKETPLACE',
          desc: '完整目录索引、搜索、分类、分页与来源管理；安装前安全预检，明确目录来源与本机状态。',
        },
        {
          icon: 'check',
          title: '受管插件生命周期',
          mono: 'MANAGED LIFECYCLE',
          desc: '安装、更新、重装、启用、停用、回滚与安全卸载；失败自动恢复旧版本，并阻断已知坏版本。',
        },
        {
          icon: 'windows',
          title: 'Windows 11 支持',
          mono: 'WINDOWS 11',
          desc: '新增平台化运行时、ConPTY 与 NSIS 安装包；同一版本在 macOS 与 Windows 双平台交付。',
        },
        {
          icon: 'file',
          title: 'Windows 便携版',
          mono: 'PORTABLE BUILD',
          desc: '便携 ZIP 解压即可直接运行，免安装；与安装版来自同一提交、携带同一固定运行时。',
        },
      ],
    },
    why: {
      eyebrow: 'Why YukiRyou',
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
          ['桌面能力', '无', '无', '账户余额、文件树、Git 变更、diff、预览与插件市场'],
          ['进程管理', '手动启动与清理', '手动', '单实例、自动恢复、退出回收'],
          ['更新方式', '手动', '手动', '应用内检查，签名与公证校验'],
          ['离线可复现', '依赖本机环境', '依赖本机环境', '内置固定版本运行时'],
          ['平台支持', '浏览器即可', '浏览器即可', 'macOS 14+（Apple Silicon）与 Windows 11（Beta）'],
        ],
        highlight: 3,
      },
    },
    how: {
      eyebrow: 'Architecture',
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
      eyebrow: 'Install',
      title: '三步开始工作',
      subtitle: '从 GitHub Releases 下载对应平台的安装包：macOS 拖入“应用程序”，Windows 运行安装程序（或使用便携版）。',
      steps: [
        {
          title: '下载安装包',
          desc: 'macOS 下载 DMG；Windows 下载 Setup.exe 或便携版 ZIP，均来自同一个 Release',
        },
        {
          title: '安装到系统',
          desc: 'macOS 拖入“应用程序”目录；Windows 运行安装程序，便携版解压即可直接运行',
        },
        {
          title: '启动并配置',
          desc: '从 Launchpad 或开始菜单启动，在 Harness 界面完成所需的服务配置',
        },
      ],
      requirementsTitle: '系统要求',
      requirements: ['macOS 14+（Apple Silicon）', 'Windows 11 x64（Beta）'],
      fileNameTitle: '安装包命名',
      fileNameDesc:
        '每个 Release 同时提供 macOS 与 Windows 产物（DMG、Setup.exe、便携 ZIP）并附带 SHA-256 校验文件，请只从 GitHub Releases 下载。',
      shaNote:
        'macOS 应用与更新包使用 Developer ID 签名并经过 Apple 公证；Windows 当前为未签名 Beta，安装前请核对 SHA-256。',
      cta: '前往 Releases 下载',
    },
    roadmap: {
      eyebrow: 'Roadmap',
      title: '下一步',
      subtitle: '路线图表示产品方向，不承诺具体发布日期；安全模型或上游接口准备不足时，功能会继续保持不可用。',
      items: [
        {
          status: 'paused',
          statusLabel: '已暂停',
          title: 'DeepSeek 宠物',
          desc: '角色形象、待机眨眼、睡眠/唤醒与运行时状态动画已开发至效果展示阶段；因开发方向调整，目前暂停推进。',
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
          title: 'Windows 质量门与自动更新闭环',
          desc: '真实跨版本升级、应用内自动更新闭环与独立 Windows 11 客户端验收，作为 Windows 后续质量门。',
        },
      ],
      note: '产品方向不代表承诺：不会通过不稳定的 DOM 注入或降低系统安全要求来提前上线功能。',
    },
    security: {
      eyebrow: 'Security & privacy',
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
        {
          icon: 'plugin',
          title: '可核验的插件来源',
          desc: '社区目录只提供发现能力，不代表官方认可；安装前核验目录与包的身份、依赖图、SHA-512 与官方 tarball，不降低安全要求。',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'FAQ',
      subtitle: '更多问题可以在 GitHub Issues 中找到答案。',
      items: [
        {
          question: '这是 DeepSeek 官方客户端吗？',
          answer:
            '不是。这是由社区独立开发的 macOS / Windows 桌面项目，与 DeepSeek 官方没有隶属或背书关系。',
        },
        {
          question: '支持哪些平台？',
          answer:
            'macOS 公开版面向 Apple Silicon（macOS 14 或更高），经 Developer ID 签名与 Apple 公证；Windows 11 x64 提供 Beta 产物。Intel Mac 与 Linux 暂不支持。',
        },
        {
          question: '为什么 Windows 版本会显示 SmartScreen 警告？',
          answer:
            'Windows 产物当前为未签名 Beta，首次运行可能显示 SmartScreen 提示。请只从 GitHub Releases 下载，并核对随附的 SHA256SUMS-Windows.txt。',
        },
        {
          question: '插件市场安全吗？',
          answer:
            '社区目录只提供发现能力，不表示官方认可或安全审核。安装前会核验目录来源、npm 精确身份、依赖图、SHA-512 与官方 tarball 等；插件安装后与 Harness 共享本机用户权限，请只安装你信任的代码。',
        },
        {
          question: '为什么安装包比较大？',
          answer:
            '为了做到离线可启动和版本可复现，应用内置了经过校验的 Node.js、pnpm 与 Harness 运行时，而不是依赖用户电脑上的全局环境。',
        },
        {
          question: '遇到启动问题怎么办？',
          answer:
            '先使用应用菜单导出诊断包，再到 GitHub Issues 描述系统版本、应用版本与复现步骤。提交前请确认附件中没有不希望公开的信息。',
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
        '下载应用，让 DeepSeek Harness 像原生桌面应用一样工作。如果这个项目对你有帮助，欢迎点一个 Star。',
      download: '下载应用',
      star: 'Star 支持',
      feedback: '反馈问题',
    },
    download: {
      app: '下载应用',
      mac: '下载 macOS',
      windows: '下载 Windows',
      menu: '其他下载',
      macDmg: 'macOS 安装版（DMG）',
      macZip: 'macOS ZIP',
      windowsSetup: 'Windows 安装版（Setup）',
      windowsPortable: 'Windows 便携版（ZIP）',
      github: 'GitHub Releases',
    },
    footer: {
      tagline: '面向 macOS 与 Windows 的 DeepSeek Harness 桌面工作台',
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
      title: 'DeepSeek YukiRyou — Make DeepSeek Harness Feel Like a Native Desktop App',
      description:
        'A standalone DeepSeek Harness desktop workbench for macOS and Windows: bundled runtime, account balance, workspace review, file preview, community plugin marketplace, and trusted updates. Open and run. macOS 14+ and Windows 11.',
      ogTitle: 'DeepSeek YukiRyou — DeepSeek Harness Desktop for macOS & Windows',
    },
    nav: {
      concept: 'Approach',
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
      badge: 'macOS & Windows Beta',
      kicker: 'DeepSeek Harness Desktop · a community project',
      title: 'Everything you need,',
      titleAccent: 'already installed.',
      subtitle:
        'DeepSeek YukiRyou packages DeepSeek Harness into an installable desktop app with a pinned runtime inside — double-click and start working.',
      subtitle2:
        'Account balance, workspace review, Git changes, file previews, a community plugin marketplace, and trusted updates, all in one native window.',
      ctaPrimary: 'Download App',
      ctaSecondary: 'View on GitHub',
      disclaimer: 'An open-source community project, not an official DeepSeek product',
      requirements: ['macOS 14+ (Apple Silicon)', 'Windows 11 x64 (Beta)', 'MIT License'],
      versionLabel: 'Latest release',
      shotAlt: 'Screenshot of DeepSeek YukiRyou: the Harness workbench in a native window',
      shotCaption: 'DeepSeek YukiRyou · Harness workbench in a native window',
      terminal: {
        tabs: ['Verify (macOS)', 'Verify (Windows)'],
        cmds: [
          'shasum -a 256 DeepSeek.YukiRyou-*-arm64.dmg',
          'Get-FileHash .\\DeepSeek.YukiRyou-*-Setup.exe -Algorithm SHA256',
        ],
        copy: 'Copy',
        copied: 'Copied',
      },
    },
    concept: {
      eyebrow: 'Harness = Runtime + Desktop',
      titleLead: 'A desktop shell ',
      titleRest: 'that keeps Harness running on your machine',
      lines: [
        'Harness is the body of an agent.',
        'The desktop shell fits that body into your operating system: runtime, processes, windows, and updates.',
      ],
      items: [
        {
          icon: 'rocket',
          title: 'Pinned runtime',
          mono: 'PINNED RUNTIME',
          desc: 'The app bundles verified Node.js, pnpm, and DeepSeek Harness. It ignores your global environment and never downloads dependencies on first run.',
        },
        {
          icon: 'mac',
          title: 'Native shell',
          mono: 'NATIVE SHELL',
          desc: 'The Electron main process owns the native window, traffic lights, tray, and updates. Single instance, hide on close, and it reclaims every process it started.',
        },
        {
          icon: 'shield',
          title: 'Loopback boundary',
          mono: 'LOOPBACK ONLY',
          desc: 'Harness listens only on a stable 127.0.0.1 loopback origin the app persists, never exposed to the LAN, and web content runs in a sandboxed view with Node integration off and context isolation on.',
        },
      ],
    },
    approach: {
      eyebrow: 'Design approach',
      title: 'Open and run. Every release verifiable.',
      items: [
        {
          title: 'Open and run',
          desc: 'No Node to prepare, no launch command to remember, no ports to juggle. The app ships a pinned runtime and Harness as one atomic release unit — double-click the icon and the workbench is there. Harness and the local UI recover independently, so one failure never takes down the window.',
          image: '/app-screenshot.png',
          imageAlt: 'DeepSeek YukiRyou main window: the Harness workbench in a native window',
        },
        {
          title: 'Every change reviewable',
          desc: 'File tree, Git changes vs HEAD, line stats, and read-only diff all live in the app: search, filter, ordered review, in-preview find, and drag files or lines straight into chat. Each turn\u2019s confirmed changes appear below the outputs row \u2014 one click opens the file for review.',
        },
        {
          title: 'A verifiable release chain',
          desc: 'Public macOS packages are Developer ID signed, Apple notarized, installed on clean machines, and stability-tested, with SHA-256 checksums attached. Before installing a plugin the app verifies catalog source, exact npm identity, dependency graph, SHA-512, and official tarballs \u2014 without lowering security requirements.',
        },
      ],
    },
    platforms: {
      eyebrow: 'Get started',
      title: 'Pick your platform',
      subtitle:
        'One Release ships both macOS and Windows artifacts \u2014 same commit, same pinned runtime.',
      tabs: [
        {
          id: 'mac',
          label: 'macOS',
          icon: 'apple',
          title: 'macOS 14+ (Apple Silicon)',
          desc: 'Public builds are Developer ID signed and Apple notarized. Download the DMG and drag it into Applications.',
          points: [
            'DMG installer, or a ZIP you can unzip and run',
            'Native traffic lights, draggable title bar, adaptive sidebar',
            'Light, dark, and system themes stay in sync',
            'In-app update checks; you confirm before restarting to install',
          ],
        },
        {
          id: 'win',
          label: 'Windows',
          icon: 'windows',
          title: 'Windows 11 x64 (Beta)',
          desc: 'An NSIS installer plus an install-free portable build. Builds are not Authenticode signed, so verify SHA-256 first.',
          points: [
            'Setup.exe installer, or a portable ZIP',
            'Platform runtime with ConPTY terminal support',
            'Same version and same commit as macOS',
            'SmartScreen may warn on first run',
          ],
        },
      ],
    },
    features: {
      eyebrow: 'Features',
      title: 'Put Harness into an installable desktop app',
      subtitle:
        'Not a rewrite of Harness, and it never changes how Agents work — it delivers Harness to your desktop stably, securely, and recoverably.',
      items: [
        {
          icon: 'rocket',
          title: 'Open and run',
          mono: 'OPEN AND RUN',
          desc: 'Ships with pinned Node.js, pnpm, and DeepSeek Harness. Ignores your global environment, and no first-run dependency downloads.',
        },
        {
          icon: 'mac',
          title: 'Native experience',
          mono: 'NATIVE EXPERIENCE',
          desc: 'Native traffic lights, a draggable title bar, and a sidebar that overlays in narrow windows and docks when wide. Light, dark, and system themes stay in sync.',
        },
        {
          icon: 'wallet',
          title: 'Account balance',
          mono: 'ACCOUNT BALANCE',
          desc: 'See the balance of the DeepSeek account behind your credentials, right above Settings.',
        },
        {
          icon: 'git',
          title: 'Workspace review',
          mono: 'WORKSPACE REVIEW',
          desc: 'File tree, Git changes vs HEAD, line stats, and read-only diff — with search, filtering, ordered review, in-preview find, and drag files or lines into chat.',
        },
        {
          icon: 'file',
          title: 'Readable previews',
          mono: 'READABLE PREVIEW',
          desc: 'Toggle Markdown between rendered and source views; preview plain text and common images right in the app.',
        },
        {
          icon: 'list',
          title: 'Per-turn changes',
          mono: 'PER-TURN CHANGES',
          desc: 'Confirmed changes for each turn appear below native Harness outputs — one click opens the file for review.',
        },
        {
          icon: 'heart',
          title: 'Quiet lifecycle',
          mono: 'QUIET LIFECYCLE',
          desc: 'Single instance; hide instead of quit. Harness and the local UI recover independently, so one failure never takes down the window.',
        },
        {
          icon: 'shield',
          title: 'Trusted updates',
          mono: 'TRUSTED UPDATES',
          desc: 'Developer ID signed, Apple notarized, SHA-256 verified, with in-app update checks. You confirm before restarting to install.',
        },
        {
          icon: 'plugin',
          title: 'Community plugin marketplace',
          mono: 'PLUGIN MARKETPLACE',
          desc: 'Full catalog indexing, search, categories, paging, and source management — with a security pre-check before install.',
        },
        {
          icon: 'check',
          title: 'Managed plugin lifecycle',
          mono: 'MANAGED LIFECYCLE',
          desc: 'Install, update, reinstall, enable, disable, rollback, and safe removal. Failures auto-restore the previous version and block known-bad builds.',
        },
        {
          icon: 'windows',
          title: 'Windows 11 support',
          mono: 'WINDOWS 11',
          desc: 'Platform runtime, ConPTY, and NSIS installer — the same release ships for both macOS and Windows.',
        },
        {
          icon: 'file',
          title: 'Windows portable build',
          mono: 'PORTABLE BUILD',
          desc: 'Unzip the portable ZIP and run directly — no install. Built from the same commit with the same pinned runtime.',
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
      subtitle:
        'Grab the installer for your platform from GitHub Releases: drag the DMG into Applications on macOS, or run the installer (or portable build) on Windows.',
      steps: [
        {
          title: 'Download the installer',
          desc: 'macOS: download the DMG. Windows: download Setup.exe or the portable ZIP — all from the same Release',
        },
        {
          title: 'Install',
          desc: 'macOS: drag DeepSeek YukiRyou into Applications. Windows: run the installer, or unzip the portable build and run directly',
        },
        {
          title: 'Launch and configure',
          desc: 'Launch from Launchpad or the Start menu, then configure services in the Harness UI',
        },
      ],
      requirementsTitle: 'System requirements',
      requirements: ['macOS 14+ (Apple Silicon)', 'Windows 11 x64 (Beta)'],
      fileNameTitle: 'Package naming',
      fileNameDesc:
        'Every Release ships macOS and Windows artifacts (DMG, Setup.exe, portable ZIP) with SHA-256 checksums. Only download from GitHub Releases.',
      shaNote:
        'The macOS app and update packages are Developer ID signed and Apple notarized; Windows is an unsigned Beta — verify SHA-256 before installing.',
      cta: 'Go to Releases',
    },
    roadmap: {
      eyebrow: 'Roadmap',
      title: 'What\u2019s next',
      subtitle:
        'The roadmap signals direction, not release dates; features stay unavailable until the security model or upstream interfaces are ready.',
      items: [
        {
          status: 'paused',
          statusLabel: 'Paused',
          title: 'DeepSeek Pet',
          desc: 'Character art, idle blinking, sleep/wake, and runtime-state animations reached a showcase-ready stage; currently paused as the roadmap direction is re-aligned.',
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
          title: 'Windows quality gates & auto-update loop',
          desc: 'Real cross-version upgrades, an in-app auto-update loop, and standalone Windows 11 client acceptance as the next Windows quality gates.',
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
        {
          icon: 'plugin',
          title: 'Verifiable plugin sources',
          desc: 'The community catalog is discovery only, not an endorsement; identity, dependency graph, SHA-512, and official tarballs are verified before install, without lowering security requirements.',
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
            'No. This is an independently developed open-source macOS/Windows project with no affiliation or endorsement from DeepSeek.',
        },
        {
          question: 'Which platforms are supported?',
          answer:
            'The macOS release targets Apple Silicon (macOS 14 or later) with Developer ID signing and Apple notarization; Windows 11 x64 ships Beta builds. Intel Macs and Linux are not supported yet.',
        },
        {
          question: 'Why does the Windows build show a SmartScreen warning?',
          answer:
            'Windows builds are unsigned Betas, so SmartScreen may warn on first run. Only download from GitHub Releases and verify against the included SHA256SUMS-Windows.txt.',
        },
        {
          question: 'Is the plugin marketplace safe?',
          answer:
            'The community catalog is discovery only — it is not an endorsement or a security review. Before install, the app verifies catalog source, npm identity, dependency graph, SHA-512, and official tarballs; plugins share your local user permissions with Harness, so only install code you trust.',
        },
        {
          question: 'Why is the installer so large?',
          answer:
            'For offline startup and reproducible versions, the app bundles verified Node.js, pnpm, and Harness runtimes instead of relying on your global environment.',
        },
        {
          question: 'What if the app fails to start?',
          answer:
            'Export a diagnostics package from the app menu, then open a GitHub Issue with your OS version, app version, and steps to reproduce. Review the attachment for anything you do not want public.',
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
        'Download the app and let DeepSeek Harness work like a native desktop app. If this project helps you, give it a star.',
      download: 'Download App',
      star: 'Star us',
      feedback: 'Report an issue',
    },
    download: {
      app: 'Download App',
      mac: 'Download macOS',
      windows: 'Download Windows',
      menu: 'Other downloads',
      macDmg: 'macOS installer (DMG)',
      macZip: 'macOS ZIP',
      windowsSetup: 'Windows installer (Setup)',
      windowsPortable: 'Windows portable (ZIP)',
      github: 'GitHub Releases',
    },
    footer: {
      tagline: 'A DeepSeek Harness desktop workbench for macOS and Windows',
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
