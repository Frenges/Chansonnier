import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const OUTPUT_DIR = path.join(process.cwd(), "static", "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "pages.json");

async function generate() {
  console.log("⏳ Génération de pages.json…");

  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(CONTENT_DIR);
  const svelteFiles = files.filter((f) => f.endsWith(".svelte"));

  const pages = [];

  for (const file of svelteFiles) {
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = await readFile(fullPath, "utf8");

    //
    // --- Extraction du <script> metadata ---
    //
    const scriptMatch = raw.match(/<script>([\s\S]*?)<\/script>/);
    if (!scriptMatch) continue;

    const scriptContent = scriptMatch[1];

    // On récupère metadata = { ... }
    const metadataMatch = scriptContent.match(/metadata\s*=\s*({[\s\S]*?})/);
    if (!metadataMatch) continue;

    // On évalue l'objet metadata en JS
    const metadata = eval("(" + metadataMatch[1] + ")");

    const { id, title, theme, sortKeys } = metadata;

    //
    // --- Extraction du contenu HTML complet ---
    //
    // ⚠️ Nouvelle regex : capture TOUT jusqu'au dernier </div>
    //
    const bodyMatch = raw.match(/<div class="song">([\s\S]*)<\/div>\s*$/);
    const body = bodyMatch ? bodyMatch[1].trim() : "";

    pages.push({
      id,
      title,
      sortKeys,
      themes: [theme],
      body,
      html: `<div class="song">${body}</div>`
    });
  }

  const VERSION = Date.now();

  await writeFile(
    OUTPUT_FILE,
    JSON.stringify({ version: VERSION, pages }, null, 2),
    "utf8"
  );

  console.log(`✔ pages.json mis à jour (${pages.length} chansons)`);
}

generate().catch((err) => {
  console.error("❌ Erreur lors de la génération de pages.json :", err);
});
