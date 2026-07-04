<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';
  import favicon from '$lib/assets/favicon.svg';
  import { db } from '$lib/db';
  import { searchSongs } from '$lib/search';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // SvelteKit layout API
  export let data;

  let searchTerm = '';
  let isSearchOpen = false;

  $: filteredSongs = searchSongs(data?.pages ?? [], searchTerm, 10);

  function closeSearch() {
    isSearchOpen = false;
    searchTerm = '';
  }

  // Initialise le thème depuis localStorage si présent
  function applyStoredTheme() {
    if (!browser) return;
    try {
      const stored = localStorage.getItem('theme');
      if (stored) {
        document.documentElement.dataset.theme = stored;
        if (typeof theme?.set === 'function') theme.set(stored);
      }
    } catch (e) {
      console.warn('Could not read theme from localStorage', e);
    }
  }

  onMount(async () => {
    // populate IndexedDB
    if (data?.pages) {
      for (const page of data.pages) {
        await db.pages.put(page);
      }
    }

    // apply theme from storage
    applyStoredTheme();

    // register service worker (use base so ça marche sur /Chansonnier/ ou racine)
    if (browser && 'serviceWorker' in navigator) {
      const swPath = `${base}/service-worker.js`.replace(/\/\/+/g, '/');
      try {
        const reg = await navigator.serviceWorker.register(swPath);
        console.log('Service worker registered with scope:', reg.scope);
      } catch (err) {
        console.warn('Service worker registration failed:', err);
      }
    }
  });

  function toggleTheme() {
    const current = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = current;
    try {
      localStorage.setItem('theme', current);
    } catch {}
    if (typeof theme?.set === 'function') theme.set(current);
  }
</script>

<svelte:head>
  <!-- Utilise base pour que le manifest soit trouvé sur GitHub Pages (/Chansonnier/) -->
  <link rel="manifest" href="{base}/manifest.json">
  <meta name="theme-color" content="#2563eb">
  <link rel="icon" href="{favicon}">
</svelte:head>

<div class="layout">
  <nav class="sidebar">
    <h2>Chansonnier</h2>
    <a href="{base}/">Accueil</a>
    <a href="{base}/index/alphabetique">Index alphabétique</a>
    <a href="{base}/index/thematique">Index thématique</a>

    <div class="search-box">
      <input
        type="search"
        bind:value={searchTerm}
        on:focus={() => (isSearchOpen = true)}
        on:input={() => (isSearchOpen = true)}
        placeholder="Rechercher une chanson"
        aria-label="Rechercher une chanson"
      />

      {#if isSearchOpen && searchTerm}
        <ul class="search-results" role="listbox">
          {#each filteredSongs as song}
            <li>
              <a
                href="{base}/page/{song.id}"
                on:click={closeSearch}
              >
                {song.title}
              </a>
            </li>
          {/each}
          {#if filteredSongs.length === 0}
            <li class="empty">Aucune chanson trouvée</li>
          {/if}
        </ul>
      {/if}
    </div>

    <button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">🌓</button>
  </nav>

  <main class="content">
    <slot />
  </main>
</div>

<style global>
  /* Sticky parents */
  html, body, .layout, .content {
    overflow: visible;
  }

  .app-header { 
    display:flex; 
    justify-content:
    space-between; 
    align-items:center; 
    padding:1rem; 
    border-bottom:1px solid var(--sidebar-border); 
    background:var(--sidebar-bg); 
  }

  /* Layout desktop */
  .layout {
    display: flex;
    min-height: 100vh;
    width: 100%;
  }

  .sidebar {
    width: 220px;
    background:var(--sidebar-bg);
    padding: 1rem;
    border-right:1px solid var(--sidebar-border);
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    padding: 2px 0rem; /* marge extérieure compacte */
    width: 100%;
    box-sizing: border-box;
    position: relative; /* nécessaire pour sticky */
  }

  .theme-toggle {
    background:none;
    border:none;
    cursor:pointer;
    font-size:1.2rem;
    margin-top: 0.75rem;
  }

  .search-box {
    margin: 1rem 0;
    position: relative;
  }

  .search-box input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.55rem 0.7rem;
    border: 1px solid var(--sidebar-border);
    border-radius: 0.4rem;
    background: var(--sidebar-bg);
    color: inherit;
  }

  .search-results {
    position: absolute;
    z-index: 20;
    top: calc(100% + 0.25rem);
    left: 0;
    right: 0;
    max-height: 240px;
    overflow-y: auto;
    background: var(--sidebar-bg);
    border: 1px solid var(--sidebar-border);
    border-radius: 0.4rem;
    list-style: none;
    padding: 0.25rem;
    margin: 0;
  }

  .search-results li {
    margin: 0;
  }

  .search-results a {
    display: block;
    padding: 0.45rem 0.55rem;
    border-radius: 0.3rem;
    text-decoration: none;
    color: inherit;
  }

  .search-results a:hover {
    background: color-mix(in srgb, var(--sidebar-border) 30%, transparent);
  }

  .search-results .empty {
    padding: 0.45rem 0.55rem;
    color: var(--text-muted, #666);
    font-size: 0.95rem;
  }

  /* Responsive mobile */
  @media (max-width: 700px) {
    .layout {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      border-right: none;
      padding: 0.8rem;
    }

    .content {
      padding: 2px 0rem;
    }
  }
</style>
