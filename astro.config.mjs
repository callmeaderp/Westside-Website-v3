// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://westsideprolandscape.com',

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/api/') && !page.includes('/field/'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    assets: 'assets',
  },

  // Preserve Astro 6 whitespace semantics; Astro 7's JSX mode can join adjacent inline text.
  compressHTML: true,

  image: {
    domains: [],
  },

  trailingSlash: 'always',
});
