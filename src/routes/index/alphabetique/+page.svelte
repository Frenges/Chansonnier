<script lang="ts">
  import { base } from "$app/paths";

  /**
   * The alphabetical index page is a view layer on top of the shared pages
   * payload. It does not fetch or generate page content itself.
   *
   * This keeps the page list centralized in `src/routes/+layout.ts` while
   * allowing this route to render a sorted, searchable table of links.
   */
  export let data;
  const { pages } = data;

  function normalize(str: string) {
    return str.toLowerCase();
  }

  const expanded = [];

  for (const page of pages) {
    const keys = page.sortKeys?.length ? page.sortKeys : [page.title];

    for (const key of keys) {
      expanded.push({
        key,
        normalized: normalize(key),
        page
      });
    }
  }

  const entries = expanded.sort((a, b) =>
    a.normalized.localeCompare(b.normalized)
  );
</script>

<h1>Index alphabétique</h1>

<ul>
  {#each entries as e}
    <li>
      <a href={`${base}/page/${e.page.id}`}>{e.key}</a>
    </li>
  {/each}
</ul>
