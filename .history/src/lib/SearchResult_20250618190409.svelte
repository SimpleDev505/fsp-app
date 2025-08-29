<script>
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
</script>

<div class="searchresults-cnt">
  <Nav></Nav>
  <div class="searchresults-searcher">
    <div></div>
    <Search></Search>
  </div>
</div>

<style>
  .searchresults-cnt {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr 1fr;
    width: 100%;
    height: 100vh;
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
