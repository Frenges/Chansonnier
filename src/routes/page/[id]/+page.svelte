<script lang="ts">
  // Récupération des données du load()
  let { data } = $props();
  const d = data;
  const { id, pages } = d;

  // 3) Debug
  console.log("DATA REÇUE DANS +page.svelte :", d);
  console.log("ID REÇU :", id);
  console.log("LISTE DES IDS DISPONIBLES :", pages?.map(p => p.id));

  // 4) Trouver la page
  const page = pages?.find((p) => p.id === id);

  let htmlContainer;

  $effect(() => {
    if (page && page.html && htmlContainer) {
      htmlContainer.innerHTML = page.html;
    }
  });
</script>

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
</style>
