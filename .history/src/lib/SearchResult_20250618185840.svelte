<script>
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
</script>

<div class="searchresults-cnt">
  <Nav></Nav>
  <Search></Search>
</div>

<style>
  .searchresults-cnt {
    display: grid;
    grid-template-columns: repeat(1);
    grid-template-rows: auto auto 1fr;
    width: 100%;
    height: 100%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
