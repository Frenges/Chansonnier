import matter from "gray-matter";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

export async function loadAllMarkdown() {
  const files = await readdir(CONTENT_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const pages = [];

  for (const file of mdFiles) {
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = await readFile(fullPath, "utf8");
    const parsed = matter(raw);

    pages.push({
      id: parsed.data.id,
      title: parsed.data.title,
      sortKeys: parsed.data.sortKeys,
      themes: parsed.data.themes,
      body: parsed.content.trim()
    });
  }

  return pages;
}
