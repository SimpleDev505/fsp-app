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
  <div class="home-title">
    <span class="home-title-1">Your Journey Begins Here</span>
  </div>
  <Search></Search>
</div>
