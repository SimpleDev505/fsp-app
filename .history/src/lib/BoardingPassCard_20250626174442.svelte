<script lang="ts">
</script>

<div class="boarding-cnt-wrap">
  <div class="boarding-cnt">
    <div class="ticket-search">
      <input placeholder="Ticket Number..." type="text" />
      <span class="material-symbols-outlined"> search </span>
    </div>
    <div class="ticket-detail">
      <p
        style="width: 100%; height: fit-content; padding: 4px; margin: 0;
      color: var(--blue-dark); font-size: var(--font-sm);"
      >
        Ticket Detail:
      </p>
      <span>PassengerName</span>
      <span>Ticket Number</span>
      <span>Flight Number</span>
      <span>Airline</span>
      <div
        style="display: flex; justify-content: center; align-items: center; width: fit-content; height: fit-content;
        white-space: nowrap; column-gap: 15px;"
      >
        <div
          style="display: flex; flex-direction:column; justify-content: center; align-items: center;
          row-gap: 5px;"
        >
          <span>
            <span
              class="material-symbols-outlined"
              style="color: var(--blue); font-size: 32px;
            outline: none; background-color: transparent; 
            display: flex;justify-content:center; align-items: center;"
            >
              flight_takeoff
            </span>Departure Time</span
          >
        </div>
        <div
          style="display: flex;flex-direction:column;justify-content: center; align-items: center;
          row-gap: 5px;"
        >
          <span>
            <span
              class="material-symbols-outlined"
              style="color: var(--blue); font-size: 32px;
            outline: none; background-color: transparent;"
            >
              flight_land
            </span>Arrival Time</span
          >
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
    grid-template-columns: auto 1fr;
    width: 100%;
    height: 100%;
  }
  .boarding-cnt {
    grid-column: 1;
    width: 100%;
    height: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 1em;
    margin: 0;
  }
  .boarding-detail {
    justify-self: flex-end;
    grid-column: 2;
    width: 100%;
    max-width: 900px;
    height: 100%;
    padding: 1em;
    background-color: white;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 10px;
    margin: 0;
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
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    column-gap: 15px;
    outline: 3px solid var(--blue-dark);
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    width: 100%;
    padding: 10px;
    background-color: white;
  }
  .ticket-detail span {
    outline: 3px solid var(--grey-light);
    padding: 4px;
    border-radius: 5px;
    background-color: var(--grey-light);
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }
  .ticket-detail span:hover {
    outline: 2px solid var(--blue-dark);
  }
  .ticket-detail span,
  * {
    font-size: var(--font-s);
    font-weight: bold;
    white-space: nowrap;
    color: var(--grey-dark);
  }
</style>
