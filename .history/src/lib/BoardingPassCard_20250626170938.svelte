<div class="boarding-cnt-wrap">
  <div class="boarding-cnt">
    <div class="ticket-search">
      <input type="text" />
      <span class="material-symbols-outlined"> search </span>
    </div>
  </div>
</div>

<style>
  .boarding-cnt-wrap {
    display: grid;
    grid-template-columns: repeat(1fr, 2);
    width: 100%;
    height: 100%;
  }
  .boarding-cnt {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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
    border-radius: 10px;
    box-shadow: none;
    border: none;
    outline: 3px solid var(--grey-light);
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 10px;
  }
  .ticket-search span {
    position: absolute;
    right: 12px;
  }
</style>
