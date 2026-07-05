/**
 * Root layout load.
 *
 * This fetches the pre-generated pages JSON file once at the root layout.
 * The data is then available to all nested routes and to the search UI.
 * Using `fetch` here works both during SSR and in the browser.
 */
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
  // Use fetch so this code works both during SSR and in the browser
  const res = await fetch('/data/pages.json');
  if (!res.ok) {
    console.warn('[server] +layout.load: failed to fetch pages.json', res.status);
    return { pages: [] };
  }
  const json = await res.json();
  const pages = json.pages ?? [];

  console.log('[server] +layout.load: pages.json loaded, pages=', Array.isArray(pages) ? pages.length : typeof pages);

  return {
    pages,
    _debug_server_loaded: true
  };
};
