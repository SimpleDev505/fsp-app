<script lang="ts">
  import { Current_SearchFilter } from "./Store/store";

  // Configuration
  const FILTER_CONFIG = {
    popularFilters: [
      { value: "1", label: "Non Stop", type: "checkbox" },
      { value: "Air India", label: "Air India", type: "checkbox" },
      { value: "SpiceJet", label: "Spice Jet", type: "checkbox" },
      { value: "2", label: "2+ Stops", type: "checkbox" },
    ],

    priceRange: {
      min: 9000,
      max: 50000,
      step: 100,
      type: "range",
      labels: ["9000", "50000"],
    },

    stops: [
      { value: "none", label: "Non Stop", type: "radio" },
      { value: "1", label: "1 Stops", type: "radio" },
      { value: "2", label: "2+ Stop", type: "radio" },
    ],

    departureTime: [
      { value: "Before 6Am", label: "Before 6 Am", type: "checkbox" },
      { value: "6Am to 12Pm", label: "6 AM To 12 PM", type: "checkbox" },
      { value: "12Pm to 6Pm", label: "12 PM To 6 PM", type: "checkbox" },
      { value: "After 6Pm", label: "After 6 PM", type: "checkbox" },
    ],

    duration: {
      min: 4,
      max: 30,
      step: 1,
      type: "range",
      labels: ["4hr", "30h+"],
    },

    airlines: [
      { value: "IndiGo", label: "IndiGo", type: "checkbox", active: true },
      {
        value: "Air India",
        label: "Air India",
        type: "checkbox",
        active: true,
      },
      { value: "SpiceJet", label: "Spice Jet", type: "checkbox", active: true },
      {
        value: "Thai Airways",
        label: "Thai Airways",
        type: "checkbox",
        active: false,
      },
      {
        value: "Etihad Airways",
        label: "Qatar Airways",
        type: "checkbox",
        active: false,
      },
      {
        value: "Air India Express",
        label: "Singapore Airlines",
        type: "checkbox",
        active: false,
      },
      {
        value: "Srilankan Airlines",
        label: "Air India Express",
        type: "checkbox",
        active: false,
      },
    ],
  };

  // Default values
  const DEFAULT_FILTERS = {
    popularfilters: "none",
    pricerange: 50000,
    stops: "none",
    departime: "Before 6Am",
    duration_hrs: 30,
    airlines: "Air India",
  };

  // State variables - using reactive state
  let currentFilters = $derived($Current_SearchFilter.extra || DEFAULT_FILTERS);

  // Debug function
  function debugLog(filterName: string, value: any) {
    console.log(`[ExtraFilter] ${filterName} changed:`, value);
    console.log(
      `[ExtraFilter] Current extra filters:`,
      $Current_SearchFilter.extra
    );
  }

  // Generic update function that only modifies the extra field
  function updateFilter(filterKey: string, value: any) {
    Current_SearchFilter.update((filter) => ({
      ...filter,
      extra: {
        ...filter.extra,
        [filterKey]: value,
      },
    }));
    debugLog(filterKey, value);
  }

  // Handler functions for different filter types
  function handlePopularFilter(value: string) {
    const newValue = currentFilters.popularfilters === value ? "none" : value;
    updateFilter("popularfilters", newValue);
  }

  function handlePriceRange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    updateFilter("pricerange", value);
  }

  function handleStops(value: string) {
    updateFilter("stops", value);
  }

  function handleDepartureTime(value: string) {
    const newValue = currentFilters.departime === value ? "Before 6Am" : value;
    updateFilter("departime", newValue);
  }

  function handleDuration(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    updateFilter("duration_hrs", value);
  }

  function handleAirlines(value: string) {
    const newValue = currentFilters.airlines === value ? "Air India" : value;
    updateFilter("airlines", newValue);
  }

  // Clear all filters
  function clearAllFilters() {
    Current_SearchFilter.update((filter) => ({
      ...filter,
      extra: DEFAULT_FILTERS,
    }));
    debugLog("Clear All Filters", "Reset to defaults");
  }
</script>

