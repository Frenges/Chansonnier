type SearchableSong = {
  id: string;
  title: string;
  sortKeys?: string[];
  displayTitle?: string;
};

function normalizeSearchText(value: string): string {
  // Normalize text for search by removing accents, lowercasing, and
  // collapsing non-alphanumeric characters into spaces.
  // This ensures queries like "set" still match "Sétévia" and "GAU" still
  // match "Gaudeamus".
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
    .map((song) => {
      const haystacks = [song.title, ...(song.sortKeys ?? [])];

      // Non-dev explanation:
      // We search both the main title and any alias/sort keys defined on the song.
      // This allows a user to type a name like "missa solemnis" and still see the
      // song even if the canonical title is something else.
      const matchingHaystacks = haystacks.filter((value) => normalizeSearchText(value).includes(normalizedQuery));

      // `displayTitle` is chosen from the last matching haystack so that if an
      // alias matches the query, it is shown in the results instead of the main title.
      // This is the UX requirement: display the alias while still navigating to
      // the canonical page.
      const displayTitle = matchingHaystacks.length > 0 ? matchingHaystacks[matchingHaystacks.length - 1] : song.title;

      return {
        ...song,
        displayTitle,
      };
    })
    .filter((song) => normalizeSearchText(song.displayTitle ?? song.title).includes(normalizedQuery))
    .sort((left, right) => left.title.localeCompare(right.title, 'fr', { sensitivity: 'base' }))
    .slice(0, limit);
}
