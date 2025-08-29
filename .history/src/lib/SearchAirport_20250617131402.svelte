<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  // Define the type for airport items
  type AirportItem = { label: string; value: string };

  // Props: list of airports
  let { airports }: { airports: AirportItem[] } = $props();

  // State: search input value and dropdown visibility
  let searchValue = $state("");
  let showDropdown = $state(false);

  // Derived: filtered airports based on search input
  let filteredAirports = $derived(
    airports.filter((airport) =>
      airport.label.toLowerCase().includes(searchValue.toLowerCase())
    )
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
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });
</script>

<div class="dropsearch-container">
  <input
    type="text"
    placeholder="Search airports..."
    bind:value={searchValue}
    on:focus={() => (showDropdown = true)}
  />
  {#if showDropdown && searchValue}
    <div class="dropsearch-list">
      {#each filteredAirports as airport}
        <div
          class="dropsearch-item"
          role="button"
          tabindex="0"
          on:mousedown={() => {
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
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  .dropsearch-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
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
    background: #f0f0f0;
  }
</style>
