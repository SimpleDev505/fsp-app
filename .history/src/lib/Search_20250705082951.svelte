<script lang="ts">
  import { get } from "svelte/store";
  import DateDropDown from "./DateDropDown.svelte";
  import Dropdownmenu from "./dropdownmenu.svelte";
  import PassengerPicker from "./PassengerPicker.svelte";
  import SearchDropDownFiltered from "./SearchDropDown_Filtered.svelte";
  import { gsap } from "gsap";
  onMount(() => {
    gsap.fromTo(
      ".search-box > * > *",
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "circ.inOut",
      }
    );
  });
  import {
    Current_SearchFilter,
    ExtraFiltered_Results,
    FlightSearchResults,
    Searched,
    type MenuItem,
    type SearchFilter,
  } from "./Store/store";
  import axios from "axios";
  import { onMount } from "svelte";
  import DataLoader from "./DataLoader.svelte";
  import type { StatusMessage } from "./Notifier.svelte";
  import Notifier from "./Notifier.svelte";

  let { flight_search_filter_1 = true }: { flight_search_filter_1?: Boolean } =
    $props();

  let SelectedTripType = $state("One Way");
  let SelectedCurrencyType = $state("INR");
  let SelectedClassType = $state("Economy");

  let AddedFlightTrips = $state(1);

  let SearchLoading = $state(false);
  let SearchError: StatusMessage = $state({ message: null, type: "ERROR" });

  const triptype_menu: MenuItem[] = [
    {
      label: "One Way",
      action: () => {
        SelectedTripType = "One Way";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          triptype: SelectedTripType,
        }));
      },
      split: false,
      icon: "trending_flat",
    },
    {
      label: "Round Trip",
      action: () => {
        SelectedTripType = "Round Trip";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          triptype: SelectedTripType,
        }));
      },
      split: false,
      icon: "sync_alt",
    },
    {
      label: "Multi City",
      action: () => {
        SelectedTripType = "Multi City";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          triptype: SelectedTripType,
        }));
      },
      split: false,
      icon: "multiple_stop",
    },
  ];
  const classtype_menu: MenuItem[] = [
    {
      label: "Economy",
      action: () => {
        SelectedClassType = "Economy";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          class: SelectedClassType,
        }));
      },
      split: false,
    },
    {
      label: "Premium Economy",
      action: () => {
        SelectedClassType = "Premium Economy";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          class: SelectedClassType,
        }));
      },
      split: false,
    },
    {
      label: "First Class",
      action: () => {
        SelectedClassType = "First Class";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          class: SelectedClassType,
        }));
      },
      split: false,
    },
    {
      label: "Business",
      action: () => {
        SelectedClassType = "Business";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          class: SelectedClassType,
        }));
      },
      split: false,
    },
  ];
  const currencytype_menu: MenuItem[] = [
    {
      label: "INR",
      action: () => {
        SelectedCurrencyType = "INR";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          currency: SelectedCurrencyType,
        }));
      },
      split: false,
      icon: "currency_rupee",
    },
    {
      label: "USD",
      action: () => {
        SelectedCurrencyType = "USD";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          currency: SelectedCurrencyType,
        }));
      },
      split: false,
      icon: "attach_money",
    },
    {
      label: "EUR",
      action: () => {
        SelectedCurrencyType = "EUR";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          currency: SelectedCurrencyType,
        }));
      },
      split: false,
      icon: "euro_symbol",
    },
    {
      label: "GBP",
      action: () => {
        SelectedCurrencyType = "GBP";
        Current_SearchFilter.update((prev) => ({
          ...prev,
          currency: SelectedCurrencyType,
        }));
      },
      split: false,
      icon: "currency_pound",
    },
  ];
  //Airports
  const airports = [
    { label: "Chennai, India", value: "MAA" },
    { label: "Puducherry, India", value: "PNY" },
    { label: "Kochi, India", value: "COK" },
    { label: "Guwahati, India", value: "GAU" },
    { label: "Shillong, India", value: "SHL" },
    { label: "Delhi, India", value: "DEL" },
    { label: "Mumbai, India", value: "BOM" },
    { label: "Bengaluru, India", value: "BLR" },
    { label: "Hyderabad, India", value: "HYD" },
    { label: "Kolkata, India", value: "CCU" },
    { label: "Ahmedabad, India", value: "AMD" },
    { label: "Pune, India", value: "PNQ" },
    { label: "Jaipur, India", value: "JAI" },
    { label: "Lucknow, India", value: "LKO" },
    { label: "Goa, India", value: "GOI" },
    { label: "Westray", value: "WRY" },
    { label: "Papa Westray", value: "PPW" },
  ];
  const AMADEUS_CLIENT_SECRET = import.meta.env.VITE_CLIENTSEC;
  const AMADEUS_CLIENT_ID = import.meta.env.VITE_CLIENTID;
  // async function fetchFlights() {
  //   try {
  //     const filter = get(Current_SearchFilter);
  //     const timings = filter.timings;
  //     timings.sort((a, b) => {
  //       const getDate = (d: string) => {
  //         const [day, mon, year] = d.split("'");
  //         const months = {
  //           Jan: "01",
  //           Feb: "02",
  //           Mar: "03",
  //           Apr: "04",
  //           May: "05",
  //           Jun: "06",
  //           Jul: "07",
  //           Aug: "08",
  //           Sep: "09",
  //           Oct: "10",
  //           Nov: "11",
  //           Dec: "12",
  //         };
  //         return new Date(
  //           `20${year}-${months[mon as keyof typeof months]}-${day}`
  //         );
  //       };
  //       return getDate(a.dep).getTime() - getDate(b.dep).getTime();
  //     });
  //     const triptype = filter.triptype;

  //     // City to IATA map
  //     const iataMap: Record<string, string> = {
  //       "Chennai, India": "MAA",
  //       "Delhi, India": "DEL",
  //       "Mumbai, India": "BOM",
  //       "Hyderabad, India": "HYD",
  //       "Madrid, Spain": "MAD",
  //       "New York, USA": "NYC",
  //       "Bangalore, India": "BLR",
  //       "Kolkata, India": "CCU",
  //     };

  //     // Convert date like "23'Jun'25" to "2025-06-23"
  //     const months = {
  //       Jan: "01",
  //       Feb: "02",
  //       Mar: "03",
  //       Apr: "04",
  //       May: "05",
  //       Jun: "06",
  //       Jul: "07",
  //       Aug: "08",
  //       Sep: "09",
  //       Oct: "10",
  //       Nov: "11",
  //       Dec: "12",
  //     };

  //     function toISO(dateStr: string): string {
  //       const [day, mon, year] = dateStr.split("'");
  //       return `20${year}-${months[mon as keyof typeof months]}-${day.padStart(2, "0")}`;
  //     }

  //     // Build originDestinations array
  //     const originDestinations = timings.map((t, index) => ({
  //       id: `${index + 1}`,
  //       originLocationCode: iataMap[t.from] || "MAD",
  //       destinationLocationCode: iataMap[t.to] || "NYC",
  //       departureDateTimeRange: {
  //         date: toISO(t.dep),
  //         time: "00:00:00",
  //       },
  //     }));

  //     // Build travelers
  //     const travelers = [];
  //     for (let i = 0; i < filter.passengers.adult; i++)
  //       travelers.push({
  //         id: `${travelers.length + 1}`,
  //         travelerType: "ADULT",
  //       });
  //     for (let i = 0; i < filter.passengers.child; i++)
  //       travelers.push({
  //         id: `${travelers.length + 1}`,
  //         travelerType: "CHILD",
  //       });
  //     for (let i = 0; i < filter.passengers.infant; i++)
  //       travelers.push({
  //         id: `${travelers.length + 1}`,
  //         travelerType: "HELD_INFANT",
  //       });

  //     // Get access token
  //     const tokenRes = await axios.post(
  //       "https://test.api.amadeus.com/v1/security/oauth2/token",
  //       new URLSearchParams({
  //         grant_type: "client_credentials",
  //         client_id: AMADEUS_CLIENT_ID,
  //         client_secret: AMADEUS_CLIENT_SECRET,
  //       }),
  //       { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  //     );

  //     const token = tokenRes.data.access_token;

  //     // Prepare request body
  //     const requestBody: any = {
  //       currencyCode: filter.currency || "USD",
  //       originDestinations,
  //       travelers,
  //       sources: ["GDS"],
  //       searchCriteria: {
  //         maxFlightOffers: 10,
  //         flightFilters: {
  //           cabinRestrictions: originDestinations.map((od) => ({
  //             cabin: filter.class.toUpperCase(),
  //             coverage: "MOST_SEGMENTS",
  //             originDestinationIds: [od.id],
  //           })),
  //         },
  //       },
  //     };

  //     // Optionally filter by price
  //     if (filter.extra?.pricerange) {
  //       requestBody.searchCriteria.flightFilters.maxPrice =
  //         filter.extra.pricerange;
  //     }
  //     SearchLoading = true;
  //     // Request flight offers
  //     const offerRes = await axios.post(
  //       "https://test.api.amadeus.com/v2/shopping/flight-offers",
  //       requestBody,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (offerRes) {
  //       SearchError = {
  //         message: "Flights Available!",
  //         type: "SUCCESS",
  //       };
  //       setTimeout(() => {
  //         SearchLoading = false;
  //         SearchError = {
  //           message: null,
  //           type: "ERROR",
  //         };
  //         FlightSearchResults.set({
  //           data: offerRes.data.data,
  //           dictionaries: offerRes.data.dictionaries,
  //         });
  //         ExtraFiltered_Results.set({
  //           data: offerRes.data.data,
  //           dictionaries: offerRes.data.dictionaries,
  //         });
  //         // FlightSearchResults.set(offerRes.data.data || []);
  //         console.log("Flight offers:", $FlightSearchResults);
  //         Searched.set(true);
  //         return;
  //       }, 3000);
  //     } else {
  //       SearchError = {
  //         message: "Flights Not Available!",
  //         type: "ERROR",
  //       };
  //       setTimeout(() => {
  //         SearchLoading = false;
  //         SearchError = {
  //           message: null,
  //           type: "ERROR",
  //         };
  //         return;
  //       }, 3000);
  //     }
  //   } catch (err: any) {
  //     SearchError = {
  //       message: "Error Finding Flights!",
  //       type: "ERROR",
  //     };
  //     setTimeout(() => {
  //       SearchLoading = false;
  //       SearchError = {
  //         message: null,
  //         type: "ERROR",
  //       };
  //       FlightSearchResults.set(null);
  //     }, 3000);
  //     console.error("Fetch failed:", err.response?.data || err.message);
  //   }
  // }
  async function fetchFlights() {
    try {
      const filter = get(Current_SearchFilter);
      const timings = filter.timings;
      timings.sort((a, b) => {
        const getDate = (d: string) => {
          const [day, mon, year] = d.split("'");
          const months = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12",
          };
          return new Date(
            `20${year}-${months[mon as keyof typeof months]}-${day}`
          );
        };
        return getDate(a.dep).getTime() - getDate(b.dep).getTime();
      });
      const triptype = filter.triptype;

      // City to IATA map
      const iataMap: Record<string, string> = {
        "Chennai, India": "MAA",
        "Delhi, India": "DEL",
        "Mumbai, India": "BOM",
        "Hyderabad, India": "HYD",
        "Madrid, Spain": "MAD",
        "New York, USA": "NYC",
        "Bangalore, India": "BLR",
        "Kolkata, India": "CCU",
      };

      // Convert date like "23'Jun'25" to "2025-06-23"
      const months = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };

      function toISO(dateStr: string): string {
        const [day, mon, year] = dateStr.split("'");
        return `20${year}-${months[mon as keyof typeof months]}-${day.padStart(2, "0")}`;
      }

      // Build originDestinations array
      const originDestinations = timings.map((t, index) => ({
        id: `${index + 1}`,
        originLocationCode: iataMap[t.from] || "MAD",
        destinationLocationCode: iataMap[t.to] || "NYC",
        departureDateTimeRange: {
          date: toISO(t.dep),
          time: "00:00:00",
        },
      }));

      // Build travelers
      const travelers = [];
      for (let i = 0; i < filter.passengers.adult; i++)
        travelers.push({
          id: `${travelers.length + 1}`,
          travelerType: "ADULT",
        });
      for (let i = 0; i < filter.passengers.child; i++)
        travelers.push({
          id: `${travelers.length + 1}`,
          travelerType: "CHILD",
        });
      for (let i = 0; i < filter.passengers.infant; i++)
        travelers.push({
          id: `${travelers.length + 1}`,
          travelerType: "HELD_INFANT",
        });

      // Check if API is enabled or use JSON data for testing
      const enable_api = false; // Set to true to use API, false to use JSON data

      if (!enable_api) {
        // Use saved JSON response for testing
        const savedResponse = await axios.get("/flightoffers.json"); // Adjust path as needed

        SearchError = {
          message: "Flights Available! (Using saved data)",
          type: "SUCCESS",
        };
        setTimeout(() => {
          SearchLoading = false;
          SearchError = {
            message: null,
            type: "ERROR",
          };
          FlightSearchResults.set({
            data: savedResponse.data || savedResponse.data,
            dictionaries:
              savedResponse.data.dictionaries ||
              savedResponse.data.dictionaries,
          });
          ExtraFiltered_Results.set({
            data: savedResponse.data || savedResponse.data,
            dictionaries:
              savedResponse.data.dictionaries ||
              savedResponse.data.dictionaries,
          });
          console.log("Flight offers (from JSON):", $FlightSearchResults);
          Searched.set(true);
          return;
        }, 1000);
        return;
      }

      // Get access token
      const tokenRes = await axios.post(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: AMADEUS_CLIENT_ID,
          client_secret: AMADEUS_CLIENT_SECRET,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const token = tokenRes.data.access_token;

      // Prepare request body
      const requestBody: any = {
        currencyCode: filter.currency || "USD",
        originDestinations,
        travelers,
        sources: ["GDS"],
        searchCriteria: {
          maxFlightOffers: 10,
          flightFilters: {
            cabinRestrictions: originDestinations.map((od) => ({
              cabin: filter.class.toUpperCase(),
              coverage: "MOST_SEGMENTS",
              originDestinationIds: [od.id],
            })),
          },
        },
      };

      // Optionally filter by price
      if (filter.extra?.pricerange) {
        requestBody.searchCriteria.flightFilters.maxPrice =
          filter.extra.pricerange;
      }
      SearchLoading = true;
      // Request flight offers
      const offerRes = await axios.post(
        "https://test.api.amadeus.com/v2/shopping/flight-offers",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (offerRes) {
        SearchError = {
          message: "Flights Available!",
          type: "SUCCESS",
        };
        setTimeout(() => {
          SearchLoading = false;
          SearchError = {
            message: null,
            type: "ERROR",
          };
          FlightSearchResults.set({
            data: offerRes.data.data,
            dictionaries: offerRes.data.dictionaries,
          });
          ExtraFiltered_Results.set({
            data: offerRes.data.data,
            dictionaries: offerRes.data.dictionaries,
          });
          // FlightSearchResults.set(offerRes.data.data || []);
          console.log("Flight offers:", $FlightSearchResults);
          Searched.set(true);
          return;
        }, 3000);
      } else {
        SearchError = {
          message: "Flights Not Available!",
          type: "ERROR",
        };
        setTimeout(() => {
          SearchLoading = false;
          SearchError = {
            message: null,
            type: "ERROR",
          };
          return;
        }, 3000);
      }
    } catch (err: any) {
      SearchError = {
        message: "Error Finding Flights!",
        type: "ERROR",
      };
      setTimeout(() => {
        SearchLoading = false;
        SearchError = {
          message: null,
          type: "ERROR",
        };
        FlightSearchResults.set(null);
      }, 3000);
      console.error("Fetch failed:", err.response?.data || err.message);
    }
  }
