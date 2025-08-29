<script lang="ts">
  let DropDown = $state(false);
  import { Current_SearchFilter, type MenuItem } from "./Store/store";
  let {
    items,
    leftpx,
    rightpx = 40,
  }: {
    items: MenuItem[];
    leftpx: number;
    rightpx: number;
  } = $props();
  let DropDownTitle = $derived(items ? items[0].label : "Title");
  document.addEventListener("mousedown", () => {
    if (DropDown) {
      DropDown = false;
    }
  });
  // document.addEventListener("mousedown", () => {
  //   if (get(dropdown_enabled)) {
  //     $dropdown_enabled = false;
  //   }
  // });
</script>

<div
  class="dropdown-menu"
  style="position: static; background-color: transparent; color: black; border: 2px solid var(--grey-light); border-radius: 4px;z-index: 1000;"
>
  <button
    style="font-size: var(--font-sm);padding: 8px 16px;width:100%; background: transparent;border:none;box-shadow:none;"
    onclick={() => (DropDown = !DropDown)}>{DropDownTitle}</button
  >
  {#if DropDown}
    {#each items as item}
      <div
        role="button"
        tabindex="999"
        class="dropdown-item"
        style={item.split == true ? "border-bottom: 2px solid black;" : ""}
        onmousedown={() => {
          item.action;
          DropDownTitle = item.label;
          DropDown = false;
        }}
      >
        {item.label}
      </div>
    {/each}
  {/if}
</div>

<style>
  .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    font-size: var(--font-sm);
  }

  .dropdown-item:hover {
    background-color: var(--grey-light);
  }
</style>
