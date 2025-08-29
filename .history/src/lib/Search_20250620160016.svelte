<script lang="ts">
  import { get } from "svelte/store";
  import DateDropDown from "./DateDropDown.svelte";
  import Dropdownmenu from "./dropdownmenu.svelte";
  import PassengerPicker from "./PassengerPicker.svelte";
  import SearchDropDownFiltered from "./SearchDropDown_Filtered.svelte";
  import {
    Current_SearchFilter,
    FlightSearchResults,
    Searched,
    type MenuItem,
  } from "./Store/store";
  import axios from "axios";
  let SelectedTripType = $state("One Way");
  let SelectedCurrencyType = $state("INR");
  let SelectedClassType = $state("Economy");

  let AddedFlightTrips = $state(1);

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
  const airportToICAO: Record<string, string> = {
    MAA: "VOMM", // Chennai
    PNY: "VOPC", // Puducherry
    COK: "VOCI", // Kochi
    GAU: "VEGT", // Guwahati
    SHL: "VEBI", // Shillong
    DEL: "VIDP", // Delhi
    BOM: "VABB", // Mumbai
    BLR: "VOBL", // Bengaluru
    HYD: "VOHS", // Hyderabad
    CCU: "VECC", // Kolkata
    AMD: "VAAH", // Ahmedabad
    PNQ: "VAPO", // Pune
    JAI: "VIJP", // Jaipur
    LKO: "VILK", // Lucknow
    GOI: "VOGO", // Goa
    WRY: "EGEW", // Westray
    PPW: "EGEP", // Papa Westray
  };
  //Convert "24'Jun'25" to "2025-06-24"
  function parseCustomDate(dateStr: string): string {
    const cleaned = dateStr.replaceAll("'", "");
    const match = cleaned.match(/^(\d{1,2})([A-Za-z]+)(\d{2})$/);
    if (!match) throw new Error("Invalid date format");

    const [, day, monthStr, year] = match;
    const monthMap: Record<string, string> = {
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
    const month = monthMap[monthStr];
    if (!month) throw new Error("Invalid month in date");

    return `20${year}-${month}-${day.padStart(2, "0")}`;
  }

  const API_KEY = import.meta.env.VITE_CLIENTSEC;
  const API_HOST = import.meta.env.VITE_CLIENTID;
  const openSkyAPI = axios.create({
    baseURL: "https://opensky-network.org/api",
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });
  openSkyAPI.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${API_KEY}`;
    return config;
  });
  export TOKEN=$(curl -X POST "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET" | jq -r .access_token)
</script>

<div class="search-cnt">
  <div class="search-box">
    <div class="filters-1">
      <Dropdownmenu leftpx={0} rightpx={0} items={triptype_menu}></Dropdownmenu>
      <Dropdownmenu leftpx={0} rightpx={0} items={classtype_menu}
      ></Dropdownmenu>
      <Dropdownmenu leftpx={0} rightpx={0} items={currencytype_menu}
      ></Dropdownmenu>
      <PassengerPicker></PassengerPicker>
    </div>

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
        <DateDropDown icon="calendar_month" pickupenddate={true}></DateDropDown>
      {/if}
    </div>
    <div class="search-btn-cnt">
      <button
        class="search-btn"
        onclick={() => {
          console.log($Current_SearchFilter);
          FetchFlights();
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
