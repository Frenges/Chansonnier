// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  // Propagation des données du layout (pages)
  return await parent();
};
