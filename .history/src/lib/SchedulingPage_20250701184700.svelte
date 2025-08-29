<div class="sched-wrapper">
  <div class="sched-1">
    <div class="sched-search">
      <input type="text" placeholder="FlightNo" />
    </div>
  </div>
  <div class="sched-2"></div>
</div>

<style>
  .sched-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  .sched-search input[type="text"] {
    width: 100%;
    padding: 10px;
    height: fit-content;
    outline: 3px solid var(--grey-light);
    font-size: 14px;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    color: var(--grey-dark);
  }
  .sched-search {
    width: 100%;
    height: fit-content;
  }
  .sched-1 {
    grid-column: 1;
    width: 100%;
    width: 900px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .sched-2 {
    grid-column: 2;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
</style>
