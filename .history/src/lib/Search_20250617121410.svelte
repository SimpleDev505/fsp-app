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
</script>

<div class="search-cnt">
  <div class="filters">
    <Dropdownmenu leftpx={0} rightpx={0} items={triptype_menu}></Dropdownmenu>
    <Dropdownmenu leftpx={0} rightpx={0} items={triptype_menu}></Dropdownmenu>
    <Dropdownmenu leftpx={0} rightpx={0} items={triptype_menu}></Dropdownmenu>
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
</style>
