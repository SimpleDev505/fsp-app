<script>
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
</script>

<div class="searchresults-cnt">
  <Nav></Nav>
  <div class="searchresults-searcher">
    <Search></Search>
  </div>
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
  }
  .searchresults-searcher {
    grid-column: 1;
    grid-row: 2;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: auto;
  }
</style>
