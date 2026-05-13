<script lang="ts">
  import '../app.css';
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
  /* Sticky parents */
  html, body, .layout, .content {
    overflow: visible;
  }

  /* Layout desktop */
  .layout {
    display: flex;
    min-height: 100vh;
    width: 100%;
  }

  .sidebar {
    width: 220px;
    background: #f0f0f0;
    padding: 1rem;
    border-right: 1px solid #ddd;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    padding: 2px 0rem; /* marge extérieure compacte */
    width: 100%;
    box-sizing: border-box;
    position: relative; /* nécessaire pour sticky */
  }

  /* Responsive mobile */
  @media (max-width: 700px) {
    .layout {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #ddd;
      padding: 0.8rem;
    }

    .content {
      padding: 2px 0rem;
    }
  }
</style>
