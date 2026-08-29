# DeepSeek YukiRyou 官网

[DeepSeek YukiRyou](https://github.com/yoshino-xiao7/deepseek-harness-desktop-yukiryou)（DeepSeek Harness Desktop for macOS）的官方宣传站。

- 线上地址：<https://deepseek.yukiryou.icu>
- 技术栈：[Astro](https://astro.build)（静态站点）+ [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- 视觉：对齐 [DeepSeek Harness 官网](https://www.deepseek.com/harness/) 的设计令牌（深色 `#0a0a0a`、DS 间距/圆角标尺、白底 pill 主按钮、等宽 eyebrow 标签），并复刻其两项标志性视觉：首屏深蓝流体丝带 + 可交互点阵网格的 Canvas 氛围层（鼠标靠近时格点被推挤、变亮并回弹，物理参数与官方点阵层一致；触屏设备与 `prefers-reduced-motion` 下静帧呈现）、概念区品牌蓝像素字（自托管 Silkscreen，对应官网 "Edit Undo"），字体自托管（DM Sans / Montserrat / Fragment Mono / Silkscreen）
- 语言：简体中文（默认，挂 `/`）+ English（挂 `/en/`）
- 部署：腾讯 EdgeOne 静态托管，`dist/` 目录直接上传

## 本地开发

要求：Node.js 20+、pnpm 10。

> **macOS 注意**：若 `pnpm build` 报 `Cannot find native binding` / `different Team IDs`，说明当前 PATH 上的 `node` 是某个已签名 App 内置的运行时，它拒绝加载第三方原生模块（rolldown）。改用系统或 nvm 的 node 即可：
>
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"
> pnpm build
> ```

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动开发服务器（默认 http://localhost:4321）
pnpm build          # 构建到 dist/
pnpm preview        # 本地预览构建产物
pnpm check          # Astro 类型检查（astro check）
pnpm assets         # 重新生成图标与 OG 封面图（需要 sips 与 Pillow）
```

## 项目结构

```text
├── astro.config.mjs          # Astro 配置（site、i18n、sitemap）
├── edge-functions/           # EdgeOne Edge Functions（随部署发布）
│   └── api/downloads.js      # 下载清单同域代理：/api/downloads（实时取最新配置）
├── scripts/
│   ├── fetch-release.mjs     # 构建前从 GitHub Releases 获取版本号
│   ├── fetch-downloads.mjs   # 构建前获取下载清单，生成下载配置（内联 + 同域静态）
│   ├── copy-functions.mjs    # 构建后把 edge-functions/ 复制进 dist/
│   ├── prepare-assets.mjs    # 素材准备：图标缩放 + OG 图生成
│   └── og_cover.py           # OG 封面绘制（Pillow，1200x630）
├── public/                   # 静态资源（图标、OG 图、robots.txt、manifest、downloads.json）
│   └── fonts/                # 自托管字体：DM Sans / Montserrat / Fragment Mono（woff2）
└── src/
    ├── i18n/content.ts       # 全站中英双语内容字典（改文案主要改这里）
    ├── scripts/downloads.ts  # 下载中心客户端逻辑（实时代理 > 内联配置 > 同域静态）
    ├── layouts/Base.astro    # 基础布局：完整 SEO head（canonical/hreflang/OG/JSON-LD）
    ├── components/           # 页面区块组件
    │   ├── Hero.astro        # 首屏：两栏 + Canvas 流体/点阵背景 + 带 Tab 的终端卡（可复制命令）
    │   ├── Concept.astro     # 概念区：eyebrow + 像素字 HARNESS + 三张等宽标签卡
    │   ├── Approach.astro    # 设计理念：01 媒体行（左文右图）+ 其余条目双列卡
    │   ├── Platforms.astro   # （暂未挂载）平台切换 Tab，备用区块
    │   ├── HowItWorks.astro  # （暂未挂载）工作原理流程，备用区块
    │   ├── Roadmap.astro     # （暂未挂载）路线图，备用区块
    │   └── ...               # Features / Why / Install / Security / Faq / Cta / Header / Footer / Download / Icon
    ├── pages/index.astro     # 简体中文首页（/）
    ├── pages/en/index.astro  # English 首页（/en/）
    ├── pages/404.astro       # 404 页（按浏览器语言切换文案）
    └── styles/global.css     # 设计系统（DS 设计令牌 + @font-face + 文字/按钮/卡片标尺）
```

## SEO 已内置

- 每个页面独立的 `title` / `description` / canonical / Open Graph / Twitter Card
- 双语 `hreflang`（`zh-CN` / `en` / `x-default`）
- 结构化数据：`WebSite` + `SoftwareApplication` + `FAQPage`（JSON-LD）
- 自动生成 `sitemap-index.xml` 与 `robots.txt`
- 语义化 HTML（`header` / `main` / `section` / `nav` / `details`），零框架 JS 依赖

## 部署到腾讯 EdgeOne

构建产物为纯静态文件，`dist/` 就是完整站点。三种方式任选：

### 方式一：控制台手动上传（最简单）

1. 本地执行 `pnpm build` 生成 `dist/`
2. 在[腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)创建**静态网站**（静态站点托管）项目，绑定域名 `deepseek.yukiryou.icu`，开启 HTTPS
3. 将 `dist/` 内所有文件上传到站点根目录
4. 建议把 404 页面指向 `404.html`，并开启 gzip/Brotli 与浏览器缓存

### 方式二：EdgeOne CLI

```bash
npm install -g edgeone
edgeone login                                  # 浏览器登录腾讯云
edgeone makers deploy ./dist -n <项目名>        # 直接上传 dist/
```

CLI 详情见 [EdgeOne CLI 文档](https://cdn.jsdelivr.net/npm/edgeone@latest/README.md)。

### 方式三：GitHub Actions 自动部署

仓库已附带 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)：

1. 在 EdgeOne 控制台创建 Pages/Makers 项目，生成 API Token
2. 在 GitHub 仓库 Settings → Secrets and variables 中配置：
   - `EO_API_TOKEN`：API Token（Secret）
   - `EO_PROJECT_NAME`：EdgeOne 项目名（Variable）
3. 推送 `main` 分支即自动构建并部署；也可在 Actions 页面手动触发

### 方式四：EdgeOne Pages 自带流水线（推荐，本仓库当前使用）

在 EdgeOne Makers 控制台创建 Pages 项目并关联本 GitHub 仓库（默认 `main` 分支）：

- 每次推送自动构建部署；`edge-functions/` 目录随构建产物自动发布为 Edge Functions
- 构建命令即 `pnpm build`（`edgeone.json` 中 `outputDirectory: ./dist`，Node 22）
- 发版后如需立即更新官网：控制台点「重新部署」，或配置[部署钩子](https://edgeone.ai/zh/document/160427672908292096)（POST 触发）

## 版本与下载的实时同步机制

- **首屏（SSR）**：构建时由 `fetch-downloads.mjs` 获取最新清单，四个下载链接与版本号直接渲染进 HTML（国内构建为 OSS 直链；海外构建自动回退 GitHub 资产）
- **实时（运行时）**：页面每次加载请求同域 Edge Function `/api/downloads`（`edge-functions/api/downloads.js`），实时返回最新下载配置——国内边缘节点返回 OSS 直链，海外节点自动回退 GitHub；发布新版本后刷新页面即同步，与构建流水线解耦
- **兜底**：代理不可用时回退页面内联配置 → 同域 `/downloads.json`；任何失败均在浏览器控制台记录具体原因

## 上线前需要替换的内容

| 位置 | 说明 |
| --- | --- |
| 版本号 | 无需手动维护：构建时自动获取；运行时由 `/api/downloads` 实时覆盖 |
| `astro.config.mjs` 中 `site` | 若域名变更，同步修改 canonical/sitemap |
| `scripts/prepare-assets.mjs` 中 `ICON_URL` | 图标源地址 |
| `public/og-cover.png` | 品牌视觉更新时重新生成（`pnpm assets`） |
| `public/fonts/*.woff2` | 自托管字体，仅在更换字体族时替换；`global.css` 中同步 `@font-face` 与 `Base.astro` 的 preload |
| 下载链接 | 由 `Download.astro` + `downloads.ts` + Edge Function `/api/downloads` 统一管理：实时读取清单直链（DMG / macOS ZIP / Windows Setup / 便携版），不可用时回退 GitHub Releases |

## 免责声明

本项目为 DeepSeek YukiRyou（社区开源项目）的官网，与 DeepSeek 官方无隶属或背书关系；DeepSeek 与 DeepSeek Harness 名称归其各自权利人所有。
