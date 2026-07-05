<script lang="ts">
  export let data;
  import { onMount } from 'svelte';

  // Non-dev explanation:
  // `data` comes from SvelteKit's route loader. When the user navigates using
  // the search UI, the route data changes but the component must also update.
  // This reactive statement ensures the displayed `page` is replaced whenever
  // SvelteKit provides new data for the current route.
  $: page = data?.page ?? null;

  onMount(() => {
    try {
      console.debug('[client] +page mounted', page?.id, page?.title);
    } catch (e) {}
  });

  // Technical note:
  // We log page updates because the page component may remain mounted across
  // client-side navigations. If `page` were not reactive, the DOM would not
  // refresh even though the URL and route data changed.
  $: if (page) console.debug('[client] +page updated', page.id, page.title);
</script>

{#if !page}
  <p>Page introuvable…</p>
{:else}
  <article class="song">
    <h1>{page.title}</h1>
    {@html page.html ?? page.body}
  </article>
{/if}

<style>
  .song {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .content {
    white-space: pre-wrap;
    line-height: 1.6;
  }

  .content img {
    max-width: 100%;
  }

  .debug-panel {
    margin: 1rem auto;
    max-width: 700px;
    padding: 0.75rem;
    border: 1px solid var(--sidebar-border);
    border-radius: 0.4rem;
    background: color-mix(in srgb, var(--sidebar-bg) 85%, transparent);
    white-space: pre-wrap;
    font-size: 0.9rem;
  }
</style>
