type SearchableSong = {
  id: string;
  title: string;
  sortKeys?: string[];
};

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function searchSongs(songs: SearchableSong[], query: string, limit = 10) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  return songs
    .filter((song) => {
      const haystacks = [song.title, ...(song.sortKeys ?? [])];
      return haystacks.some((value) => normalizeSearchText(value).includes(normalizedQuery));
    })
    .sort((left, right) => left.title.localeCompare(right.title, 'fr', { sensitivity: 'base' }))
    .slice(0, limit);
}
