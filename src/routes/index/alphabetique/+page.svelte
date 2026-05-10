<script lang="ts">
 export let data: { pages?: any[] };

  import { base } from '$app/paths';
  let pages = data?.pages ?? [];
  $: pages = data?.pages ?? [];

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
  {#each sorted as e}
    <li>
      <a href={base + '/page/' + (e.page?.id ?? e.id)}>{e.key ?? e.title}</a>
    </li>
  {/each}
</ul>
