/**
 * Layout for the `/index` route group.
 *
 * This route group shares the root data payload and keeps the index pages
 * client-side rendered in the same app shell.
 */
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ parent }) => {
  return await parent();
};
