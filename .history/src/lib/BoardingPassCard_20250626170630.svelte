<div class="boarding-cnt">
  <div class="ticket-search">
    <input type="text" />
    <span class="material-symbols-outlined"> search </span>
  </div>
</div>

<style>
  .boarding-cnt {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1em;
  }
  .ticket-search {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: fit-content;
  }
  .ticket-search input[type="text"] {
    padding: 1em 5em;
    width: 100%;
  }
  .ticket-search span {
    position: absolute;
    right: 0;
  }
</style>
