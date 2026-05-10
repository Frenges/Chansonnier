import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import process from 'node:process';
import { execSync } from 'node:child_process';

const dev = process.env.NODE_ENV === 'development';

// 1) Allow explicit override via env var (highest priority)
const envBase = process.env.BASE_PATH;
if (envBase) {
  console.log('[svelte.config] BASE_PATH from env:', envBase);
}

// 2) Auto-detect GitHub Pages project site named "Chansonnier"
//    - If running in GitHub Actions, GITHUB_REPOSITORY is available
//    - Otherwise try to read local git remote origin URL (best-effort)
let autoBase = '';
try {
  if (!envBase) {
    const ghRepo = process.env.GITHUB_REPOSITORY;
    if (ghRepo && ghRepo.toLowerCase().includes('chansonnier')) {
      autoBase = '/Chansonnier';
    } else {
      // best-effort local git remote check (silently ignore errors)
      const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
      if (remoteUrl && /[:\/]frenges\/Chansonnier(\.git)?$/i.test(remoteUrl)) {
        autoBase = '/Chansonnier';
      }
    }
  }
} catch (e) {
  // ignore; autoBase stays ''
}

// 3) Final base selection: explicit env var > auto-detect > dev default ""
const basePath = envBase ?? (dev ? '' : autoBase ?? '');

console.log('[svelte.config] final basePath =', JSON.stringify(basePath));

export default {
  kit: {
    adapter: adapter({
      fallback: '404.html'
    }),

    paths: {
      base: basePath
    },

    serviceWorker: {
      register: true
    }
  },

  preprocess: [vitePreprocess()]
};
