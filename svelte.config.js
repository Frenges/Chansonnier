import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === "development";

export default {
  kit: {
    adapter: adapter({
      fallback: '404.html'
    }),

    paths: {
      base: dev ? "" : "/Chansonnier"
    },

    serviceWorker: {
      register: true
    }
  },

  preprocess: [vitePreprocess()]
};