</script>

<div class="search-cnt">
  <div class="search-box">
    {#if !SearchLoading && SearchError.message === null}
      {#if flight_search_filter_1}
        <div class="filters-1">
          <Dropdownmenu leftpx={0} rightpx={0} items={triptype_menu}
          ></Dropdownmenu>
          <Dropdownmenu leftpx={0} rightpx={0} items={classtype_menu}
          ></Dropdownmenu>
          <Dropdownmenu leftpx={0} rightpx={0} items={currencytype_menu}
          ></Dropdownmenu>
          <PassengerPicker></PassengerPicker>
        </div>
      {:else}
        <p
          style="background-color: var(--blue-dark); width: 100%;
 padding: 10px; color: white; border-radius: 3px; text-align: center;"
        >
          Search {#if $FlightSearchResults?.data && $FlightSearchResults?.data.length > 0}
            {$FlightSearchResults?.data.length - 1}
          {/if}
        </p>
      {/if}

      <div class="filters-2">
        {#if SelectedTripType === "One Way"}
          <SearchDropDownFiltered
            icon="flight_takeoff"
            type="from"
            index={0}
            Title="From"
            items={airports}
          ></SearchDropDownFiltered>
          <SearchDropDownFiltered
            icon="flight_land"
            type="to"
            index={0}
            Title="To"
            items={airports}
          ></SearchDropDownFiltered>
          <DateDropDown icon="calendar_month" pickupenddate={false}
          ></DateDropDown>
        {:else if SelectedTripType === "Multi City"}
          <div class="search-multi">
            {#each Array(Math.max(1, AddedFlightTrips)) as _, index}
              <div class="search-multi-cnt">
                <SearchDropDownFiltered
                  icon="flight_takeoff"
                  type="from"
                  {index}
                  Title="From"
                  items={airports}
                ></SearchDropDownFiltered>
                <SearchDropDownFiltered
                  icon="flight_land"
                  type="to"
                  {index}
                  Title="To"
                  items={airports}
                ></SearchDropDownFiltered>
                <DateDropDown icon="calendar_month" pickupenddate={true}
                ></DateDropDown>
                {#if index === AddedFlightTrips - 1 && AddedFlightTrips < 5}
                  <button
                    style="font-size: var(--font-s); white-space: nowrap; background-color: var(--blue);
            color: white; padding: 10px; border-radius: 8px; border: none;
            box-shadow: none; cursor: pointer;"
                    onmousedown={() => {
                      if (AddedFlightTrips < 5) {
                        AddedFlightTrips += 1;
                      }
                    }}
                  >
                    Add Route
                  </button>
                {:else if AddedFlightTrips > 1}
                  <button
                    style="font-size: var(--font-s); white-space: nowrap; background-color: var(--blue);
                color: white; padding: 10px; border-radius: 8px; border: none;
                box-shadow: none; cursor: pointer;"
                    onmousedown={() => (AddedFlightTrips -= 1)}
                  >
                    Remove Route
                  </button>
                {/if}
              </div>
            {/each}
          </div>
        {:else if SelectedTripType === "Round Trip"}
          <SearchDropDownFiltered
            icon="flight_takeoff"
            type="from"
            index={0}
            Title="From"
            items={airports}
          ></SearchDropDownFiltered>
          <SearchDropDownFiltered
            icon="flight_land"
            type="to"
            index={0}
            Title="To"
            items={airports}
          ></SearchDropDownFiltered>
          <DateDropDown icon="calendar_month" pickupenddate={true}
          ></DateDropDown>
        {/if}
      </div>
      <div class="search-btn-cnt">
        <button
          class="search-btn"
          onclick={() => {
            console.log($Current_SearchFilter);
            fetchFlights();
          }}
        >
          <span
            style="color: var(--grey-light);
            font-size: var(--font-lg);"
            class="material-symbols-outlined"
          >
            search
          </span>
          Search
        </button>
      </div>
    {:else if SearchLoading && SearchError.message === null}
      <DataLoader duration={5500} infinite />
    {:else if SearchLoading && SearchError.message}
      <h1>Searched Flights</h1>
      <Notifier P_error={SearchError.message} Type={SearchError.type}
      ></Notifier>
    {/if}
  </div>
</div>

<style>
  .search-cnt {
    width: fit-content;
    height: fit-content;
    position: relative;
    /* position: absolute;
    bottom: 0;
    margin-left: auto;
    margin-right: auto; */
    /* z-index: 1000; */
    /* display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; */
  }
  .search-box {
    display: flex;
    flex-direction: column;
    padding: 15px;
    width: 45em;
    min-height: 10em;
    max-height: fit-content;
    row-gap: 15px;
    background-color: white;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    outline: 3px solid var(--grey-light);
  }
  .search-btn-cnt {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
  }
  .search-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    column-gap: 5px;
    align-items: center;
    position: absolute;
    font-size: var(--font-s);
    white-space: nowrap;
    background-color: var(--blue);
    color: white;
    padding: 8px;
    border-radius: 8px;
    border: none;
    box-shadow: none;
    cursor: pointer;
    width: fit-content;
    height: fit-content;
    margin-top: 25px;
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    transition: 0.2s ease-in-out;
    outline: 2px solid var(--grey-light);
  }
  .search-btn:hover {
    background-color: var(--blue-dark);
  }
  .filters-1 {
    position: relative;
    display: flex;
    flex-direction: row;
    row-gap: 15px;
    justify-content: flex-start;
    align-items: baseline;
    width: 100%;
    height: fit-content;
    column-gap: 30px;
  }
  .filters-2 {
    position: relative;
    display: flex;
    flex-direction: row;
    row-gap: 15px;
    justify-content: flex-start;
    align-items: baseline;
    width: 100%;
    height: fit-content;
    column-gap: 30px;
  }
  /* Multi City */
  .search-multi {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    justify-content: flex-start;
    align-items: baseline;
    width: 100%;
    height: fit-content;
  }
  .search-multi-cnt {
    display: flex;
    flex-direction: row;
    row-gap: 15px;
    justify-content: flex-start;
    align-items: baseline;
    width: 100%;
    height: fit-content;
    column-gap: 30px;
  }
</style>
