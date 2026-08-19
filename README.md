# DeepSeek YukiRyou 官网

[DeepSeek YukiRyou](https://github.com/yoshino-xiao7/deepseek-harness-desktop-yukiryou)（DeepSeek Harness Desktop for macOS）的官方宣传站。

- 线上地址：<https://deepseek.yukiryou.icu>
- 技术栈：[Astro](https://astro.build)（静态站点）+ [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- 语言：简体中文（默认，挂 `/`）+ English（挂 `/en/`）
- 部署：腾讯 EdgeOne 静态托管，`dist/` 目录直接上传

## 本地开发

要求：Node.js 20+、pnpm 10。

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
├── scripts/
│   ├── prepare-assets.mjs    # 素材准备：图标缩放 + OG 图生成
│   └── og_cover.py           # OG 封面绘制（Pillow，1200x630）
├── public/                   # 静态资源（图标、OG 图、robots.txt、manifest）
└── src/
    ├── i18n/content.ts       # 全站中英双语内容字典（改文案主要改这里）
    ├── layouts/Base.astro    # 基础布局：完整 SEO head（canonical/hreflang/OG/JSON-LD）
    ├── components/           # 页面区块组件
    ├── pages/index.astro     # 简体中文首页（/）
    ├── pages/en/index.astro  # English 首页（/en/）
    ├── pages/404.astro       # 404 页（按浏览器语言切换文案）
    └── styles/global.css     # 设计系统（设计变量 + 基础样式）
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

## 上线前需要替换的内容

| 位置 | 说明 |
| --- | --- |
| 版本号 | 无需手动维护：`pnpm build` 前由 `scripts/fetch-release.mjs` 自动从 GitHub Releases 获取，失败时回退到 `src/generated/release.json` 中已有值 |
| `astro.config.mjs` 中 `site` | 若域名变更，同步修改 canonical/sitemap |
| `scripts/prepare-assets.mjs` 中 `ICON_URL` | 图标源地址 |
| `public/og-cover.png` | 品牌视觉更新时重新生成（`pnpm assets`） |
| 下载链接 | 组件内均引用 `PROJECT.latest`，指向 GitHub Releases |

## 免责声明

本项目为 DeepSeek YukiRyou（社区开源项目）的官网，与 DeepSeek 官方无隶属或背书关系；DeepSeek 与 DeepSeek Harness 名称归其各自权利人所有。
