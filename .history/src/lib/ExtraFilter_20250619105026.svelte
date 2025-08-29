<script lang="ts">
  import { Current_SearchFilter } from "./Store/store";

  let popularfilters_temp:
    | "none"
    | "1"
    | "2"
    | "Air India"
    | "SpiceJet"
    | undefined = $state($Current_SearchFilter.extra?.popularfilters);
  let pricerange_temp = $state(0);
  let stops_temp: "none" | "1" | "2" | undefined = $state(
    $Current_SearchFilter.extra?.stops
  );
  let departime_temp:
    | "Before 6Am"
    | "6Am to 12Pm"
    | "12Pm to 6Pm"
    | "After 6Pm"
    | undefined = $state($Current_SearchFilter.extra?.departime);
  let duration_hrs_temp = $state(0);
  let airlines_temp:
    | "Air India"
    | "SpiceJet"
    | "Thai Airways"
    | "IndiGo"
    | "Etihad Airways"
    | "Air India Express"
    | "Srilankan Airlines"
    | "Malaysia Airlines"
    | undefined = $state($Current_SearchFilter.extra?.airlines);
  // Debug function
  function debugLog(filterName: string, value: any) {
    console.log(`🔍 [ExtraFilter] ${filterName} changed:`, value);
    console.log(
      `📊 [ExtraFilter] Current extra filters:`,
      $Current_SearchFilter.extra
    );
  }

  // Popular filters handler
  function handlePopularFilter(
    value: "none" | "1" | "2" | "Air India" | "SpiceJet"
  ) {
    popularfilters_temp = value;
    Current_SearchFilter.update((filter) => ({
      ...filter,
      extra: {
        airlines: airlines_temp,
        departime: departime_temp,
        duration_hrs: duration_hrs_temp,
        pricerange: pricerange_temp,
        stops: stops_temp,
        //Value
        popularfilters: value,
      },
    }));
    debugLog("Popular Filter", value);
  }

  // Price range handler
  function handlePriceRange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    Current_SearchFilter.update((filter) => ({
      ...filter,
      extra: {
        airlines: airlines_temp,
        departime: departime_temp,
        duration_hrs: duration_hrs_temp,
        pricerange: pricerange_temp,
        stops: stops_temp,
        //Value
        pricerange: value,
      },
    }));
    debugLog("Price Range", value);
  }

  // Stops handler
  function handleStops(value: "none" | "1" | "2") {
    Current_SearchFilter.update((filter) => ({
      ...filter,
      extra: {
        ...filter.extra,
        stops: value,
      },
    }));
    debugLog("Stops", value);
  }

  // Departure time handler
  function handleDepartureTime(
    value: "Before 6Am" | "6Am to 12Pm" | "12Pm to 6Pm" | "After 6Pm"
  ) {
    Current_SearchFilter.update((filter) => ({
      ...filter,
      extra: {
        ...filter.extra,
        departime: value,
      },
    }));
    debugLog("Departure Time", value);
  }

  // Duration handler
  function handleDuration(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    Current_SearchFilter.update((filter) => ({
      ...filter,
      extra: {
        ...filter.extra,
        duration_hrs: value,
      },
    }));
    debugLog("Duration", value);
  }

  // Airlines handler
  function handleAirlines(
    value:
      | "Air India"
      | "SpiceJet"
      | "Thai Airways"
      | "IndiGo"
      | "Etihad Airways"
      | "Air India Express"
      | "Srilankan Airlines"
      | "Malaysia Airlines"
  ) {
    Current_SearchFilter.update((filter) => ({
      ...filter,
      extra: {
        ...filter.extra,
        airlines: value,
      },
    }));
    debugLog("Airlines", value);
  }

  // Clear all filters
  function clearAllFilters() {
    Current_SearchFilter.update((filter) => ({
      ...filter,
      extra: {
        popularfilters: "none",
        pricerange: 50000,
        stops: "none",
        departime: "Before 6Am",
        duration_hrs: 30,
        airlines: "Air India",
      },
    }));
    debugLog("Clear All Filters", "Reset to defaults");
  }

  // Get current filter values
  $: currentFilters = $Current_SearchFilter.extra || {
    popularfilters: "none",
    pricerange: 50000,
    stops: "none",
    departime: "Before 6Am",
    duration_hrs: 30,
    airlines: "Air India",
  };
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
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.popularfilters === "1"}
          onchange={() =>
            handlePopularFilter(
              currentFilters.popularfilters === "1" ? "none" : "1"
            )}
        />
        <span>Non Stop</span>
      </label>
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.popularfilters === "Air India"}
          onchange={() =>
            handlePopularFilter(
              currentFilters.popularfilters === "Air India"
                ? "none"
                : "Air India"
            )}
        />
        <span>IndiGo</span>
      </label>
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.popularfilters === "SpiceJet"}
          onchange={() =>
            handlePopularFilter(
              currentFilters.popularfilters === "SpiceJet" ? "none" : "SpiceJet"
            )}
        />
        <span>Air India</span>
      </label>
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.popularfilters === "2"}
          onchange={() =>
            handlePopularFilter(
              currentFilters.popularfilters === "2" ? "none" : "2"
            )}
        />
        <span>Asaka Air</span>
      </label>
      <label class="filter-option">
        <span>Spice Jet</span>
      </label>
    </div>
  </div>

  <!-- Price Range -->
  <div class="filter-section">
    <h4>Price</h4>
    <div class="price-range">
      <div class="price-labels">
        <span>9000</span>
        <span>11000</span>
      </div>
      <input
        type="range"
        min="9000"
        max="50000"
        value={currentFilters.pricerange}
        class="price-slider"
        oninput={handlePriceRange}
      />
      <div class="price-values">
        <span>9000</span>
        <span>50000</span>
      </div>
    </div>
  </div>

  <!-- Stops -->
  <div class="filter-section">
    <h4>Stops</h4>
    <div class="filter-options">
      <label class="filter-option">
        <input
          type="radio"
          name="stops"
          checked={currentFilters.stops === "none"}
          onchange={() => handleStops("none")}
        />
        <span>Non Stop</span>
      </label>
      <label class="filter-option">
        <input
          type="radio"
          name="stops"
          checked={currentFilters.stops === "1"}
          onchange={() => handleStops("1")}
        />
        <span>1 Stops</span>
      </label>
      <label class="filter-option">
        <input
          type="radio"
          name="stops"
          checked={currentFilters.stops === "2"}
          onchange={() => handleStops("2")}
        />
        <span>2+ Stop</span>
      </label>
    </div>
  </div>

  <!-- Departure Time -->
  <div class="filter-section">
    <h4>Depart Time</h4>
    <div class="filter-options">
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.departime === "Before 6Am"}
          onchange={() =>
            handleDepartureTime(
              currentFilters.departime === "Before 6Am"
                ? "6Am to 12Pm"
                : "Before 6Am"
            )}
        />
        <span>Before 6 Am</span>
      </label>
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.departime === "6Am to 12Pm"}
          onchange={() =>
            handleDepartureTime(
              currentFilters.departime === "6Am to 12Pm"
                ? "12Pm to 6Pm"
                : "6Am to 12Pm"
            )}
        />
        <span>6 AM To 12 PM</span>
      </label>
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.departime === "12Pm to 6Pm"}
          onchange={() =>
            handleDepartureTime(
              currentFilters.departime === "12Pm to 6Pm"
                ? "After 6Pm"
                : "12Pm to 6Pm"
            )}
        />
        <span>12 PM To 6 PM</span>
      </label>
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.departime === "After 6Pm"}
          onchange={() =>
            handleDepartureTime(
              currentFilters.departime === "After 6Pm"
                ? "Before 6Am"
                : "After 6Pm"
            )}
        />
        <span>After 6 PM</span>
      </label>
    </div>
  </div>

  <!-- Duration -->
  <div class="filter-section">
    <h4>Duration</h4>
    <div class="duration-range">
      <div class="duration-labels">
        <span>4hr</span>
        <span>30h+</span>
      </div>
      <input
        type="range"
        min="4"
        max="30"
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
      <label class="filter-option">
        <span>Air Arabia</span>
      </label>
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.airlines === "IndiGo"}
          onchange={() =>
            handleAirlines(
              currentFilters.airlines === "IndiGo" ? "Air India" : "IndiGo"
            )}
        />
        <span>IndiGo</span>
      </label>
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.airlines === "Air India"}
          onchange={() =>
            handleAirlines(
              currentFilters.airlines === "Air India" ? "SpiceJet" : "Air India"
            )}
        />
        <span>Air India</span>
      </label>
      <label class="filter-option">
        <span>Asaka Air</span>
      </label>
      <label class="filter-option">
        <input
          type="checkbox"
          checked={currentFilters.airlines === "SpiceJet"}
          onchange={() =>
            handleAirlines(
              currentFilters.airlines === "SpiceJet"
                ? "Thai Airways"
                : "SpiceJet"
            )}
        />
        <span>Spice Jet</span>
      </label>
      <label class="filter-option">
        <span>Qatar Airways</span>
      </label>
      <label class="filter-option">
        <span>Singapore Airlines</span>
      </label>
      <label class="filter-option">
        <span>Air India Express</span>
      </label>
    </div>
  </div>

  <!-- Debug Section (Remove in production) -->
  <div class="debug-section">
    <h4>🐛 Debug Info</h4>
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
