import { loadPages } from "$lib/db";

export const ssr = false;

export async function load() {
  const pages = await loadPages();
  console.log("PAGES CHARGÉES DANS +layout.ts :", pages);
  return { pages };
}

