<script>
  import Card from "./Card.svelte";
  import Footer from "./Footer.svelte";
  import HomeDescrp from "./HomeDescrp.svelte";
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
  <div class="home-title">
    <span class="home-title-1">Your Journey Begins Here</span>
  </div>
  <div class="searcher">
    <Search></Search>
  </div>
  <HomeDescrp></HomeDescrp>
</div>

<style>
  .searcher {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: fit-content;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -75px;
  }
  .home-title {
    grid-column: 1;
    grid-row: 2;
    z-index: 2;
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    pointer-events: none;
  }
  .home-title-1 {
    font-size: 60px;
    margin-bottom: 150px;
    color: white;
    font-weight: bolder;
    -webkit-text-stroke: 5px rgba(255, 255, 255, 0.8);
    letter-spacing: 2px;
  }
  .home-cnt {
    display: grid;
    grid-template-columns: repeat(1);
    grid-template-rows: auto auto 1fr;
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
