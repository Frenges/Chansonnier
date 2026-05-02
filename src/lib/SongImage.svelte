<script>
  export let src;
</script>

<div class="song-image">
  <img src={`/images/${src}`} alt="" />
</div>

<style>
.song-image {
  text-align: center;
  margin: 1rem 0;
}

.song-image img {
  max-width: 100%;
  height: auto;
}
</style>
