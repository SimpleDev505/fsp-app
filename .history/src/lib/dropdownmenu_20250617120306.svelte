<script lang="ts">
  import { get } from "svelte/store";
  let DropDown = $state(false);
  import {
    Current_SearchFilter,
    dropdown_enabled,
    type MenuItem,
  } from "./Store/store";
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
    if (get(dropdown_enabled)) {
      $dropdown_enabled = false;
    }
  });
</script>

<div
  class="dropdown-menu"
  style="position: absolute; top: {rightpx}px;  left: {leftpx}px; background-color: transparent; color: black; border: 1px solid #3c3c3c; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); z-index: 1000;"
>
  <button
    style="padding: 8px 16px;width: 100%; background: transparent;border:none;box-shadow:none;"
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
    font-size: 14px;
  }

  .dropdown-item:hover {
    background-color: var(--grey-light);
  }
</style>
