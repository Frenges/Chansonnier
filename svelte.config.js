import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === "development";

export default {
  preprocess: preprocess(),
  kit: {
    adapter: adapter({
      fallback: '404.html'
    }),

    paths: {
      base: dev ? "" : "/Chansonnier",
      assets: dev ? "" : "/Chansonnier"
    },
    trailingSlash: 'always'

    serviceWorker: {
      register: true
    }
  },

};
