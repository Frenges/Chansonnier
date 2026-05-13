<script lang="ts">
  import { onMount } from "svelte";

  let theme: "light" | "dark" | "system" = "system";

  function applyTheme(t: string) {
    const root = document.documentElement;
    if (t === "dark") root.classList.add("dark"); else root.classList.remove("dark");
    // set data-theme as well for CSS that targets [data-theme="dark"]
    root.setAttribute("data-theme", t === "dark" ? "dark" : "light");
  }

  function toggle() {
    if (theme === "dark") { theme = "light"; localStorage.setItem("theme", "light"); }
    else { theme = "dark"; localStorage.setItem("theme", "dark"); }
    applyTheme(theme);
  }

  onMount(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") theme = stored as "dark" | "light";
    else theme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    applyTheme(theme);
  });
</script>

<style>
  .theme-toggle { display:block; margin:0.6rem 0; }
  .theme-toggle button {
    display:inline-flex; align-items:center; gap:0.5rem;
    padding:0.4rem 0.6rem; border-radius:6px; border:1px solid #ccc;
    background:white; cursor:pointer;
  }
  .theme-toggle button:focus { outline:2px solid #6aa0ff; }
  .dark .theme-toggle button { background:#222; color:#eee; border-color:#444; }
</style>

<div class="theme-toggle" role="region" aria-label="Theme">
  <button on:click={toggle} aria-pressed={theme === "dark"}>
    {#if theme === "dark"} 🌙 Mode sombre {:else} ☀️ Mode clair {/if}
  </button>
</div>