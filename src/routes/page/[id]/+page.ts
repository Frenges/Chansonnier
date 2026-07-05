/**
 * Load the details for a single content page.
 *
 * This is the main dynamic content route. It receives the current route
 * `params.id` and resolves the canonical page from the shared `pages`
 * payload loaded by the root layout.
 *
 * We keep the page separate from `+page.svelte` because the loader is
 * responsible for fetching and shaping the data, while the Svelte page
 * component is responsible for rendering it.
 */
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
  console.log('[server] +page.load params.id=', params.id);
  const { pages } = await parent();
  const page = (pages ?? []).find((p: { id: string }) => p.id === params.id) ?? null;
  return {
    page
  };
};
