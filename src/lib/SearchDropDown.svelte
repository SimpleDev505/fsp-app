<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { AirportSelected } from "./Store/store";

  export type SearchItem = { label: string; value: string };

  let { items, Title }: { items: SearchItem[]; Title: string } = $props();

  let searchValue = $state("");
  let showDropdown = $state(false);
  //Search type Filter
  let filtereditems = $derived(
    searchValue
      ? items.filter((airport) =>
          airport.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      : items
  );
  // Handle clicks outside to close the dropdown
  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target) {
      if (!target.closest(".dropsearch-container")) {
        showDropdown = false;
      }
    }
  }

  onMount(() => {
    document.addEventListener("mousedown", handleOutsideClick);
  });
  onDestroy(() => {
    document.removeEventListener("mousedown", handleOutsideClick);
  });
</script>

<div class="dropsearch-container">
  <input
    type="text"
    placeholder={searchValue ? searchValue : Title}
    bind:value={searchValue}
    onfocus={() => (showDropdown = true)}
  />
  {#if showDropdown}
    <div class="dropsearch-list">
      {#each filtereditems as airport}
        <div
          class="dropsearch-item"
          role="button"
          tabindex="0"
          onmousedown={() => {
            searchValue = airport.label;
            showDropdown = false;
          }}
        >
          {airport.label} ({airport.value})
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropsearch-container {
    position: relative;
    width: 200px;
  }

  .dropsearch-container input {
    width: 100%;
    padding: 8px;
    border: 2px solid var(--grey-light);
    border-radius: 4px;
    font-size: var(--font-s);
  }

  .dropsearch-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid var(--grey-light);
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
  }

  .dropsearch-item {
    padding: 8px;
    cursor: pointer;
  }

  .dropsearch-item:hover {
    background: var(--grey-light);
  }
</style>
