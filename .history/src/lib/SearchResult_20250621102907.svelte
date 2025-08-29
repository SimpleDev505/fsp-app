<script lang="ts">
  import Footer from "./Footer.svelte";
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
  import FlightResult from "./FlightResult.svelte";
  import type { FlightOffer } from "./Store/search";
  import ExtraFilter from "./ExtraFilter.svelte";
  import { Current_SearchFilter, FlightSearchResults } from "./Store/store";
  import { derived, get } from "svelte/store";

  let results = $derived(get(FlightSearchResults)?.data || null);
  let filters = $derived(get(Current_SearchFilter));

  function GetIcon_trip() {
    switch (filters.triptype) {
      case "One Way":
        return "trending_flat";
      case "Round Trip":
        return "sync_alt";
      case "Multi City":
        return "multiple_stop";
      default:
        return "";
    }
  }

  function GetIcon_currency() {
    switch (filters.currency) {
      case "INR":
        return "currency_rupee";
      case "USD":
        return "attach_money";
      case "EUR":
        return "euro_symbol";
      case "GBP":
        return "currency_pound";
      default:
        return "";
    }
  }
</script>

<div class="searchresults-cnt">
  <Nav></Nav>
  <div class="searchresults-searcher">
    <div class="prevsearch">
      <div class="prev-info-top">
        <div class="prev-info-other">
          <span class="prev-info-other-cnt">
            Trip Type: {filters.triptype}
            <span
              style="font-size: var(--font-s);"
              class="material-symbols-outlined"
            >
              {GetIcon_trip()}
            </span>
          </span>
          <span class="prev-info-other-cnt">
            <span
              style="font-size: var(--font-s);"
              class="material-symbols-outlined"
            >
              child_care
            </span>
            {filters.passengers.infant}
            <span
              style="font-size: var(--font-s);"
              class="material-symbols-outlined"
            >
              boy
            </span>
            {filters.passengers.child}
            <span
              style="font-size: var(--font-s);"
              class="material-symbols-outlined"
            >
              person
            </span>
            {filters.passengers.adult}
          </span>
          <span class="prev-info-other-cnt">
            Class: {filters.class}
          </span>
          <span class="prev-info-other-cnt">
            {filters.currency}
            <span
              style="font-size: var(--font-s);"
              class="material-symbols-outlined"
            >
              {GetIcon_currency()}
            </span>
          </span>
        </div>
        {#each filters.timings as time}
          <div class="prev-s-d-card">
            <div class="prev-s">
              <span class="prev-s-d-time0">Source</span>
              <span class="prev-s-d-time1">
                <span
                  style="font-size: var(--font-sm);"
                  class="material-symbols-outlined">flight_takeoff</span
                >
                {time.from.replace(/,.*/, "")}
              </span>
              <span class="prev-s-d-time2">{time.dep}</span>
            </div>
            <div class="prev-d">
              <span class="prev-s-d-time0">Destination</span>
              <span class="prev-s-d-time1">
                <span
                  style="font-size: var(--font-sm);"
                  class="material-symbols-outlined">flight_land</span
                >
                {time.to.replace(/,.*/, "")}
              </span>
              <span class="prev-s-d-time2">{time.return ?? "no-return"}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
    <Search></Search>
    <div class="searchresults-results">
      <div class="search-results-filter">
        <ExtraFilter></ExtraFilter>
      </div>
      <div class="search-results-cards">
        <div class="searchresult-info">
          <div>AIRLINE</div>
          <div>DEPART</div>
          <div>DURATION</div>
          <div>ARRIVE</div>
          <div>PRICE</div>
        </div>
        {#key $FlightSearchResults}
          {#if results}
            {#each results as flight (flight.id)}
              <FlightResult {flight} />
            {/each}
          {:else}
            <p>No flights found.</p>
          {/if}
        {/key}
      </div>
    </div>
  </div>
  <div class="searchresults-footer">
    <Footer></Footer>
  </div>
</div>

<style>
  .searchresult-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    text-align: center;
    height: fit-content;
    margin-bottom: 10px;
    grid-column: 2;
    grid-row: 1;
    background-color: white;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 8px;
    outline: 2px solid var(--grey-light);
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  }
  .search-results-filter {
    grid-column: 1;
    grid-row: 1;
  }
  .search-results-cards {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: fit-content;
    padding-left: 15px;
    padding-right: 25px;
  }
  .search-results-cards:not(:first-child) {
    margin-top: 15px;
  }
  .searchresults-results {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    width: 100%;
    height: fit-content;
    margin-top: 50px;
  }
  .searchresults-footer {
    grid-column: 1;
    grid-row: 4;
  }
  .searchresults-cnt {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    width: 100%;
    height: 100%;
    row-gap: 35px;
    /* background-color: var(--grey-light); */
  }
  .searchresults-searcher {
    grid-column: 1;
    grid-row: 3;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  /* Prev Search */
  .prevsearch {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    outline: 2px solid var(--grey-light);
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    width: 45em;
    min-height: 6em;
    height: fit-content;
    padding: 5px;
  }
  .prev-info-top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 10px;
    row-gap: 12px;
  }
  .prev-info-other-cnt {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;
    font-size: 13px;
    font-weight: bold;
    background-color: var(--grey-light);
    padding: 4px;
    border-radius: 4px;
  }
  .prev-info-other {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    column-gap: 10px;
  }
  .prev-s-d-card {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    column-gap: 12px;
    outline: 2px solid var(--grey-light);
    padding: 5px;
    border-radius: 10px;
  }
  .prev-s,
  .prev-d {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .prev-s-d-time2 {
    color: var(--grey-dark);
    font-size: 12px;
    font-weight: bold;
  }
  .prev-s-d-time0 {
    color: var(--grey-dark);
    font-size: var(--font-s);
    font-weight: bold;
    opacity: 0.5;
  }
  .prev-s-d-time1 {
    color: var(--blue);
    font-size: 16px;
    font-weight: bold;
  }
</style>
