// src/routes/index/thematique/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { pages } = await parent();
  // Exemple : renvoyer pages (tu peux grouper par thème ici)
  return { pages };
};
