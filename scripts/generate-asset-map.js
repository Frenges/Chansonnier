import fs from "fs";
import path from "path";
import url from "url";

// chemins
const root = process.cwd();
const manifestClientPath = path.join(root, ".svelte-kit/output/client/.vite/manifest.json");
const manifestServerPath = path.join(root, ".svelte-kit/output/server/manifest-full.js");
const pagesJsonPath = path.join(root, "static/data/pages.json");
const outputFile = path.join(root, "build/asset-map.json");

// vérifications
if (!fs.existsSync(manifestClientPath)) {
  console.error("❌ manifest.json introuvable :", manifestClientPath);
  process.exit(1);
}
if (!fs.existsSync(manifestServerPath)) {
  console.error("❌ manifest-full.js introuvable :", manifestServerPath);
  process.exit(1);
}
if (!fs.existsSync(pagesJsonPath)) {
  console.error("❌ pages.json introuvable :", pagesJsonPath);
  process.exit(1);
}

// charge manifest client
const manifestClient = JSON.parse(fs.readFileSync(manifestClientPath, "utf8"));

// charge manifest server (module ESM)
const manifestServerModule = await import(url.pathToFileURL(manifestServerPath));
const manifestServer = manifestServerModule.manifest;

// charge pages
const pages = JSON.parse(fs.readFileSync(pagesJsonPath, "utf8")).pages;

// trouve la route dynamique /page/[id]
const routePage = manifestServer._.routes.find(r => r.id === "/page/[id]");
if (!routePage) {
  console.error("❌ Route /page/[id] introuvable dans manifest-full.js");
  process.exit(1);
}

// le node leaf pour /page/[id]
const leafNodeIndex = routePage.page.leaf; // normalement 7

// fonction pour collecter les assets d’un node
function collectAssetsForNode(nodeIndex) {
  const key = `.svelte-kit/generated/client-optimized/nodes/${nodeIndex}.js`;
  const entry = manifestClient[key];
  if (!entry) return [];

  const assets = new Set();

  function walk(itemKey) {
    const item = manifestClient[itemKey];
    if (!item) return;

    if (item.file) assets.add("/" + item.file);
    if (item.css) item.css.forEach(css => assets.add("/" + css));
    if (item.imports) item.imports.forEach(walk);
  }

  walk(key);
  return [...assets];
}

// génère la MAP
const map = {};

for (const page of pages) {
  const route = `/page/${page.id}`;
  const assets = collectAssetsForNode(leafNodeIndex);
  map[route] = assets;
}

fs.writeFileSync(outputFile, JSON.stringify(map, null, 2));
console.log("✔ asset-map.json généré !");
