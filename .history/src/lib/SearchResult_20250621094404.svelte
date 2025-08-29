<script lang="ts">
  import Footer from "./Footer.svelte";
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
  import FlightResult from "./FlightResult.svelte";
  import type { FlightOffer } from "./Store/search";
  import ExtraFilter from "./ExtraFilter.svelte";
  import { Current_SearchFilter, FlightSearchResults } from "./Store/store";
  import { get } from "svelte/store";

  let results = $derived(get(FlightSearchResults)?.data || null);
  let filters = $derived(get(Current_SearchFilter));
</script>

<div class="searchresults-cnt">
  <Nav></Nav>
  <div class="searchresults-searcher">
    <div class="prevsearch">
      <div class="prev-info-top">
        {#each filters.timings as time}
          <div class="prev-s-d-card">
            <div class="prev-s">
              <span>Source</span>
              <span>{time.from}</span>
              <span>{time.dep}</span>
            </div>
            <div class="prev-d">
              <span>Destination</span>
              <span>{time.to}</span>
              <span>{time.return}</span>
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
    margin-top: 45px;
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
  }
  .searchresults-results {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    width: 100%;
    height: fit-content;
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
    height: 5em;
  }
  .prev-info-top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .prev-s-d-card {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>
