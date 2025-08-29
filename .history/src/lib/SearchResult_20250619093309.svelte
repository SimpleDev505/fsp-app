<script>
  import Dropdownmenu from "./dropdownmenu.svelte";
  import FlightResult from "./FlightResult.svelte";
  import Footer from "./Footer.svelte";
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
  const flightData = {
    flightSegments: [
      {
        flightCode: '6E-382',
        from: 'Delhi (DEL)',
        to: 'Hyderabad (HYD)',
        departureTime: '20:15',
        arrivalTime: '22:30',
        duration: '02h 15m',
      },
      {
        flightCode: '6E-5195',
        from: 'Hyderabad (HYD)',
        to: 'Mumbai (BOM)',
        departureTime: '23:40',
        arrivalTime: '01:15',
        duration: '01h 35m',
      },
    ],
    price: 5574,
    originalPrice: 5849,
    discountLabel: 'Rs.275 Discount Applied',
    fareInfo: {
      baseFare: 4966,
      tax: 883,
      total: 5849,
      rules: [
        {
          title: 'Time Frame to cancel',
          entries: [
            { label: 'Cancel Before 72 hours of departure time.', airlineFee: 3209, emtFee: 300 },
            { label: 'Cancel within 72 hours & before 4 hours of departure time.', airlineFee: 4279, emtFee: 300 },
          ],
        },
        {
          title: 'Time Frame to reschedule',
          entries: [
            { label: 'Reschedule before 72 hours of departure time.', airlineFee: 2999, emtFee: 300 },
            { label: 'Reschedule within 72 hours & before 4 hours of departure time.', airlineFee: 2999, emtFee: 300 },
          ],
        },
      ],
    },
    baggageInfo: [
      { airline: 'IndiGo', code: '6E-382', checkIn: '15kgs', cabin: '7kg' },
      { airline: 'IndiGo', code: '6E-5195', checkIn: '15kgs', cabin: '7kg' },
    ],
    cancelRules: {
      rules: [
        {
          title: 'Time Frame to cancel',
          entries: [
            { label: 'Cancel Before 72 hours of departure time.', airlineFee: 3209, emtFee: 300 },
            { label: 'Cancel within 72 hours & before 4 hours of departure time.', airlineFee: 4279, emtFee: 300 },
          ],
        },
        {
          title: 'Time Frame to reschedule',
          entries: [
            { label: 'Reschedule before 72 hours of departure time.', airlineFee: 2999, emtFee: 300 },
            { label: 'Reschedule within 72 hours & before 4 hours of departure time.', airlineFee: 2999, emtFee: 300 },
          ],
        },
      ],
    },
    departureTime: '20:15',
    arrivalTime: '01:15',
    fromCity: 'Delhi',
    toCity: 'Mumbai',
    duration: '05h 00m',
  };
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
       {..flightData}
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
