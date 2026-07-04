<script lang="ts">
  import { browser } from '$app/environment';

  let { data } = $props();

  let currentId = $derived(data?.id ?? '');
  let pages = $derived((data?.pages ?? []) as Array<{ id: string; title: string; html?: string; body?: string }>);
  let page = $derived(pages.find((entry) => entry.id === currentId));
  let htmlContainer = $state<HTMLDivElement | null>(null);
  let debugEnabled = $state(false);

  $effect(() => {
    if (!browser) return;
    const params = new URLSearchParams(window.location.search);
    debugEnabled = params.get('debug') === '1';
  });

  $effect(() => {
    if (!browser) return;
    console.debug('[song-page]', {
      currentId,
      pageId: page?.id ?? null,
      pageTitle: page?.title ?? null,
      pagesCount: pages.length,
      hasHtml: Boolean(page?.html)
    });
  });

  $effect(() => {
    if (page && page.html && htmlContainer) {
      htmlContainer.innerHTML = page.html;
    } else if (htmlContainer) {
      htmlContainer.innerHTML = '';
    }
  });
</script>

{#if debugEnabled}
  <pre class="debug-panel">
routeId={currentId}
pageId={page?.id ?? 'none'}
pagesCount={pages.length}
pageTitle={page?.title ?? 'none'}
hasHtml={page?.html ? 'yes' : 'no'}
  </pre>
{/if}

{#if !page}
  <p>Page introuvable…</p>
{:else}
  <article class="song">
    <h1>{page.title}</h1>

    {#if page.html}
      <div class="content" bind:this={htmlContainer}></div>
    {:else}
      <pre class="content">{page.body}</pre>
    {/if}
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
