<script lang="ts">
  import { base } from "$app/paths";
  import { allSongs } from "$lib/data/allSongs";

  let query = "";
  let results = [];

  function normalize(s: string) { return s ? s.toLowerCase() : ""; }

  $: if (query && query.trim().length > 0) {
    const q = normalize(query);
    results = allSongs.filter(p => {
      const keys = p.sortKeys?.length ? p.sortKeys : [p.title];
      return keys.some(k => normalize(k).includes(q));
    }).slice(0, 50);
  } else results = [];
</script>

<style>
  .search { margin:0.6rem 0; }
  .search input { width:100%; padding:0.5rem; border-radius:6px; border:1px solid #ccc; box-sizing:border-box; }
  .search-results { margin-top:0.4rem; max-height:40vh; overflow:auto; }
  .search-results a { display:block; padding:0.4rem 0.2rem; text-decoration:none; color:inherit; border-bottom:1px solid #eee; }
  .search-results a:hover { background:#f5f5f5; }
  .dark .search-results a:hover { background:#2a2a2a; }
  .sr-only { position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden; }
</style>

<div class="search" role="search" aria-label="Recherche de chansons">
  <label for="site-search" class="sr-only">Rechercher</label>
  <input id="site-search" type="search" bind:value={query} placeholder="Rechercher un titre, un mot..." aria-label="Rechercher" />
  {#if results.length}
    <div class="search-results" role="list">
      {#each results as r}
        <a href={`${base}/page/${r.id}`}>{r.title}</a>
      {/each}
    </div>
  {/if}
</div>
