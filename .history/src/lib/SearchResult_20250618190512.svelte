<script>
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
</script>

<div class="searchresults-cnt">
  <Nav></Nav>
  <div class="searchresults-searcher">
    <div class="prevsearch"></div>
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
  }
  .prevsearch {
    outline: 5px solid var(--grey-light);
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    width: 100%;
    height: 5em;
  }
</style>
