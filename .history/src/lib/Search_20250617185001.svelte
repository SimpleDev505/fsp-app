<script lang="ts">
  import DateDropDown from "./DateDropDown.svelte";
  import Dropdownmenu from "./dropdownmenu.svelte";
  import PassengerPicker from "./PassengerPicker.svelte";
  import SearchDropDown from "./SearchDropDown.svelte";
  import SearchAirport from "./SearchDropDown.svelte";
  import SearchDropDownFiltered from "./SearchDropDown_Filtered.svelte";
  import { Current_SearchFilter, type MenuItem } from "./Store/store";

  let SelectedTripType = $state("One Way");
  let SelectedCurrencyType = $state("INR");
  let SelectedClassType = $state("Economy");

  let AddedFlightTrips = $state(1);

  let triptype_menu: MenuItem[] = [
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
    },
  ];
  let classtype_menu: MenuItem[] = [
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
  let currencytype_menu: MenuItem[] = [
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
    },
  ];
  //Airports
  let airports = [
    { label: "Chennai, India", value: "MAA" },
    { label: "Puducherry, India", value: "PNY" },
    { label: "Kochi, India", value: "COK" },
    { label: "Guwahati, India", value: "GAU" },
    { label: "Shillong, India", value: "SHL" },
  ];
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
          type="from"
          index={0}
          Title="From"
          items={airports}
        ></SearchDropDownFiltered>
        <SearchDropDownFiltered type="to" index={0} Title="To" items={airports}
        ></SearchDropDownFiltered>
        <DateDropDown pickupenddate={false}></DateDropDown>
      {:else if SelectedTripType === "Multi City"}
        <div class="search-multi">
          {#each Array(Math.max(1, AddedFlightTrips)) as _, index}
            <div class="search-multi-cnt">
              <SearchDropDownFiltered
                type="from"
                {index}
                Title="From"
                items={airports}
              />
              <SearchDropDownFiltered
                type="to"
                {index}
                Title="To"
                items={airports}
              />
              <DateDropDown pickupenddate={true} />
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
          type="from"
          index={0}
          Title="From"
          items={airports}
        ></SearchDropDownFiltered>
        <SearchDropDownFiltered type="to" index={0} Title="To" items={airports}
        ></SearchDropDownFiltered>
        <DateDropDown pickupenddate={true}></DateDropDown>
      {/if}
    </div>
    <div class="search-btn-cnt">
      <button class="search-btn">Search Flights</button>
    </div>
  </div>
</div>

<style>
  .search-cnt {
    grid-column: 1;
    grid-row: 2;
    width: 100%;
    height: fit-content;
    position: absolute;
    bottom: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .search-box {
    display: flex;
    flex-direction: column;
    padding: 15px;
    position: fixed;
    position: absolute;
    width: 45em;
    min-height: 10em;
    max-height: fit-content;
    row-gap: 15px;
    background-color: white;
    border-radius: 8px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
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
    position: relative;
    font-size: var(--font-s);
    white-space: nowrap;
    background-color: var(--blue);
    color: white;
    padding: 10px;
    border-radius: 8px;
    border: none;
    box-shadow: none;
    cursor: pointer;
    width: fit-content;
    height: fit-content;
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
