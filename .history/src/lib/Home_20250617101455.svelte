<div class="home-cnt">
  <div class="home-header">
    <img class="home-img" src="img/home.png" alt="" />
  </div>
</div>

<style>
  .home-cnt {
    display: grid;
    grid-template-columns: repeat(1);
    grid-template-rows: 1fr 1fr 1fr;
    width: 100%;
    height: 100%;
  }
  .home-header {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>
