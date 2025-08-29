<script lang="ts">
  import { Current_SearchFilter, FlightSearchResults } from "./Store/store";
  import { derived, get } from "svelte/store";

  let filters = $derived(get(Current_SearchFilter));
</script>

<div class="book-flight">
  <div class="book-flight-overlay"></div>
  <div class="book-flight-summary">
    <span style="font-size: var(--font-lg); font-weight: bold;">SUMMARY</span>
    <hr style="border-width: 2px; width:100%;text-align:left;margin-left:0" />
    <div class="summary-card"></div>
  </div>
</div>

<style>
  /* Booking */
  .book-flight {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100vh;
    z-index: 1001;
  }
  .book-flight-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
  }
  .book-flight-summary {
    display: flex;
    flex-direction: column;
    padding-top: 100px;
    justify-content: flex-start;
    align-items: center;
    width: 40em;
    height: 100%;
    background-color: white;
    row-gap: 15px;
  }
  /* Search */
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
    row-gap: 15px;
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
