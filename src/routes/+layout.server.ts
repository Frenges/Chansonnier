import { loadAllMarkdown } from "$lib/importer.server";

export async function load() {
  const pages = await loadAllMarkdown();
  return { pages };
}
