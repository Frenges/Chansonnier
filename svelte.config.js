import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      fallback: 'index.html'   // 👈 indispensable pour GitHub Pages
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/songbook-kit' : ''
    },
    prerender: {
      entries: []              // 👈 désactive le prerender strict
    }
  }
};

export default config;
