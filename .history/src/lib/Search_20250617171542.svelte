<script lang="ts">
  import DateDropDown from "./DateDropDown.svelte";
  import Dropdownmenu from "./dropdownmenu.svelte";
  import PassengerPicker from "./PassengerPicker.svelte";
  import SearchDropDown from "./SearchDropDown.svelte";
  import SearchAirport from "./SearchDropDown.svelte";
  import type { MenuItem } from "./Store/store";

  let SelectedTripType = $state("One Way");
  let SelectedCurrencyType = $state("INR");
  let SelectedClassType = $state("Economy");

  let AddedFlightTrips = $state(1);

  let triptype_menu: MenuItem[] = [
    {
      label: "One Way",
      action: () => {
        SelectedTripType = "One Way";
      },
      split: false,
    },
    {
      label: "Round Trip",
      action: () => {
        SelectedTripType = "Round Trip";
      },
      split: false,
    },
    {
      label: "Multi City",
      action: () => {
        SelectedTripType = "Multi City";
      },
      split: false,
    },
  ];
  let classtype_menu: MenuItem[] = [
    {
      label: "Economy",
      action: () => {
        SelectedClassType = "Economy";
      },
      split: false,
    },
    {
      label: "Premium Economy",
      action: () => {
        SelectedClassType = "Premium Economy";
      },
      split: false,
    },
    {
      label: "First Class",
      action: () => {
        SelectedClassType = "First Class";
      },
      split: false,
    },
    {
      label: "Business",
      action: () => {
        SelectedClassType = "Business";
      },
      split: false,
    },
  ];
  let currencytype_menu: MenuItem[] = [
    {
      label: "INR",
      action: () => {
        SelectedCurrencyType = "INR";
      },
      split: false,
    },
    {
      label: "USD",
      action: () => {
        SelectedCurrencyType = "USD";
      },
      split: false,
    },
    {
      label: "EUR",
      action: () => {
        SelectedCurrencyType = "EUR";
      },
      split: false,
    },
    {
      label: "GBP",
      action: () => {
        SelectedCurrencyType = "GBP";
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
        <SearchDropDown Title="From" items={airports}></SearchDropDown>
        <SearchDropDown Title="To" items={airports}></SearchDropDown>
        <DateDropDown></DateDropDown>
      {:else if SelectedTripType === "Multi City"}
        <div class="search-multi">
          <div class="search-multi-cnt">
            <SearchDropDown Title="From" items={airports}></SearchDropDown>
            <SearchDropDown Title="To" items={airports}></SearchDropDown>
            <DateDropDown></DateDropDown>
            {#if AddedFlightTrips === 1}
              <button
                style="font-size: var(--font-s); white-space: nowrap; background-color: var(--blue);
             color: white; padding: 10px;border-radius:8px;border:none; box-shadow: none;
             cursor: pointer;"
                onmousedown={() => {
                  AddedFlightTrips += 1;
                }}>Add Route</button
              >
            {/if}
          </div>
          {#each { length: AddedFlightTrips }, index}
            <div class="search-multi-cnt">
              <SearchDropDown Title="From" items={airports}></SearchDropDown>
              <SearchDropDown Title="To" items={airports}></SearchDropDown>
              <DateDropDown></DateDropDown>
              {console.log("Multi - ", AddedFlightTrips)}
              {console.log("Multi - index -", index)}
              {#if AddedFlightTrips === index}
                <button
                  style="font-size: var(--font-s); white-space: nowrap; background-color: var(--blue);
             color: white; padding: 10px;border-radius:8px;border:none; box-shadow: none;
             cursor: pointer;"
                  onmousedown={() => {
                    AddedFlightTrips += 1;
                  }}>Add Route</button
                >
              {:else}
                <button
                  style="font-size: var(--font-s); white-space: nowrap; background-color: var(--blue);
         color: white; padding: 10px;border-radius:8px;border:none; box-shadow: none;
         cursor: pointer;"
                  onmousedown={() => {
                    if (AddedFlightTrips > 1) {
                      AddedFlightTrips -= 1;
                    }
                  }}>Remove Route</button
                >
              {/if}
            </div>
          {/each}
        </div>
      {/if}
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
