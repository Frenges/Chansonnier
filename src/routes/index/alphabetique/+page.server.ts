// src/routes/index/alphabetique/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { pages } = await parent();
  // tu peux trier ou transformer ici si besoin
  return { pages };
};
