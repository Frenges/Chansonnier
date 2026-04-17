<script lang="ts">
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import { db } from "$lib/db";

  let themes = $state({});

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/^(le|la|les|l'|the)\s+/i, "");
  }

  onMount(async () => {
    const pages = await db.pages.toArray();

    // Regroupement par thème, avec expansion des sortKeys
    const grouped: Record<string, any[]> = {};

    for (const page of pages) {
      if (!page.themes || page.themes.length === 0) continue;

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

    // Tri des thèmes
    const sortedThemes = Object.fromEntries(
      Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
    );

    // Tri interne des entrées dans chaque thème
    for (const theme of Object.keys(sortedThemes)) {
      sortedThemes[theme].sort((a, b) =>
        a.normalized.localeCompare(b.normalized)
      );
    }

    themes = sortedThemes;
  });
</script>

<h1>Index thématique</h1>

{#if Object.keys(themes).length === 0}
  <p>Chargement…</p>
{:else}
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
{/if}

<style>
  h1 {
    text-align: center;
    margin-top: 2rem;
  }

  .theme {
    margin: 2rem 0;
  }

  h2 {
    margin-bottom: 0.5rem;
    color: #444;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  li {
    margin: 0.3rem 0;
  }

  a {
    text-decoration: none;
    color: #006;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
