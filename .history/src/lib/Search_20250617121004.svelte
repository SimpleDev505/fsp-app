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
  <div></div>
  <Dropdownmenu leftpx={0} rightpx={0} items={triptype_menu}></Dropdownmenu>
</div>

<style>
  .search-cnt {
    grid-column: 1;
    grid-row: 1;
    width: 100%;
    height: fit-content;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1000;
  }
</style>
