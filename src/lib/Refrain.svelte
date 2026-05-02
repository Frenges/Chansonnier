<script>
  export let children;
</script>

<div class="refrain">
  <slot />
</div>

<style global>
/* Style minimal pour conserver le sticky sans écraser app.css */
.refrain {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
