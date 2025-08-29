<script lang="ts">
  import Footer from "./Footer.svelte";
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
  import FlightResult from "./FlightResult.svelte";
  import type { FlightOffer } from "./Store/search";
  import ExtraFilter from "./ExtraFilter.svelte";

  // Dummy flight data matching your API response structure
  const dummyFlightOffer: FlightOffer = {
    token: "dummy_token_123",
    segments: [
      {
        departureAirport: {
          code: "DEL",
          name: "Delhi International Airport",
          city: "DEL",
          cityName: "Delhi",
          country: "IN",
          countryName: "India",
        },
        arrivalAirport: {
          code: "HYD",
          name: "Rajiv Gandhi International Airport",
          city: "HYD",
          cityName: "Hyderabad",
          country: "IN",
          countryName: "India",
        },
        departureTime: "2025-06-19T20:15:00",
        arrivalTime: "2025-06-19T22:30:00",
        totalTime: 8100, // 2h 15m in seconds
        legs: [
          {
            departureTime: "2025-06-19T20:15:00",
            arrivalTime: "2025-06-19T22:30:00",
            departureAirport: {
              code: "DEL",
              name: "Delhi International Airport",
              city: "DEL",
              cityName: "Delhi",
              country: "IN",
              countryName: "India",
            },
            arrivalAirport: {
              code: "HYD",
              name: "Rajiv Gandhi International Airport",
              city: "HYD",
              cityName: "Hyderabad",
              country: "IN",
              countryName: "India",
            },
            cabinClass: "ECONOMY",
            totalTime: 8100,
            flightInfo: {
              flightNumber: 382,
              planeType: "A320",
              carrierInfo: {
                operatingCarrier: "6E",
                marketingCarrier: "6E",
              },
            },
            carriersData: [
              {
                name: "IndiGo",
                code: "6E",
                logo: "https://r-xx.bstatic.com/data/airlines_logo/6E.png",
              },
            ],
            departureTerminal: "1",
            arrivalTerminal: "1",
          },
        ],
      },
      {
        departureAirport: {
          code: "HYD",
          name: "Rajiv Gandhi International Airport",
          city: "HYD",
          cityName: "Hyderabad",
          country: "IN",
          countryName: "India",
        },
        arrivalAirport: {
          code: "BOM",
          name: "Chhatrapati Shivaji International Airport",
          city: "BOM",
          cityName: "Mumbai",
          country: "IN",
          countryName: "India",
        },
        departureTime: "2025-06-19T23:40:00",
        arrivalTime: "2025-06-20T01:15:00",
        totalTime: 5700, // 1h 35m in seconds
        legs: [
          {
            departureTime: "2025-06-19T23:40:00",
            arrivalTime: "2025-06-20T01:15:00",
            departureAirport: {
              code: "HYD",
              name: "Rajiv Gandhi International Airport",
              city: "HYD",
              cityName: "Hyderabad",
              country: "IN",
              countryName: "India",
            },
            arrivalAirport: {
              code: "BOM",
              name: "Chhatrapati Shivaji International Airport",
              city: "BOM",
              cityName: "Mumbai",
              country: "IN",
              countryName: "India",
            },
            cabinClass: "ECONOMY",
            totalTime: 5700,
            flightInfo: {
              flightNumber: 5195,
              planeType: "A320",
              carrierInfo: {
                operatingCarrier: "6E",
                marketingCarrier: "6E",
              },
            },
            carriersData: [
              {
                name: "IndiGo",
                code: "6E",
                logo: "https://r-xx.bstatic.com/data/airlines_logo/6E.png",
              },
            ],
            arrivalTerminal: "1",
          },
        ],
      },
    ],
    priceBreakdown: {
      total: {
        currencyCode: "INR",
        units: 5574,
        nanos: 0,
      },
      baseFare: {
        currencyCode: "INR",
        units: 4200,
        nanos: 0,
      },
      tax: {
        currencyCode: "INR",
        units: 1374,
        nanos: 0,
      },
      fee: {
        currencyCode: "INR",
        units: 0,
        nanos: 0,
      },
      totalRounded: {
        currencyCode: "INR",
        units: 5574,
        nanos: 0,
      },
      discount: {
        currencyCode: "INR",
        units: 275,
        nanos: 0,
      },
      showPriceStrikethrough: true,
    },
    seatAvailability: {
      numberOfSeatsAvailable: 9,
    },
    tripType: "ONEWAY",
    brandedFareInfo: {
      fareName: "Economy",
      cabinClass: "ECONOMY",
      features: [
        {
          featureName: "CABIN_BAGGAGE",
          category: "BAGGAGE",
          label: "1 carry-on bag",
          availability: "INCLUDED",
          icon: "CABIN_LUGGAGE_ICON",
        },
      ],
    },
    fareRules: [
      {
        availablePolicies: [
          {
            type: "CHANGE_BEFORE",
            priceBreakdown: {
              total: {
                currencyCode: "INR",
                units: 2000,
                nanos: 0,
              },
            },
          },
        ],
      },
    ],
  };
</script>

<div class="searchresults-cnt">
  <div class="searchresults-nav">
    <Nav></Nav>
  </div>
  <div class="searchresults-searcher">
    <div class="prevsearch"></div>
    <Search></Search>
    <div class="searchresults-results">
      <div class="search-results-filter">
        <ExtraFilter></ExtraFilter>
      </div>
      <div class="search-results-cards">
        <FlightResult
          flightOffer={dummyFlightOffer}
          originalPrice={5849}
          discount={275}
          discountText="Rs.275 Discount Applied"
        />
      </div>
    </div>
  </div>
  <div class="searchresults-footer">
    <Footer></Footer>
  </div>
</div>

<style>
  .searchresults-nav {
    grid-column: 1;
    grid-row: 1;
    width: 100%;
    display: flex;
    height: auto;
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
    grid-template-rows: 1fr auto 1fr;
    width: 100%;
    height: 100vh;
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
  .prevsearch {
    outline: 2px solid var(--grey-light);
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    width: 45em;
    height: 5em;
  }
</style>
