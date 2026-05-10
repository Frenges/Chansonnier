// src/routes/index/alphabetique/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { pages } = await parent();
  // Ici tu peux trier alphabétiquement côté serveur si besoin
  const sorted = [...(pages ?? [])].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  return { pages: sorted };
};
