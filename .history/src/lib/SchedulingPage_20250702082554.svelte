<script>
  import FlightResult from "./FlightResult.svelte";
  import Search from "./Search.svelte";
  import { FlightSearchResults } from "./Store/store";
</script>

<div class="sched-wrapper">
  <div class="sched-1">
    <div class="sched-search">
      <Search flight_search_filter_1={false}></Search>
    </div>
    <p
      style="background-color: var(--blue-dark); width: 100%;
 padding: 10px; color: white; border-radius: 3px; text-align: center;"
    >
      Flights
    </p>
    <div class="sched-results-cnt">
      <div class="sched-results-viewer">
        {#if $FlightSearchResults}
          {#each $FlightSearchResults.data as fres}
            <FlightResult flight={fres} staffview={true}></FlightResult>
          {/each}
        {/if}
      </div>
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
  }
  /* .sched-search input[type="text"] {
    width: 100%;
    padding: 10px;
    height: fit-content;
    outline: 3px solid var(--grey-light);
    font-size: 14px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    color: var(--grey-dark);
    transition: all 0.2s ease-in-out;
  }
  .sched-search input[type="text"]:focus {
    outline: 3px solid var(--blue-dark);
  } */
  .sched-search {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
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
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  .sched-2 {
    grid-column: 2;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    background-color: white;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 10px;
  }
  .sched-results-cnt {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    max-height: 25em;
    overflow: hidden;
    background-color: var(--grey-light);
    padding: 10px;
    padding-bottom: 25px;
  }
  .sched-results-viewer {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    row-gap: 10px;
  }
</style>
