<script lang="ts">
  import { base } from "$app/paths";

  // Récupération des données du load()
  let { data } = $props();
  const d = data;
  const { id, pages } = d;

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
