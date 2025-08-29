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
</script>

<div class="search-cnt">
  <div class="filters">
    <Dropdownmenu leftpx={0} rightpx={0} items={triptype_menu}></Dropdownmenu>
    <Dropdownmenu leftpx={200} rightpx={0} items={classtype_menu}
    ></Dropdownmenu>
    <Dropdownmenu leftpx={400} rightpx={0} items={triptype_menu}></Dropdownmenu>
    <input type="number" />
  </div>
</div>

<style>
  .search-cnt {
    grid-column: 1;
    grid-row: 2;
    width: 100%;
    height: 10em;
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
  .filters {
    position: relative;
    display: flex;
    flex-direction: row;
    row-gap: 15px;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
  }
</style>
