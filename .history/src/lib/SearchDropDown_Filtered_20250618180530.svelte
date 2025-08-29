<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { AirportSelected, Current_SearchFilter } from "./Store/store";
  import { get } from "svelte/store";

  type SearchItem = { label: string; value: string };

  let {
    items,
    Title,
    type = "",
    index = 0,
    icon = "",
  }: {
    items: SearchItem[];
    Title: string;
    type: string;
    index: number;
    icon?: string;
  } = $props();

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
    // const parts = selectedLabel.split(" to ");
    // const fromValue = parts[0];
    // const toValue = parts[1];
    const label = selectedLabel;
    Current_SearchFilter.update((prev) => {
      if (!prev || !prev.timings || typeof index !== "number") return prev;

      const updatedTimings = [...prev.timings];
      const entry = { ...updatedTimings[index] };

      if (type === "from") entry.from = label;
      else if (type === "to") entry.to = label;

      updatedTimings[index] = entry;

      return {
        ...prev,
        timings: updatedTimings,
      };
    });

    console.log("Formated -> ", $Current_SearchFilter);

    AirportSelected.update((arr) =>
      arr.includes(airport.label) ? arr : [...arr, airport.label]
    );
  }
</script>

<div class="dropsearch-container">
  <div class="dropsearch-container-input">
    <input
      type="text"
      placeholder={searchValue ? searchValue : Title}
      bind:value={searchValue}
      onfocus={() => (showDropdown = true)}
    />
    {#if icon}
      <span
        style="font-size: var(--font--lg);"
        class="material-symbols-outlined"
      >
        {icon}
      </span>
    {/if}
  </div>
  {#if showDropdown}
    <div class="dropsearch-list">
      {#each filtereditems as airport}
        <div
          class="dropsearch-item"
          role="button"
          tabindex="0"
          onmousedown={() => handleSelect(airport)}
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
  .dropsearch-container-input {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
  }
  .dropsearch-container-input span {
    position: absolute;
    right: 0;
    margin-right: 10px;
    color: var(--blue);
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
    outline: 3px solid var(--grey-light);
  }

  .dropsearch-item {
    padding: 8px;
    cursor: pointer;
  }

  .dropsearch-item:hover {
    background: var(--grey-light);
  }
</style>
