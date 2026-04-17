import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      fallback: '404.html'   // ← OBLIGATOIRE pour GitHub Pages
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/Chansonnier' : ''
    },
    prerender: {
      entries: []            // ← OK pour SPA
    }
  }
};

export default config;
