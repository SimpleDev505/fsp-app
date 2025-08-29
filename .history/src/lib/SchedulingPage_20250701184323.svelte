<div class="sched-wrapper">
  <div class="sched-1">
    <div class="sched-search">
      <input placeholder="FlightNo" />
    </div>
  </div>
</div>

<style>
  .sched-wrapper {
    display: grid;
    grid-template-columns: auto auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .sched-search {
    width: 100%;
    height: fit-content;
    outline: 3px solid var(--grey-light);
    font-size: 18px;
    font-weight: bold;
    color: var(--grey-dark);
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
</style>
