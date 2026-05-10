<script lang="ts">
export let data: { page: any };

let page = { title: "Page introuvable", html: "<p>Introuvable</p>" };
$: page = data?.page ?? { title: "Page introuvable", html: "<p>Introuvable</p>" };

  import { onMount } from 'svelte';
  let container: HTMLDivElement | null = null;

  onMount(async () => {
    if (!container) return;

    container.querySelectorAll('[data-title="Refrain"]').forEach(el => {
      if (!el.classList.contains('refrain')) el.classList.add('refrain');
    });

    container.querySelectorAll('.couplet, .verse, [data-type="couplet"]').forEach(el => {
      if (!el.classList.contains('couplet')) el.classList.add('couplet');
    });
  });
</script>

<svelte:head>
  <title>{page.title}</title>
</svelte:head>

<article class="song">
  <h1 class="song-title">{page.title}</h1>
  <div class="song-body" bind:this={container}>
    {@html page.html}
  </div>
</article>

<style>
  .song-title { margin:0 0 1rem 0; font-size:1.6rem; font-weight:700; }
</style>
