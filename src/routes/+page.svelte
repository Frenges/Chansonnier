<script lang="ts">
  // Svelte 5 : pas besoin de load ici
</script>

<h1>Chansonnier</h1>

<nav class="menu">
  <a href="/index/alphabetique">Index alphabétique</a>
  <a href="/index/thematique">Index thématique</a>
</nav>

<style>
  h1 {
    text-align: center;
    margin-top: 2rem;
  }

  .menu {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 300px;
    margin: 3rem auto;
  }

  .menu a {
    display: block;
    padding: 1rem;
    text-align: center;
    background: #eee;
    border-radius: 8px;
    text-decoration: none;
    font-size: 1.2rem;
    color: #333;
    transition: background 0.2s;
  }

  .menu a:hover {
    background: #ddd;
  }
</style>
