<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { AirportSelected, Current_SearchFilter } from "./Store/store";
  import { get } from "svelte/store";

  type SearchItem = { label: string; value: string };

  let { items, Title }: { items: SearchItem[]; Title: string } = $props();

  let searchValue = $state("");
  let showDropdown = $state(false);
  let selectedLabel: string | null = $state(null);

  // 🔍 Filter items that are not already selected
  let filtereditems = $derived(
    searchValue
      ? items.filter(
          (airport) =>
            airport.label.toLowerCase().includes(searchValue.toLowerCase()) &&
            !get(AirportSelected).includes(airport.label)
        )
      : items.filter((airport) => !get(AirportSelected).includes(airport.label))
  );

  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && !target.closest(".dropsearch-container")) {
      showDropdown = false;
    }
  }

  onMount(() => {
    document.addEventListener("mousedown", handleOutsideClick);
  });

  onDestroy(() => {
    document.removeEventListener("mousedown", handleOutsideClick);
    AirportSelected.update((arr) =>
      arr.filter((label) => label !== selectedLabel)
    );
  });

  function handleSelect(airport: SearchItem) {
    searchValue = airport.label;
    showDropdown = false;
    selectedLabel = airport.label;

    //update searchfilter
    // Current_SearchFilter.update((current) => {
    //   if (!current) return current;

    //   return {
    //     ...current,
    //     timings: current.timings.map((timing, index) =>
    //       index === 0 ? { ...timing, from: "new value" } : timing
    //     ),
    //   };
    // });
    Current_SearchFilter.update((current) => {
      if (!current) return current;

      return {
        ...current,
        timings: current.timings.map((timing) => ({
          ...timing,
          from: selectedLabel ?? "none",
        })),
      };
    });

    AirportSelected.update((arr) =>
      arr.includes(airport.label) ? arr : [...arr, airport.label]
    );
  }
</script>

<div class="dropsearch-container">
  <input
    type="text"
    placeholder={searchValue ? searchValue : Title}
    bind:value={searchValue}
    on:focus={() => (showDropdown = true)}
  />
  {#if showDropdown}
    <div class="dropsearch-list">
      {#each filtereditems as airport}
        <div
          class="dropsearch-item"
          role="button"
          tabindex="0"
          on:mousedown={() => handleSelect(airport)}
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
