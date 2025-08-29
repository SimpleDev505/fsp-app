<!-- <script lang="ts">
  export let flight: any;

  let showDetails = false;

  function toggleDetails() {
    showDetails = !showDetails;
  }

  function getPrice(flight: { price: { total: string } }): string {
    return flight.price?.total
      ? `₹${parseInt(flight.price.total) * 83}`
      : "₹N/A";
  }

  function getDuration(segment: { duration: string }) {
    const d = segment.duration.replace("PT", "").toLowerCase();
    return d.replace("h", "h ").replace("m", "m");
  }

  function getSegments(flight: { itineraries: { segments: any }[] }) {
    return flight.itineraries?.[0]?.segments || [];
  }
</script>

<div class="flight-card" on:click={toggleDetails}>
  <div class="header">
    <div class="airline">
      {getSegments(flight)[0]?.carrierCode}
      {getSegments(flight)[0]?.flightNumber}
    </div>
    <div class="times">
      <span>{getSegments(flight)[0]?.departure?.at?.slice(11, 16)}</span>
      <span class="arrow">➝</span>
      <span>{getSegments(flight)[0]?.arrival?.at?.slice(11, 16)}</span>
    </div>
    <div class="duration">
      {getDuration(flight.itineraries?.[0])}
      <span class="nonstop">Non-stop</span>
    </div>
    <div class="price">{getPrice(flight)}</div>
  </div>

  {#if showDetails}
    <div class="details">
      <div><strong>Fare Type:</strong> Economy</div>
      <div><strong>Baggage:</strong> 7kg Cabin + 15kg Check-in</div>
      <div><strong>Change Charges:</strong> ₹999</div>
      <div><strong>Cancellation Charges:</strong> ₹1069</div>
      <div><strong>Meals:</strong> Free Meal</div>
    </div>
  {/if}
</div>

<style>
  .flight-card {
    border: 1px solid #d0e1ff;
    border-radius: 8px;
    margin: 1rem 0;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #f9fbff;
  }

  .flight-card:hover {
    background-color: #eef5ff;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .airline {
    font-weight: bold;
    font-size: 1.1rem;
    color: #2a2a2a;
  }

  .times {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 1rem;
  }

  .arrow {
    font-size: 1.2rem;
    color: #555;
  }

  .duration {
    font-size: 0.95rem;
    color: #555;
  }

  .nonstop {
    font-size: 0.85rem;
    color: #0071ff;
    margin-left: 5px;
  }

  .price {
    font-size: 1.3rem;
    font-weight: bold;
    color: #2e7d32;
  }

  .details {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #ccc;
    color: #333;
    font-size: 0.95rem;
    line-height: 1.6;
  }
</style> -->

<div class="flight-card">
  <!-- Top Section -->
  <div class="card-top">
    {#if flight.airlineLogo}
      <img
        src={flight.airlineLogo}
        alt={flight.airlineName}
        class="airline-logo"
      />
    {/if}
    <div class="airline-info">
      <div class="airline-name">{flight.airlineName}</div>
      <div class="flight-code">{flight.airlineCode}-{flight.flightNumber}</div>
      {#if flight.aircraftModel}
        <div class="aircraft">{flight.aircraftModel}</div>
      {/if}
    </div>

    <div class="route-info">
      <div class="leg">
        <div class="time">
          {flight.itineraries[0]?.segments[0]?.departure?.at?.slice(11, 16)}
        </div>
        <div class="airport">
          {flight.itineraries[0]?.segments[0]?.departure?.iataCode}
        </div>
      </div>
      <div class="duration-block">
        <span class="material-symbols-outlined">schedule</span>
        <div>{flightDuration}</div>
        <hr />
        <div class="layover-label">
          {flight.itineraries[0].segments.length === 1
            ? "Non‑stop"
            : `${flight.itineraries[0].segments.length - 1} Stop${flight.itineraries[0].segments.length > 2 ? "s" : ""}`}
        </div>
      </div>
      <div class="leg">
        <div class="time">
          {flight.itineraries[0]?.segments.at(-1)?.arrival?.at?.slice(11, 16)}
        </div>
        <div class="airport">
          {flight.itineraries[0]?.segments.at(-1)?.arrival?.iataCode}
        </div>
      </div>
    </div>

    <div class="price-info">
      {#if flight.price.base && flight.price.base !== flight.price.total}
        <span class="base-price">₹{flight.price.base}</span>
      {/if}
      <span class="offer-price">₹{flight.price.total}</span>
      <button class="book-now">BOOK NOW</button>
    </div>
  </div>

  <!-- Tabs Toggle -->
  <div class="card-tabs">
    <button
      class:selected={activeTab === "info"}
      on:click={() => (activeTab = "info")}>Flight Information</button
    >
    <button
      class:selected={activeTab === "fare"}
      on:click={() => (activeTab = "fare")}>Fare Details & Rules</button
    >
    <button
      class:selected={activeTab === "baggage"}
      on:click={() => (activeTab = "baggage")}>Baggage Information</button
    >
    <button
      class:selected={activeTab === "cancel"}
      on:click={() => (activeTab = "cancel")}>Cancellation & Change Rule</button
    >
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    {#if activeTab === "info"}
      {#if flight.itineraries}
        <!-- Flight Information Table -->
        <table>
          <tr
            ><th>From</th><td
              >{flight.itineraries[0].segments[0].departure.iataCode} ({flight.itineraries[0].segments[0].departure.at.slice(
                0,
                10
              )})</td
            ></tr
          >
          <tr
            ><th>To</th><td
              >{flight.itineraries[0].segments.at(-1).arrival.iataCode} ({flight.itineraries[0].segments
                .at(-1)
                .arrival.at.slice(0, 10)})</td
            ></tr
          >
          <tr><th>Duration</th><td>{flightDuration}</td></tr>
          {#if flight.itineraries[0].segments[0].departure.terminal}
            <tr
              ><th>Dept Terminal</th><td
                >{flight.itineraries[0].segments[0].departure.terminal}</td
              ></tr
            >
          {/if}
          {#if flight.itineraries[0].segments.at(-1).arrival.terminal}
            <tr
              ><th>Arr Terminal</th><td
                >{flight.itineraries[0].segments.at(-1).arrival.terminal}</td
              ></tr
            >
          {/if}
        </table>
      {:else}
        <p>No Data Available</p>
      {/if}
    {:else if activeTab === "fare"}
      {#if fareRules.length}
        <table>
          <tr><th>Rule</th><th>Chargeable</th></tr>
          {#each fareRules as r}
            <tr
              ><td>{r.description}</td><td>{r.isChargeable ? "Yes" : "No"}</td
              ></tr
            >
          {/each}
        </table>
      {:else}
        <p>No Data Available</p>
      {/if}
    {:else if activeTab === "baggage"}
      {#if cabinBag || checkinBag}
        <table>
          <tr><th>Type</th><th>Weight</th></tr>
          {#if cabinBag}<tr
              ><td>Cabin</td><td>{cabinBag.weight} {cabinBag.weightUnit}</td
              ></tr
            >{/if}
          {#if checkinBag}<tr
              ><td>Check‑in</td><td
                >{checkinBag.weight} {checkinBag.weightUnit}</td
              ></tr
            >{/if}
        </table>
      {:else}
        <p>No Data Available</p>
      {/if}
    {:else if cancelRules.length}
      <table>
        <tr><th>Policy</th><th>Chargeable</th></tr>
        {#each cancelRules as c}
          <tr
            ><td>{c.description}</td><td>{c.isChargeable ? "Yes" : "No"}</td
            ></tr
          >
        {/each}
      </table>
    {:else}
      <p>No Data Available</p>
    {/if}
  </div>
</div>

<style>
  :root {
    --blue: #04b0d3;
    --green: #08e200;
    --yellow: #e7c205;
    --grey-light: #ebebeb;
    --grey-dark: #6d6d6d;
    --red: #e8651a;
    --blue-dark: #018daa;
  }

  .flight-card {
    width: 100%;
    border: 1px solid var(--grey-light);
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    font-family: sans-serif;
  }

  .card-top {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: var(--grey-light);
  }

  .airline-logo {
    width: 40px;
    height: 40px;
    margin-right: 0.8rem;
  }

  .airline-info {
    flex: 1;
  }
  .airline-name {
    font-weight: bold;
  }
  .flight-code,
  .aircraft {
    font-size: 0.9rem;
    color: var(--grey-dark);
  }

  .route-info {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .leg .time {
    font-size: 1.4rem;
    font-weight: bold;
  }
  .leg .airport {
    font-size: 0.9rem;
    color: var(--grey-dark);
  }

  .duration-block {
    text-align: center;
    font-size: 0.9rem;
    color: var(--grey-dark);
  }
  .duration-block span.material-symbols-outlined {
    color: var(--blue);
  }

  .duration-block hr {
    border: none;
    border-top: 1px solid var(--grey-light);
    margin: 0.3rem 0;
  }
  .layover-label {
    color: var(--green);
    font-size: 0.85rem;
  }

  .price-info {
    text-align: right;
    margin-left: auto;
  }
  .base-price {
    text-decoration: line-through;
    color: var(--grey-dark);
  }
  .offer-price {
    color: var(--red);
    font-size: 1.4rem;
    margin-left: 0.5rem;
  }
  .book-now {
    background: var(--red);
    color: #fff;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  .card-tabs {
    display: flex;
    background: var(--grey-light);
  }
  .card-tabs button {
    flex: 1;
    padding: 0.8rem;
    border: none;
    background: none;
    font-weight: 600;
    color: var(--grey-dark);
    cursor: pointer;
  }
  .card-tabs button.selected {
    background: #fff;
    border-bottom: 2px solid var(--blue);
    color: var(--blue-dark);
  }

  .tab-content {
    padding: 1rem;
    background: #fff;
  }
  .tab-content table {
    width: 100%;
    border-collapse: collapse;
  }
  .tab-content th,
  .tab-content td {
    border: 1px solid var(--grey-light);
    padding: 0.6rem;
    color: var(--grey-dark);
  }
  .tab-content p {
    color: var(--grey-dark);
    text-align: center;
    font-style: italic;
  }
</style>
