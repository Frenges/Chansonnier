<script lang="ts">
  import { base } from "$app/paths";

  // Récupération des données du load()
  let { data } = $props();
  const { pages } = data;

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/^(le|la|les|l'|the)\s+/i, "");
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

{#each Object.entries(themes) as [theme, entries]}
  <section class="theme">
    <h2>{theme}</h2>
    <ul>
      {#each entries as e}
        <li>
          <a href={`${base}/page/${e.page.id}`}>{e.key}</a>
        </li>
      {/each}
    </ul>
  </section>
{/each}
