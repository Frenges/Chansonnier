<script lang="ts">
  import { db } from "$lib/db";
  import { onMount } from "svelte";

  let entries = $state<any[]>([]);

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/^(le|la|les|l'|the)\s+/i, "");
  }

  onMount(async () => {
    const all = await db.pages.toArray();

    // Étape 1 : déplier les sortKeys
    const expanded: any[] = [];

    for (const page of all) {
      const keys = page.sortKeys?.length ? page.sortKeys : [page.title];

      for (const key of keys) {
        expanded.push({
          key,
          normalized: normalize(key),
          page
        });
      }
    }

    // Étape 2 : trier toutes les entrées
    entries = expanded.sort((a, b) =>
      a.normalized.localeCompare(b.normalized)
    );
  });
</script>

<h1>Index alphabétique</h1>

<ul>
  {#each entries as e}
    <li>
      <a href={"/page/" + e.page.id}>{e.key}</a>
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 0.3rem 0;
  }
</style>
