// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * 官网地址：https://deepseek.yukiryou.icu
 * 默认语言为简体中文（挂在 / 下），英文挂在 /en/ 下。
 */
export default defineConfig({
  site: 'https://deepseek.yukiryou.icu',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
