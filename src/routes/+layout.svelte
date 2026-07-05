<script lang="ts">
  import '../app.css';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import { searchSongs } from '$lib/search';
  import { goto, beforeNavigate, afterNavigate } from '$app/navigation';

  /**
   * Root layout component for the entire app.
   *
   * This shell contains the sidebar, search UI, theme toggle, and app-level
   * navigation instrumentation. It receives the shared `pages` payload from
   * `src/routes/+layout.ts` as `data.pages`.
   */
  export let data;

  let searchTerm = '';
  let isSearchOpen = false;
  let navInProgress = false;
  let debugEnabled = false;
  let runtimeErrors: Array<{message:string, stack?:string}> = [];

  // The search UI is client-side only and depends on the current page data.
  // `navInProgress` prevents a second navigation before the first one finishes.
  // This is important in the search flow so a user can search again from the
  // current content page without breaking the SvelteKit route transition.
  if (browser) {
    try {
      beforeNavigate((nav) => {
        console.debug('[client] beforeNavigate', nav);
      });
      afterNavigate((nav) => {
        console.debug('[client] afterNavigate', nav);
      });
    } catch (e) {
      console.warn('navigation tracing not available', e);
    }
  }

  // Keep the filtered search results in sync with the typed query and current page list.
  // Since `data.pages` comes from the top-level layout loader, this reactive value
  // is updated as soon as the top-level data changes.
  $: filteredSongs = searchSongs(data?.pages ?? [], searchTerm, 10);

  $: console.debug('[client] +layout data.pages count =', data?.pages?.length ?? 'none');

  function closeSearch() {
    isSearchOpen = false;
    searchTerm = '';
  }

  async function navigateToSong(songId: string) {
    if (navInProgress) return;
    navInProgress = true;

    // `goto()` triggers client-side navigation in SvelteKit. We await it so the
    // router can complete the route change before we clear the search UI.
    // If the search UI is removed too early, the browser may change the URL but
    // the page component may not refresh correctly.
    try {
      console.debug('[client] navigateToSong START', songId);
      await goto(`${base}/page/${songId}`);
      console.debug('[client] navigateToSong DONE', songId);
    } finally {
      closeSearch();
      navInProgress = false;
    }
  }

  // Initialise le thème depuis localStorage si présent
  function applyStoredTheme() {
    if (!browser) return;
    try {
      const stored = localStorage.getItem('theme');
      if (stored) {
        document.documentElement.dataset.theme = stored;
      }
    } catch (e) {
      console.warn('Could not read theme from localStorage', e);
    }
  }

  if (browser) {
    (async () => {
      // Debug flag via ?debug=1
      const params = new URLSearchParams(window.location.search);
      debugEnabled = params.get('debug') === '1';

      // apply theme from storage
      applyStoredTheme();

      // register service worker (use base so ça marche sur /Chansonnier/ ou racine)
      if ('serviceWorker' in navigator) {
        const swPath = `${base}/service-worker.js`.replace(/\/\/+/g, '/');
        try {
          const reg = await navigator.serviceWorker.register(swPath);
          console.log('Service worker registered with scope:', reg.scope);
        } catch (err) {
          console.warn('Service worker registration failed:', err);
        }
      }

      // Capture runtime errors for debugging
      const onError = (ev) => {
        try {
          const msg = ev?.message || String(ev);
          const stack = ev?.error?.stack || undefined;
          runtimeErrors = [...runtimeErrors, { message: msg, stack }];
          console.error('[runtime error captured]', msg, stack);
        } catch (e) {
          console.error('error capturing runtime error', e);
        }
      };

      const onRejection = (ev) => {
        try {
          const reason = ev?.reason;
          const msg = reason?.message || String(reason);
          const stack = reason?.stack || undefined;
          runtimeErrors = [...runtimeErrors, { message: msg, stack }];
          console.error('[unhandledrejection captured]', msg, stack);
        } catch (e) {
          console.error('error capturing rejection', e);
        }
      };

      window.addEventListener('error', onError);
      window.addEventListener('unhandledrejection', onRejection);
    })();
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = current;
    try {
      localStorage.setItem('theme', current);
    } catch {}
    // theme store not configured here; keep visual only
  }
