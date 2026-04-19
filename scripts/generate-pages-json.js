import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const OUTPUT_DIR = path.join(process.cwd(), "static", "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "pages.json");

async function generate() {
  console.log("⏳ Génération de pages.json…");

  // 1) S'assurer que static/data existe
  await mkdir(OUTPUT_DIR, { recursive: true });

  // 2) Lire les fichiers Markdown
  const files = await readdir(CONTENT_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const pages = [];

  for (const file of mdFiles) {
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = await readFile(fullPath, "utf8");

    const parsed = matter(raw);

    const id = parsed.data.id ?? file.replace(".md", "");
    const title = parsed.data.title ?? id;
    const sortKeys = parsed.data.sortKeys ?? [title];
    const themes = parsed.data.themes ?? [];

    pages.push({
      id,
      title,
      sortKeys,
      themes,
      body: parsed.content.trim()
    });
  }

  // 3) Version unique à chaque génération
  const VERSION = Date.now();

  // 4) Écrire le JSON final
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
