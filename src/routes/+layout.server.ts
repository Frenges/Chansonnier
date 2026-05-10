// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { loadPages } from '$lib/db';

export const load: LayoutServerLoad = async () => {
  const pages = await loadPages();
  return { pages };
};
