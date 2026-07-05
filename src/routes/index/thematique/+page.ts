/**
 * Load the shared pages list from the parent layout.
 *
 * The thematic index page uses the same root payload as the alphabetical
 * index and formats it by theme. This is a view-only transformation layer.
 */
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { pages } = await parent();
  return { pages };
};
