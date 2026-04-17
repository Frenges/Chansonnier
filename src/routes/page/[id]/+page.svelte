<script lang="ts">
  import { onMount } from "svelte";
  import { db } from "$lib/db";

  let { data } = $props();

  // Variable réactive Svelte 5
  let page = $state(null);

  onMount(async () => {
    page = await db.pages.get(data.id);
  });
</script>

{#if page}
  <h1>{page.title}</h1>

  <div class="content">
    {@html page.body}
  </div>
{:else}
  <p>Chargement…</p>
{/if}

<style>
  .content {
    line-height: 1.6;
    max-width: 700px;
  }
</style>
