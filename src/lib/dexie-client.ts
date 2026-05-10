// src/lib/dexie-client.ts
// Dexie uniquement côté client : population depuis cache/service-worker ou fetch réseau.
// Importer ce fichier uniquement dans des composants client (onMount).
import Dexie from 'dexie';

export type PageRecord = {
  slug: string;
  title: string;
  html?: string;
  body?: string;
  [k: string]: any;
};

export const db = new Dexie('songbook');
db.version(1).stores({
  pages: 'slug,title'
});

export async function ensureDexieIsPopulated(): Promise<void> {
  const count = await db.pages.count();
  if (count > 0) return;

  // Essayer de lire depuis le cache (service worker)
  try {
    const cached = await caches.match('/data/pages.json');
    if (cached) {
      const json = await cached.json();
      if (Array.isArray(json.pages)) {
        await db.pages.bulkPut(json.pages);
        return;
      }
    }
  } catch (e) {
    // ignore
  }

  // Fallback réseau
  const res = await fetch('/data/pages.json');
  if (!res.ok) throw new Error('Impossible de charger pages.json');
  const json = await res.json();
  if (Array.isArray(json.pages)) {
    await db.pages.bulkPut(json.pages);
  }
}

export async function searchPages(query: string, limit = 50): Promise<PageRecord[]> {
  if (!query) {
    return db.pages.toArray();
  }
  const q = query.toLowerCase();
  // Simple search : titre contient q
  return db.pages
    .filter((p: PageRecord) => (p.title || '').toLowerCase().includes(q))
    .limit(limit)
    .toArray();
}
