<script lang="ts">
  import { onDestroy, onMount } from "svelte";
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
  let DropDownIcon = $state("");
  let DropDownTitle = $derived(items ? items[0].label : "Title");

  function HideDropDown() {
    if (DropDown) {
      DropDown = false;
    }
  }
  onMount(() => {
    document.addEventListener("mousedown", HideDropDown);
  });
  onDestroy(() => {
    document.removeEventListener("mousedown", HideDropDown);
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
    style="font-size: var(--font-s);padding: 8px 16px;width:100%; background: transparent;border:none;box-shadow:none;"
    onclick={() => (DropDown = true)}
    class="dropdowntitle"
    >{#if DropDownIcon}
      {DropDownTitle}
      <span
        style="font-size: var(--font--lg);"
        class="material-symbols-outlined"
      >
        {DropDownIcon}
      </span>
    {:else}
      {DropDownTitle}
    {/if}</button
  >
  {#if DropDown}
    <div
      style="position: absolute; top: 100%;width: fit-content; background: white; border: 2px solid var(--grey-light); border-radius: 4px; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"
    >
      {#each items as item}
        <div
          role="button"
          tabindex="0"
          class="dropdown-item"
          style={item.split == true ? "border-bottom: 2px solid black;" : ""}
          onmousedown={() => {
            item.action();
            DropDownTitle = item.label;
            DropDown = false;
            if (item.icon) {
              DropDownIcon = item.icon;
            } else {
              DropDownIcon = "";
            }
          }}
        >
          {#if item.icon}
            <span
              style="font-size: var(--font-sm);"
              class="material-symbols-outlined"
            >
              {item.icon}
            </span>
          {/if}
          {item.label}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropdowntitle {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    column-gap: 4px;
  }
  .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    font-size: var(--font-s);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .dropdown-item:hover {
    background-color: var(--grey-light);
  }
</style>
