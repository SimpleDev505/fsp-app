<div class="home-cnt">
  <div class="home-header">
    <div class="home-img-cnt">
      <img class="home-img" src="src/assets/img/home.png" alt="" />
    </div>
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
  .home-img-cnt {
    width: 100%;
    height: 100%;
    background-color: var(--blue);
    filter: opacity(0.9);
  }
  .home-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
</style>
