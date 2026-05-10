// src/lib/db.ts
// API serveur légère : lit la source canonique (allSongs) pour les load() serveur.
import type { Song } from '$lib/data/allSongs';

async function loadAllSongsModule() {
  try {
    const mod = await import('$lib/data/allSongs');
    // tolérance aux différents noms d'export possibles
    const ALL_SONGS: Song[] = mod.ALL_SONGS ?? mod.allSongs ?? mod.default ?? [];
    return ALL_SONGS;
  } catch (e) {
    console.error('db.ts: impossible d\'importer $lib/data/allSongs', e);
    return [];
  }
}

export async function loadPages(): Promise<Song[]> {
  const ALL_SONGS = await loadAllSongsModule();
  if (!ALL_SONGS || ALL_SONGS.length === 0) {
    console.warn('loadPages: ALL_SONGS introuvable ou vide, renvoi tableau vide');
    return [];
  }
  return ALL_SONGS;
}

export async function findPageById(id: string): Promise<Song | undefined> {
  const ALL_SONGS = await loadAllSongsModule();
  if (!ALL_SONGS || ALL_SONGS.length === 0) {
    console.warn('findPageById: ALL_SONGS introuvable pour id=', id);
    return undefined;
  }
  return ALL_SONGS.find((p) => (p as any).slug === id || (p as any).id === id);
}
