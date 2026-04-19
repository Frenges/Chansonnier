import { db } from "$lib/db";

export async function importPages(fetchFn: typeof fetch, base: string) {
  const count = await db.pages.count();

  if (count === 0) {
    const res = await fetchFn(`${base}/data/pages.json`);
    const pages = await res.json();

    await db.pages.bulkAdd(pages);
    console.log("Pages importées :", pages.length);
  }
}
