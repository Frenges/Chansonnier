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
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.svelte')) {
          exec('node ./scripts/generate-pages-json.js', (err, stdout, stderr) => {
            if (err) {
              console.error('generate-pages-json failed', err, stderr);
            } else {
              console.log('generate-pages-json rebuilt pages.json');
            }
            try {
              // trigger full reload so the new pages.json is picked up
              server.ws.send({ type: 'full-reload' });
            } catch (e) {
              console.warn('failed to trigger full-reload', e);
            }
          });
        }
      }
    }
  ]
});
