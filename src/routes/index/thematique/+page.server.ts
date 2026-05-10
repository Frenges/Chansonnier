// src/routes/index/thematique/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { pages } = await parent();
  // tu peux grouper par thème ici si tu veux côté serveur
  return { pages };
};
