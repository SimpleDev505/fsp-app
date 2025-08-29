<script lang="ts">
  import Dropdownmenu from "./dropdownmenu.svelte";
  import type { MenuItem } from "./Store/store";

  let triptype_menu: MenuItem[] = [
    {
      label: "One Way",
      action: () => {},
      split: false,
    },
    {
      label: "Round Trip",
      action: () => {},
      split: false,
    },
    {
      label: "Multi City",
      action: () => {},
      split: false,
    },
  ];
  let classtype_menu: MenuItem[] = [
    {
      label: "Economy",
      action: () => {},
      split: false,
    },
    {
      label: "Premium Economy",
      action: () => {},
      split: false,
    },
    {
      label: "First Class",
      action: () => {},
      split: false,
    },
    {
      label: "Business",
      action: () => {},
      split: false,
    },
  ];
  let currencytype_menu: MenuItem[] = [
    {
      label: "INR",
      action: () => {},
      split: false,
    },
    {
      label: "USD",
      action: () => {},
      split: false,
    },
    {
      label: "EUR",
      action: () => {},
      split: false,
    },
    {
      label: "GBP",
      action: () => {},
      split: false,
    },
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
    </div>
    <div class="filters-2"><input type="number" /></div>
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
    padding: 15px;
    position: fixed;
    position: absolute;
    width: 40em;
    height: 10em;
    background-color: white;
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
</style>
