<script>
  import { onMount } from "svelte";
  import FlightResult from "./FlightResult.svelte";
  import Search from "./Search.svelte";
  import { SelectedFlightOffer } from "./Store/search";
  import { FlightSearchResults } from "./Store/store";

  let selectedflight = $derived($SelectedFlightOffer);

  onMount(() => {
    SelectedFlightOffer.set(null);
  });
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
  <div class="sched-2">
    <p
      style="background-color: var(--blue-dark); width: 100%;
 padding: 10px; color: white; border-radius: 3px; text-align: center;"
    >
      Flight Info
    </p>
    <div class="sched-2-view">
      {#if selectedflight}
        <span class="sched-2-label">
          <span>Flight Scheduled</span>
          <span>{selectedflight.lastTicketingDate}</span>
        </span>
        <span class="sched-2-label">
          <span>Departure</span>
          <span
            >{selectedflight.itineraries[0].segments[0].departure
              .iataCode}</span
          >
          <span>Arrival</span>
          <span
            >{selectedflight.itineraries[0].segments[0].arrival.iataCode}</span
          >
        </span>
        <span class="sched-2-label">
          <span>Duration</span>
          <span>{selectedflight.itineraries[0].segments[0].duration}</span>
        </span>
        <span class="sched-2-label">
          <span>Stops</span>
          <span>{selectedflight.itineraries[0].segments[0].numberOfStops}</span>
        </span>
        <span class="sched-2-label">
          <span>Aircraft</span>
          <span>{selectedflight.itineraries[0].segments[0].aircraft.code}</span>
        </span>
        <span class="sched-2-label">
          <span>Aircraft</span>
          <span>
            {#each selectedflight.travelerPricings[0].fareDetailsBySegment[0].amenities ?? [] as amenity}
              {#if amenity.amenityType === "PRE_RESERVED_SEAT"}
                <span class="material-symbols-outlined"> flight_class </span>
              {:else if amenity.amenityType === "MEAL"}
                <span class="material-symbols-outlined"> flatware </span>
              {:else if amenity.amenityType === "BRANDED_FARES"}
                <span class="material-symbols-outlined"> add_card </span>
              {:else if amenity.amenityType === "UPGRADES"}
                <span class="material-symbols-outlined"> upgrade </span>
              {/if}
            {/each}
          </span>
        </span>
      {:else}
        <p>Mark Flight For Review!</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .sched-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .sched-2-label {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    height: fit-content;
    outline: 2px solid var(--grey-light);
    font-size: 14px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    color: var(--grey-dark);
  }
  .sched-2-label:hover {
    outline: 3px solid var(--blue-dark);
  }
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
    width: 100%;
    height: 100%;
    max-height: 25em;
    overflow: auto;
    background-color: var(--grey-light);
    padding: 10px;
    scroll-behavior: smooth;
    scrollbar-color: var(--blue-dark) transparent;
    scrollbar-width: thin;
  }
  .sched-results-viewer {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    padding-bottom: 25px;
    padding-top: 10px;
  }
  .sched-2-view {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    row-gap: 10px;
  }
</style>
