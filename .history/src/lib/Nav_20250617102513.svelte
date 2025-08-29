<script lang="ts">
  function handlenavscroll(e: Event) {}
  window.addEventListener("scroll", handlenavscroll);
</script>

<div class="nav-cnt"></div>

<style>
  .nav-cnt {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    width: 100%;
    height: 3em;
    position: relative;
    color: white;
  }
</style>
