<script>
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
</script>

<div class="home-cnt">
  <Nav></Nav>
  <div class="home-header">
    <div class="home-img-cnt">
      <div class="home-img-filter"></div>
      <img class="home-img" src="src/assets/img/home.png" alt="" />
    </div>
  </div>
  <h4 class="home-title">Your Journey Begins Here</h4>
  <Search></Search>
</div>

<style>
  .home-title {
    grid-column: 1;
    grid-row: 2;
    z-index: 1000;
    position: fixed;
    bottom: 0;
  }
  .home-cnt {
    display: grid;
    grid-template-columns: repeat(1);
    grid-template-rows: auto auto auto;
    width: 100%;
    height: 100%;
  }
  .home-header {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .home-img-cnt {
    width: 100%;
    height: 745px;
    position: relative;
    overflow-y: hidden;
  }
  .home-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  .home-img-filter {
    background: var(--blue);
    filter: opacity(13%);
    width: 100%;
    height: 100%;
    position: absolute;
  }
</style>