<div class="filter-container">
  <div class="filter-header">
    <h3>FILTER</h3>
    <button class="clear-all" onclick={clearAllFilters}>Clear All</button>
  </div>

  <!-- Popular Filters -->
  <div class="filter-section">
    <h4>Popular Filters</h4>
    <div class="filter-options">
      {#each FILTER_CONFIG.popularFilters as option}
        <label class="filter-option">
          <input
            type={option.type}
            checked={currentFilters.popularfilters === option.value}
            onchange={() => handlePopularFilter(option.value)}
          />
          <span>{option.label}</span>
        </label>
      {/each}
    </div>
  </div>

  <!-- Price Range -->
  <div class="filter-section">
    <h4>Price</h4>
    <div class="price-range">
      <div class="price-labels">
        {#each FILTER_CONFIG.priceRange.labels as label}
          <span>{label}</span>
        {/each}
      </div>
      <input
        type="range"
        min={FILTER_CONFIG.priceRange.min}
        max={FILTER_CONFIG.priceRange.max}
        step={FILTER_CONFIG.priceRange.step}
        value={currentFilters.pricerange}
        class="price-slider"
        oninput={handlePriceRange}
      />
      <div class="price-values">
        <span>{FILTER_CONFIG.priceRange.min}</span>
        <span>{FILTER_CONFIG.priceRange.max}</span>
      </div>
    </div>
  </div>

  <!-- Stops -->
  <div class="filter-section">
    <h4>Stops</h4>
    <div class="filter-options">
      {#each FILTER_CONFIG.stops as option}
        <label class="filter-option">
          <input
            type={option.type}
            name="stops"
            checked={currentFilters.stops === option.value}
            onchange={() => handleStops(option.value)}
          />
          <span>{option.label}</span>
        </label>
      {/each}
    </div>
  </div>

  <!-- Departure Time -->
  <div class="filter-section">
    <h4>Depart Time</h4>
    <div class="filter-options">
      {#each FILTER_CONFIG.departureTime as option}
        <label class="filter-option">
          <input
            type={option.type}
            checked={currentFilters.departime === option.value}
            onchange={() => handleDepartureTime(option.value)}
          />
          <span>{option.label}</span>
        </label>
      {/each}
    </div>
  </div>

  <!-- Duration -->
  <div class="filter-section">
    <h4>Duration</h4>
    <div class="duration-range">
      <div class="duration-labels">
        {#each FILTER_CONFIG.duration.labels as label}
          <span>{label}</span>
        {/each}
      </div>
      <input
        type="range"
        min={FILTER_CONFIG.duration.min}
        max={FILTER_CONFIG.duration.max}
        step={FILTER_CONFIG.duration.step}
        value={currentFilters.duration_hrs}
        class="duration-slider"
        oninput={handleDuration}
      />
    </div>
  </div>

  <!-- Airlines -->
  <div class="filter-section">
    <h4>Airlines</h4>
    <div class="filter-options">
      {#each FILTER_CONFIG.airlines as option}
        <label class="filter-option">
          {#if option.active}
            <input
              type={option.type}
              checked={currentFilters.airlines === option.value}
              onchange={() => handleAirlines(option.value)}
            />
          {/if}
          <span class:inactive={!option.active}>{option.label}</span>
        </label>
      {/each}
    </div>
  </div>

  <!-- Debug Section-->
  <div class="debug-section">
    <h4>Debug Info</h4>
    <pre>{JSON.stringify(currentFilters, null, 2)}</pre>
  </div>
</div>

<style>
  .filter-container {
    width: 280px;
    background: white;
    border: 1px solid #e0e6ed;
    border-radius: 8px;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-height: 90vh;
    overflow-y: auto;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e0e6ed;
    background: #f8f9fa;
  }

  .filter-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .clear-all {
    background: none;
    border: none;
    color: #1a73e8;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
  }

  .filter-section {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  .filter-section:last-child {
    border-bottom: none;
  }

  .filter-section h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    color: #666;
  }

  .filter-option input[type="checkbox"],
  .filter-option input[type="radio"] {
    margin: 0;
    cursor: pointer;
  }

  .filter-option input[type="checkbox"] {
    accent-color: #00bcd4;
  }

  .filter-option input[type="radio"] {
    accent-color: #00bcd4;
  }

  .filter-option span {
    cursor: pointer;
  }

  .filter-option span.inactive {
    color: #ccc;
    cursor: default;
  }

  .price-range,
  .duration-range {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .price-labels,
  .duration-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    background: #00bcd4;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
  }

  .price-slider,
  .duration-slider {
    width: 100%;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }

  .price-slider::-webkit-slider-thumb,
  .duration-slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #00bcd4;
    border-radius: 50%;
    cursor: pointer;
  }

  .price-values {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #999;
  }

  .debug-section {
    background: #f8f9fa;
    border-top: 2px solid #e0e0e0;
    font-size: 10px;
  }

  .debug-section pre {
    background: #fff;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    font-size: 9px;
    color: #666;
    overflow-x: auto;
    margin: 8px 0 0 0;
  }

  /* Scrollbar styling */
  .filter-container::-webkit-scrollbar {
    width: 6px;
  }

  .filter-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .filter-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  .filter-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
</style>
