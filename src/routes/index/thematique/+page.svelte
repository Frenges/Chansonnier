<script lang="ts">
  export let data: { pages?: any[] };

  import { base } from '$app/paths';
  let pages = data?.pages ?? [];
  $: pages = data?.pages ?? [];

  function normalize(str: string) {
    return str.toLowerCase();
  }

  const grouped = {};

  for (const page of pages) {
    if (!page.themes?.length) continue;

    const keys = page.sortKeys?.length ? page.sortKeys : [page.title];

    for (const theme of page.themes) {
      if (!grouped[theme]) grouped[theme] = [];

      for (const key of keys) {
        grouped[theme].push({
          key,
          normalized: normalize(key),
          page
        });
      }
    }
  }

  const themes = Object.fromEntries(
    Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
  );

  for (const theme of Object.keys(themes)) {
    themes[theme].sort((a, b) => a.normalized.localeCompare(b.normalized));
  }
</script>

<h1>Index thématique</h1>

{#each groupKeys as theme}
  <section class="theme">
    <h2>{theme}</h2>
    <ul>
      {#each groups[theme] as p}
        <li>
          <a href={base + '/page/' + (p.slug ?? p.id)}>{p.title}</a>
        </li>
      {/each}
    </ul>
  </section>
{/each}
