import type { PageLoad } from "./$types";
import { allSongs } from "$lib/data/allSongs";
import { error } from "@sveltejs/kit";

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  const id = params.id;
  const page = allSongs.find(p => p.id === id);
  if (!page) throw error(404, "Page introuvable");
  return { page };
};