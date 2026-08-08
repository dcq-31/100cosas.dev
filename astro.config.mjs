// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { codeLangBadge } from './src/utils/code-lang-badge.mjs';
import { seoRedirects } from './src/data/seo-redirects.mjs';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://100cosas.dev',
  trailingSlash: 'always',
  prefetch: false,
  vite: {
    plugins: [tailwindcss()],
  },

  // 301s for legacy locale prefixes, broken hreflang URLs, and renamed tips.
  redirects: {
    ...seoRedirects,
  },

  integrations: [
    mdx(),

    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US',
        },
      },
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => {
        const pathname = new URL(page).pathname;

        // Non-indexable or utility routes
        if (pathname.includes('/404')) return false;
        if (pathname === '/infografias' || pathname === '/infografias/') return false;
        if (pathname.endsWith('search-index.json')) return false;
        if (pathname.endsWith('.json') || pathname.endsWith('.xml')) return false;

        // Legacy locale-prefixed Spanish routes (should only exist as redirects)
        if (pathname === '/es' || pathname === '/es/' || pathname.startsWith('/es/')) {
          return false;
        }

        // Legacy English paths
        if (pathname.startsWith('/en/consejo/')) return false;
        if (
          pathname === '/en/sobre-el-proyecto' ||
          pathname === '/en/sobre-el-proyecto/'
        ) {
          return false;
        }

        return true;
      },
    }),
  ],

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'tokyo-night',
      },
      defaultColor: false,
      transformers: [codeLangBadge()],
    },
  },

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  adapter: cloudflare(),
});
