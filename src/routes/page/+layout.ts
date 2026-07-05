/**
 * Layout for the `/page` route group.
 *
 * This file reuses the root layout data and keeps the `page` route group
 * in sync with the shared pages list from `src/routes/+layout.ts`.
 * It also marks this group as client-side only.
 */
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ parent }) => {
  return await parent();
};
