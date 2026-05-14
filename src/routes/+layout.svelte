<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';
  import favicon from '$lib/assets/favicon.svg';
  import { db } from '$lib/db';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // SvelteKit layout API
  export let data;

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
