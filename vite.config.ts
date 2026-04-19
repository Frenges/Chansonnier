import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { exec } from "node:child_process";

export default defineConfig({
  plugins: [
    sveltekit(),

    {
      name: "generate-pages-json",
      buildStart() {
        exec("node ./scripts/generate-pages-json.js");
      },
      handleHotUpdate({ file }) {
        if (file.endsWith(".md")) {
          exec("node ./scripts/generate-pages-json.js");
        }
      }
    }
  ]
});
