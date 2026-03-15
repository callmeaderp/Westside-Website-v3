// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://callmeaderp.github.io',
  base: '/Westside-Website-v3',

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/api/'),
    }),
    mdx(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    assets: 'assets',
  },

  image: {
    domains: [],
  },

  trailingSlash: 'always',
});
