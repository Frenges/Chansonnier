<script lang="ts">
  export let data: { pages?: any[] };

  import { onMount } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import "../app.css";

  const theme = writable('light');

  const query = writable('');
  const pagesStore = writable(data?.pages ?? []);
  $: if (data?.pages) pagesStore.set(data.pages);

  const results = derived([pagesStore, query], ([$pages, $query]) => {
    if (!$pages) return [];
    if (!$query || $query.trim() === '') return $pages.slice(0, 50);
    const q = $query.toLowerCase();
    return $pages.filter(p =>
      ((p.title || '').toLowerCase().includes(q)) ||
      ((p.slug || '').toLowerCase().includes(q))
    ).slice(0, 50);
  });

  export const offlineReady = writable(false);

  onMount(async () => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      theme.set(saved);
      document.documentElement.dataset.theme = saved;
    }

    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      try {
        await navigator.serviceWorker.register(base + '/service-worker.js');
        console.log('SW registered');
      } catch (e) {
        console.warn('SW registration failed', e);
      }
    }

    try {
      const mod = await import('$lib/dexie-client');
      mod.ensureDexieIsPopulated().then(() => offlineReady.set(true)).catch(err => console.warn('Dexie population failed', err));
    } catch (e) {
      // ignore in dev
    }
  });

  function toggleTheme() {
    const current = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = current;
    localStorage.setItem('theme', current);
    theme.set(current);
  }

  function openResult(r: any) {
    const slug = r.slug ?? r.id;
    if (!slug) return;
    goto(`${base}/page/${slug}`);
  }
</script>

<header class="app-header">
  <div class="header-left">
    <h1 class="brand">Chansonnier</h1>
  </div>

  <div class="header-right">
    <button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">🌓</button>
  </div>
</header>

<div class="layout">
  <nav class="sidebar" aria-label="Navigation">
    <div class="nav-links">
      <a class="nav-link" href={base + '/'}>Accueil</a>
      <a class="nav-link" href={base + '/index/alphabetique'}>Index alphabétique</a>
      <a class="nav-link" href={base + '/index/thematique'}>Index thématique</a>
    </div>

    <label for="search" class="visually-hidden">Rechercher</label>
    <input id="search" class="search" type="text" placeholder="Rechercher…" on:input={(e) => query.set(e.currentTarget.value)} />

    {#if $results && $results.length > 0}
      <div class="search-results" role="list">
        {#each $results as r}
          <a class="search-item" href={base + '/page/' + (r.slug ?? r.id)} on:click|preventDefault={() => openResult(r)}>
            {r.title}
          </a>
        {/each}
      </div>
    {:else}
      <div class="search-results empty">Aucun résultat</div>
    {/if}
  </nav>

  <main class="content">
    <slot />
  </main>
</div>

<style>
  .visually-hidden { position: absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0; }
  .app-header { display:flex; justify-content:space-between; align-items:center; padding:1rem; border-bottom:1px solid var(--sidebar-border); background:var(--sidebar-bg); }
  .brand { margin:0; font-size:1.2rem; }
  .theme-toggle { background:none; border:none; cursor:pointer; font-size:1.2rem; }
  .layout { display:flex; min-height:100vh; }
  .sidebar { width:220px; padding:1rem; box-sizing:border-box; border-right:1px solid var(--sidebar-border); background:var(--sidebar-bg); }
  .content { flex:1; padding:1rem; box-sizing:border-box; }
  .search { width:100%; padding:0.4rem; border-radius:6px; border:1px solid rgba(0,0,0,0.08); }
  .search-results { margin-top:0.5rem; display:flex; flex-direction:column; gap:0.35rem; max-height:60vh; overflow:auto; }
  .search-item { color:inherit; text-decoration:none; padding:0.25rem 0.4rem; border-radius:4px; }
  .search-item:hover { background:rgba(0,0,0,0.04); }
  .nav-links { display:flex; flex-direction:column; gap:0.35rem; margin-bottom:0.6rem; }
  .nav-link { display:inline-block; padding:0.35rem 0.5rem; color:var(--text); text-decoration:none; border-radius:6px; font-weight:600; }
  .nav-link:hover { background: rgba(0,0,0,0.04); }
  @media (max-width:700px) { .layout { flex-direction:column; } .sidebar { width:100%; border-right:none; border-bottom:1px solid var(--sidebar-border); } }
</style>
