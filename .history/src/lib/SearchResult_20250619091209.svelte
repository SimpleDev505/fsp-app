<script>
  import Dropdownmenu from "./dropdownmenu.svelte";
  import FlightResult from "./FlightResult.svelte";
  import Footer from "./Footer.svelte";
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
</script>

<div class="searchresults-cnt">
  <Nav></Nav>
  <div class="searchresults-searcher">
    <div class="prevsearch"></div>
    <Search></Search>
  </div>
  <div class="searchresults-results">
    <div class="search-results-filter"></div>
    <div class="search-results-cards">
      <FlightResult
        airline="IndiGo"
        flightCode="6E-519"
        from="DELHI"
        to="MUMBAI"
        departure="2025-07-13T23:30"
        arrival="2025-07-14T01:45"
        duration="02h 15m"
        baseFare={8100}
        tax={1000}
        totalFare={9100}
        originalFare={9500}
        refundable={true}
        cancellationPolicy={[
          { label: "Before 72hrs", airlineFee: 3200, serviceFee: 150 },
          { label: "Within 72hrs", airlineFee: 4200, serviceFee: 200 },
        ]}
        reschedulePolicy={[
          { label: "Before 72hrs", airlineFee: 2200, serviceFee: 100 },
          { label: "Within 72hrs", airlineFee: 2200, serviceFee: 100 },
        ]}
      />
    </div>
  </div>
  <div class="searchresults-footer">
    <Footer></Footer>
  </div>
</div>

<style>
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
    align-items: center;
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
    grid-template-rows: 1fr auto 1fr;
    width: 100%;
    height: 100vh;
  }
  .searchresults-searcher {
    grid-column: 1;
    grid-row: 2;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .prevsearch {
    outline: 2px solid var(--grey-light);
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    width: 45em;
    height: 5em;
  }
</style>
