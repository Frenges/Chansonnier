/**
 * Load the shared pages list from the parent layout.
 *
 * The alphabetical index page does not fetch its own source data. It relies on
 * the root layout's JSON payload and only prepares the subset needed for
 * rendering the index.
 */
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { pages } = await parent();
  return { pages };
};