</script>

<svelte:head>
  <!--
    The web manifest describes the installable app shell and navigation icon
    used by mobile/desktop PWA installation. It is separate from the browser
    favicon, which is shown in the tab bar.
  -->
  <link rel="manifest" href="{base}/manifest.json">
  <meta name="theme-color" content="#2563eb">
  <!--
    Use the same shared icon symbol for browser tabs and PWA install icons.
    This makes the UI consistent between the browser favicon and the
    manifest/app-install icon set.
  -->
  <link rel="icon" type="image/svg+xml" href="{base}/icons/Zirkel-192.svg">
  <link rel="apple-touch-icon" href="{base}/icons/Zirkel-192.svg">
  <script>if (typeof window !== 'undefined' && location.search.indexOf('debug=1')!==-1){
    window.addEventListener('error', (e)=>{
      try{document.body.innerHTML = '<pre style="white-space:pre-wrap; background:#fee; color:#900; padding:1rem;">CLIENT ERROR: '+(e.message||e.toString())+'\n'+(e.error&&e.error.stack?e.error.stack:'')+'</pre>'+document.body.innerHTML;}catch(err){console.error(err)}
    });
    window.addEventListener('unhandledrejection',(ev)=>{try{const r=ev.reason||ev; document.body.innerHTML = '<pre style="white-space:pre-wrap; background:#fee; color:#900; padding:1rem;">UNHANDLED REJECTION: '+(r.message||String(r))+'\n'+(r.stack||'')+'</pre>'+document.body.innerHTML;}catch(e){console.error(e)}});
  }</script>
</svelte:head>

<div class="layout">
  <nav class="sidebar">
    <h2>Chansonnier</h2>
    <a href="{base}/">Accueil</a>
    <a href="{base}/index/alphabetique">Index alphabétique</a>
    <a href="{base}/index/thematique">Index thématique</a>
    <button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">🌓</button>

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
              <!--
                The result is rendered as a link for accessibility and correct URL semantics.
                `on:click|preventDefault` lets us use `goto()` manually while still
                keeping the element keyboard-focusable and announcing it as a link.
                This is essential for chaining searches from the current page without
                leaving the app shell or forcing a hard reload.
              -->
              <a class="search-link" href="{base}/page/{song.id}" on:click|preventDefault={() => navigateToSong(song.id)}>
                {song.displayTitle ?? song.title}
              </a>
              <!--
                The search result shows `song.displayTitle` when available.
                This allows alias titles to appear in the suggestion list while
                the actual route remains canonical: `/page/{song.id}`.
                The canonical URL is still used for navigation and page loading.
              -->
            </li>
          {/each}
          {#if filteredSongs.length === 0}
            <li class="empty">Aucune chanson trouvée</li>
          {/if}
        </ul>
      {/if}
    </div>
  </nav>

  {#if debugEnabled}
    <aside class="debug-panel">
      <h3>Debug</h3>
      <pre>{JSON.stringify({ pagesCount: data?.pages?.length ?? 0, serverLoaded: data?._debug_server_loaded ?? false, sample: (data?.pages ?? []).slice(0,5).map(p=>({id:p.id,title:p.title})), runtimeErrors }, null, 2)}</pre>
    </aside>
  {/if}

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

  .search-results .search-link {
    display: block;
    width: 100%;
    padding: 0.45rem 0.55rem;
    border: none;
    border-radius: 0.3rem;
    text-align: left;
    text-decoration: none;
    color: inherit;
    background: transparent;
    cursor: pointer;
    font: inherit;
  }

  .search-results .search-link:hover {
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
