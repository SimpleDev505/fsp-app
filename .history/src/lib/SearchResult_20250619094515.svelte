<script>
  import { writable } from "svelte/store";
  import Dropdownmenu from "./dropdownmenu.svelte";
  import FlightResult from "./FlightResult.svelte";
  import Footer from "./Footer.svelte";
  import Nav from "./Nav.svelte";
  import Search from "./Search.svelte";
  const flightSegments = {
    token: "dummy_token_12345",
    segments: [
      {
        departureAirport: {
          type: "AIRPORT",
          code: "DEL",
          name: "Delhi International Airport",
          city: "DEL",
          cityName: "Delhi",
          country: "IN",
          countryName: "India",
        },
        arrivalAirport: {
          type: "AIRPORT",
          code: "HYD",
          name: "Hyderabad Rajiv Gandhi International Airport",
          city: "HYD",
          cityName: "Hyderabad",
          country: "IN",
          countryName: "India",
        },
        departureTime: "2025-06-19T20:15:00Z",
        arrivalTime: "2025-06-19T22:30:00Z",
        totalTime: 8100,
        legs: [
          {
            departureTime: "2025-06-19T20:15:00Z",
            arrivalTime: "2025-06-19T22:30:00Z",
            departureAirport: {
              type: "AIRPORT",
              code: "DEL",
              name: "Delhi International Airport",
              city: "DEL",
              cityName: "Delhi",
              country: "IN",
              countryName: "India",
            },
            arrivalAirport: {
              type: "AIRPORT",
              code: "HYD",
              name: "Hyderabad Rajiv Gandhi International Airport",
              city: "HYD",
              cityName: "Hyderabad",
              country: "IN",
              countryName: "India",
            },
            cabinClass: "ECONOMY",
            flightInfo: {
              flightNumber: 382,
              planeType: "320",
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
            totalTime: 8100,
            departureTerminal: "1",
            arrivalTerminal: "2",
          },
        ],
        travellerCheckedLuggage: [
          {
            travellerReference: "1",
            luggageAllowance: {
              luggageType: "CHECKED_IN",
              ruleType: "WEIGHT_BASED",
              maxTotalWeight: 33.1,
              massUnit: "LB",
              maxPiece: 1,
            },
          },
        ],
        travellerCabinLuggage: [
          {
            travellerReference: "1",
            luggageAllowance: {
              luggageType: "HAND",
              maxPiece: 1,
              maxWeightPerPiece: 15.4,
              massUnit: "LB",
              sizeRestrictions: {
                maxLength: 21.7,
                maxWidth: 15.8,
                maxHeight: 7.9,
                sizeUnit: "INCH",
              },
            },
          },
        ],
      },
      {
        departureAirport: {
          type: "AIRPORT",
          code: "HYD",
          name: "Hyderabad Rajiv Gandhi International Airport",
          city: "HYD",
          cityName: "Hyderabad",
          country: "IN",
          countryName: "India",
        },
        arrivalAirport: {
          type: "AIRPORT",
          code: "BOM",
          name: "Chhatrapati Shivaji Maharaj International Airport",
          city: "BOM",
          cityName: "Mumbai",
          country: "IN",
          countryName: "India",
        },
        departureTime: "2025-06-20T00:40:00Z",
        arrivalTime: "2025-06-20T01:15:00Z",
        totalTime: 2100,
        legs: [
          {
            departureTime: "2025-06-20T00:40:00Z",
            arrivalTime: "2025-06-20T01:15:00Z",
            departureAirport: {
              type: "AIRPORT",
              code: "HYD",
              name: "Hyderabad Rajiv Gandhi International Airport",
              city: "HYD",
              cityName: "Hyderabad",
              country: "IN",
              countryName: "India",
            },
            arrivalAirport: {
              type: "AIRPORT",
              code: "BOM",
              name: "Chhatrapati Shivaji Maharaj International Airport",
              city: "BOM",
              cityName: "Mumbai",
              country: "IN",
              countryName: "India",
            },
            cabinClass: "ECONOMY",
            flightInfo: {
              flightNumber: 5195,
              planeType: "320",
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
            totalTime: 2100,
            departureTerminal: "1",
            arrivalTerminal: "1",
          },
        ],
      },
    ],
    priceBreakdown: {
      total: {
        currencyCode: "INR",
        units: 5849,
        nanos: 0,
      },
      baseFare: {
        currencyCode: "INR",
        units: 4500,
        nanos: 0,
      },
      tax: {
        currencyCode: "INR",
        units: 1349,
        nanos: 0,
      },
      fee: {
        currencyCode: "INR",
        units: 0,
        nanos: 0,
      },
      totalRounded: {
        currencyCode: "INR",
        units: 5849,
        nanos: 0,
      },
      discount: {
        currencyCode: "INR",
        units: 276,
        nanos: 0,
      },
      showPriceStrikethrough: false,
      carrierTaxBreakdown: [
        {
          carrier: {
            name: "IndiGo",
            code: "6E",
            logo: "https://r-xx.bstatic.com/data/airlines_logo/6E.png",
          },
          avgPerAdult: {
            currencyCode: "INR",
            units: 1349,
            nanos: 0,
          },
        },
      ],
    },
    travellerPrices: [
      {
        travellerPriceBreakdown: {
          total: {
            currencyCode: "INR",
            units: 5849,
            nanos: 0,
          },
          baseFare: {
            currencyCode: "INR",
            units: 4500,
            nanos: 0,
          },
          tax: {
            currencyCode: "INR",
            units: 1349,
            nanos: 0,
          },
          fee: {
            currencyCode: "INR",
            units: 0,
            nanos: 0,
          },
          totalRounded: {
            currencyCode: "INR",
            units: 5849,
            nanos: 0,
          },
          discount: {
            currencyCode: "INR",
            units: 276,
            nanos: 0,
          },
          showPriceStrikethrough: false,
        },
        travellerReference: "1",
        travellerType: "ADULT",
      },
    ],
    tripType: "ONEWAY",
    brandedFareInfo: {
      fareName: "ECO VALUE",
      cabinClass: "ECONOMY",
      features: [
        {
          featureName: "PERSONAL_BAGGAGE",
          category: "BAGGAGE",
          label: "1 personal item",
          availability: "INCLUDED",
          icon: "PERSONAL_LUGGAGE_ICON",
        },
        {
          featureName: "CABIN_BAGGAGE",
          category: "BAGGAGE",
          label: "1 carry-on bag (15.4 lb)",
          availability: "INCLUDED",
          icon: "CABIN_LUGGAGE_ICON",
        },
        {
          featureName: "CHECK_BAGGAGE",
          category: "BAGGAGE",
          label: "1 checked bag (33.1 lb)",
          availability: "INCLUDED",
          icon: "CHECKED_IN_LUGGAGE_ICON",
        },
      ],
    },
    fareRules: [
      {
        segmentIdentifiers: [
          {
            segmentIndex: 0,
            legIndex: 0,
          },
        ],
        availablePolicies: [
          {
            type: "CHANGE_BEFORE",
            priceBreakdown: {
              total: {
                currencyCode: "INR",
                units: 35,
                nanos: 0,
              },
            },
          },
          {
            type: "CANCEL_BEFORE",
            priceBreakdown: {
              total: {
                currencyCode: "INR",
                units: 46,
                nanos: 0,
              },
            },
          },
        ],
      },
    ],
    seatAvailability: {
      numberOfSeatsAvailable: 5,
    },
    includedProducts: {
      areAllSegmentsIdentical: true,
      segments: [
        [
          {
            luggageType: "PERSONAL_ITEM",
            maxPiece: 1,
            piecePerPax: 1,
          },
          {
            luggageType: "HAND",
            maxPiece: 1,
            maxWeightPerPiece: 15.4,
            massUnit: "LB",
            piecePerPax: 1,
          },
          {
            luggageType: "CHECKED_IN",
            ruleType: "WEIGHT_BASED",
            maxTotalWeight: 33.1,
            massUnit: "LB",
            maxPiece: 1,
            piecePerPax: 1,
          },
        ],
      ],
    },
  };
  const flightsearchresults = writable({
    flightOffers: [dummyOffer],
    flightDeals: [],
    aggregation: {},
    searchId: "dummy",
    tripType: "ONEWAY",
    searchCriteria: { cabinClass: "ECONOMY" },
  });
  let offers = $flightsearchresults.flightOffers;
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
      <FlightResult offer />
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
