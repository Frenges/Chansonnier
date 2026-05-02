<script lang="ts">
  import '../app.css';        /* 🔥 AJOUT CRITIQUE */
  import { base } from "$app/paths";
  import favicon from '$lib/assets/favicon.svg';
  import { db } from "$lib/db";
  import { onMount } from "svelte";

  let { children, data } = $props();

  onMount(async () => {
    for (const page of data.pages) {
      await db.pages.put(page);
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="layout">
  <nav class="sidebar">
    <h2>Chansonnier</h2>
    <a href={`${base}/`}>Accueil</a>
    <a href={`${base}/index/alphabetique`}>Index alphabétique</a>
    <a href={`${base}/index/thematique`}>Index thématique</a>
  </nav>

  <main class="content">
    {@render children({ data })}
  </main>
</div>

<style global>
  .layout {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 220px;
    background: #f0f0f0;
    padding: 1.5rem;
    border-right: 1px solid #ddd;
  }

  .sidebar h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  .sidebar a {
    display: block;
    margin: 0.5rem 0;
    text-decoration: none;
    color: #333;
    font-size: 1.1rem;
  }

  .sidebar a:hover {
    text-decoration: underline;
  }

  .content {
    flex: 1;
    padding: 2rem;
  }
</style>
