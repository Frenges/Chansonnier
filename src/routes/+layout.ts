// src/routes/+layout.ts
import type { LayoutLoad } from "./$types";
import { allSongs } from "$lib/data/allSongs";

export const load: LayoutLoad = async () => {
  // Les chansons sont embarquées dans le bundle → aucune dépendance réseau
  return {
    pages: allSongs
  };
};
