<script>
  import Dropdownmenu from "./dropdownmenu.svelte";
  import Footer from "./Footer.svelte";
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
</script>

<div class="searchresults-cnt">
  <Nav></Nav>
  <div class="searchresults-searcher">
    <div class="prevsearch"></div>
    <Search></Search>
  </div>
  <div class="searchresults-footer">
    <Footer></Footer>
  </div>
</div>

<style>
  .searchresults-footer {
    grid-column: 1;
    grid-row: 4;
  }
  .searchresults-cnt {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    width: 100%;
    height: 100vh;
  }
  .searchresults-searcher {
    grid-column: 1;
    grid-row: 3;
    width: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
  }
  .prevsearch {
    outline: 2px solid var(--grey-light);
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    width: 45em;
    height: 5em;
  }
</style>
