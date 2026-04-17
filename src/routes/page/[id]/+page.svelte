<script lang="ts">
  import { db } from "$lib/db";
  import { onMount } from "svelte";

  let { params } = $props();

  let page = $state<any>(null);

  onMount(async () => {
    page = await db.pages.get(params.id);
  });
</script>

{#if !page}
  <p>Chargement…</p>
{:else}
  <article class="song">
    <h1>{page.title}</h1>

    <!-- Affichage du texte brut -->
    <pre class="content">{page.body}</pre>
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
</style>
