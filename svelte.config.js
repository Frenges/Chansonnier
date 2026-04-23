import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === "development";

export default {
  kit: {
    adapter: adapter({
      fallback: '404.html'
    }),
    paths: {
      base: process.env.NODE_ENV === "production" ? "/Chansonnier" : ""
    },
    serviceWorker: {
      register: true
    }
  }
};
