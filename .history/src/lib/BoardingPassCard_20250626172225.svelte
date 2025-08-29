<div class="boarding-cnt-wrap">
  <div class="boarding-cnt">
    <div class="ticket-search">
      <input placeholder="Ticket Number..." type="text" />
      <span class="material-symbols-outlined"> search </span>
    </div>
    <div class="ticket-detail">
      <span>PassengerName</span>
      <span>Ticket Number</span>
      <span>Flight Number</span>
      <span>Airline</span>
      <div
        style="display: flex; justify-content: center; align-items: center; width: fit-content; height: fit-content;
        white-space: nowrap; column-gap: 10px;"
      >
        <div>
          <span class="material-symbols-outlined"> flight_takeoff </span>
          From
          <p>Departure Time</p>
        </div>
        <div>
          <span class="material-symbols-outlined"> flight_land </span>
          To
          <p>Arrival Time</p>
        </div>
      </div>
      <span>Gate</span>
      <span>Cabin Class</span>
      <span>Baggage Allowance</span>
      <span>Booking Date</span>
      <span>Status</span>
    </div>
  </div>
  <!-- Column 2 -->
  <div class="boarding-detail"></div>
</div>

<style>
  .boarding-cnt-wrap {
    display: grid;
    grid-template-columns: repeat(1fr, 2);
    width: 100%;
    height: 100%;
  }
  .boarding-cnt {
    grid-column: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 1em;
  }
  .boarding-detail {
    grid-column: 2;
    width: 100%;
    height: 100%;
    padding: 1em;
    background-color: white;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 10px;
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
    font-size: var(--font-sm);
  }
  .ticket-search input[type="text"]:focus {
    outline: 3px solid var(--blue-dark);
    transition: 0.2s ease-in;
  }
  .ticket-search span {
    position: absolute;
    right: 12px;
    color: var(--blue-dark);
  }
  .ticket-detail {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 15px;
    outline: 3px solid var(--grey-light);
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    width: 100%;
  }
  .ticket-detail span,
  * {
    font-size: var(--font-sm);
    font-weight: bold;
  }
</style>
