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
<script lang="ts">
  import { onMount } from "svelte";
  export let flight;

  let showDetails = false;

  const toggleDetails = () => (showDetails = !showDetails);

  const getAmenitiesByType = (type: string) => {
    return (
      flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.amenities?.filter(
        (a: { amenityType: string }) => a.amenityType === type
      ) || []
    );
  };

  const cabinBag =
    flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCabinBags;
  const checkinBag =
    flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
      ?.includedCheckedBags;
  const amenities =
    flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.amenities || [];
  let activeTab = "info";

  // Format duration from ISO to "Xh Ym"
  function getFlightDuration(duration: string) {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    const h = match?.[1]?.replace("H", "h ") ?? "";
    const m = match?.[2]?.replace("M", "m") ?? "";
    return `${h}${m}`.trim();
  }

  const flightDuration = getFlightDuration(
    flight?.itineraries?.[0]?.duration || ""
  );

  const fareRules = getAmenitiesByType("BRANDED_FARES");
  const cancelRules = getAmenitiesByType("TICKETING");
</script>

<div class="flight-card">
  <div class="main-info" on:click={() => (showDetails = !showDetails)}>
    <div class="airline-logo-info">
      <img src="/airline-default.png" alt="Airline Logo" class="airline-logo" />
      <div>
        <strong>AI {flight.itineraries[0].segments[0].number}</strong><br />
        <span
          >{flight.itineraries[0].segments[0].aircraft?.code ??
            "Aircraft N/A"}</span
        >
      </div>
    </div>

    <div class="center-info">
      <div>{flight.itineraries[0].segments[0].departure.at.slice(11, 16)}</div>
      <div class="duration-block">
        <span
          >{flight.itineraries[0].duration
            .replace("PT", "")
            .toLowerCase()
            .replace("h", "h ")
            .replace("m", "m")}</span
        >
        <hr />
        <small>
          {flight.itineraries[0].segments.length > 1
            ? `${flight.itineraries[0].segments.length - 1} stop${flight.itineraries[0].segments.length - 1 > 1 ? "s" : ""}`
            : "Non-stop"}
        </small>
      </div>
      <div>
        {flight.itineraries[0].segments.at(-1).arrival.at.slice(11, 16)}
      </div>
    </div>

    <div class="price-col">
      {#if flight.price.base && flight.price.base !== flight.price.total}
        <div class="strike">₹{flight.price.base}</div>
      {/if}
      <div class="final">₹{flight.price.total}</div>
      <small class="discount">Discount Applied</small>
      <button class="book-btn">BOOK NOW</button>
    </div>
  </div>

  {#if showDetails}
    <div class="tabs">
      <div class="tab-headings">
        <button
          on:click={() => (activeTab = "info")}
          class:active={activeTab === "info"}>Flight Information</button
        >
        <button
          on:click={() => (activeTab = "fare")}
          class:active={activeTab === "fare"}>Fare Details & Rules</button
        >
        <button
          on:click={() => (activeTab = "baggage")}
          class:active={activeTab === "baggage"}>Baggage Information</button
        >
        <button
          on:click={() => (activeTab = "cancel")}
          class:active={activeTab === "cancel"}
          >Cancellation & Change Rule</button
        >
      </div>

      <div class="tab-content">
        {#if activeTab === "info"}
          {#each flight.itineraries[0].segments as seg}
            <div class="info-row">
              <strong>{seg.departure.iataCode}</strong>
              {seg.departure.at.slice(11, 16)} →
              <strong>{seg.arrival.iataCode}</strong>
              {seg.arrival.at.slice(11, 16)}
              <div>
                <small
                  >Duration: {seg.duration
                    .replace("PT", "")
                    .toLowerCase()
                    .replace("h", "h ")
                    .replace("m", "m")}</small
                >
              </div>
              <div>
                <small
                  >Terminal: {seg.departure.terminal ?? "N/A"} → {seg.arrival
                    .terminal ?? "N/A"}</small
                >
              </div>
            </div>
          {/each}
        {:else if activeTab === "fare"}
          {#if amenities.filter((a: { amenityType: string }) => a.amenityType === "BRANDED_FARES").length > 0}
            <table>
              <thead><tr><th>Rule</th><th>Charge</th></tr></thead><tbody>
                {#each amenities.filter((a: { amenityType: string }) => a.amenityType === "BRANDED_FARES") as item}
                  <tr
                    ><td>{item.description}</td><td
                      >{item.isChargeable ? "Chargeable" : "Free"}</td
                    ></tr
                  >
                {/each}
              </tbody>
            </table>
          {:else}
            <p>No data available</p>
          {/if}
        {:else if activeTab === "baggage"}
          {#if cabinBag || checkinBag}
            <table>
              <thead><tr><th>Type</th><th>Weight</th></tr></thead><tbody>
                {#if cabinBag}
                  <tr
                    ><td>Cabin</td><td
                      >{cabinBag.weight} {cabinBag.weightUnit}</td
                    ></tr
                  >
                {/if}
                {#if checkinBag}
                  <tr
                    ><td>Check-in</td><td
                      >{checkinBag.weight} {checkinBag.weightUnit}</td
                    ></tr
                  >
                {/if}
              </tbody>
            </table>
          {:else}
            <p>No data available</p>
          {/if}
        {:else if activeTab === "cancel"}
          {#if amenities.filter( (a: { description: string | string[] }) => a.description.includes("TICKET") ).length > 0}
            <table>
              <thead><tr><th>Type</th><th>Status</th></tr></thead><tbody>
                {#each amenities.filter( (a: { description: string | string[] }) => a.description.includes("TICKET") ) as item}
                  <tr
                    ><td>{item.description}</td><td
                      >{item.isChargeable ? "Chargeable" : "Free"}</td
                    ></tr
                  >
                {/each}
              </tbody>
            </table>
          {:else}
            <p>No data available</p>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .flight-card {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    font-family: "Segoe UI", sans-serif;
    background: #fff;
  }

  .flight-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #eee;
  }

  .flight-info-block {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .flight-info-block img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .flight-times {
    text-align: center;
    flex: 1;
    font-size: 14px;
    color: #444;
  }

  .flight-times .time {
    font-weight: bold;
    font-size: 16px;
    color: #000;
  }

  .flight-price {
    text-align: right;
    font-weight: bold;
    font-size: 18px;
    color: #0cb1d2;
  }

  .flight-book-btn {
    display: block;
    width: 100%;
    background-color: #00b8d9;
    color: #fff;
    padding: 12px;
    font-weight: 600;
    text-align: center;
    border: none;
    cursor: pointer;
    border-radius: 0;
  }

  .flight-book-btn:hover {
    background-color: #009dbb;
  }

  .tabs {
    padding: 16px;
  }

  .tab-headings {
    display: flex;
    gap: 20px;
    border-bottom: 2px solid #eee;
    margin-bottom: 12px;
  }

  .tab-headings button {
    background: none;
    border: none;
    padding: 8px 0;
    font-weight: 600;
    color: #00aacc;
    cursor: pointer;
    position: relative;
  }

  .tab-headings button.selected::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 3px;
    width: 100%;
    background: #00aacc;
    border-radius: 2px;
  }

  .tab-content {
    font-size: 14px;
    color: #333;
  }

  .tab-content .info-row {
    margin-bottom: 10px;
  }

  .tab-content .layover {
    font-style: italic;
    margin: 6px 0 12px 0;
    color: #999;
  }

  .tab-content table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }

  .tab-content th,
  .tab-content td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
  }

  .tab-content th {
    background-color: #f9f9f9;
    font-weight: 600;
  }

  .airline-logo-info {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .airline-logo {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #eee;
  }

  .center-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1rem;
  }

  .duration-block {
    text-align: center;
    font-weight: 500;
    font-size: 0.95rem;
  }

  .duration-block hr {
    width: 50%;
    border: none;
    border-top: 1px solid var(--grey-light);
    margin: 4px auto;
  }

  .price-col {
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .strike {
    text-decoration: line-through;
    color: var(--grey-dark);
    font-size: 0.95rem;
  }

  .final {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--blue-dark);
  }

  .discount {
    font-size: 0.75rem;
    color: var(--green);
  }

  .book-btn {
    background-color: var(--blue);
    color: white;
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .book-btn:hover {
    background-color: var(--blue-dark);
  }

  .tabs {
    margin-top: 1rem;
    padding: 0 1rem 1rem;
    background-color: #fdfdff;
  }

  .tab-headings {
    display: flex;
    gap: 1rem;
    border-bottom: 1px solid var(--grey-light);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }

  .tab-headings button {
    background: none;
    border: none;
    padding: 0.5rem 0;
    cursor: pointer;
    font-weight: bold;
    color: var(--blue-dark);
    border-bottom: 2px solid transparent;
  }

  .tab-headings button.active {
    border-color: var(--blue);
    color: var(--blue);
  }

  .tab-content table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }

  .tab-content th,
  .tab-content td {
    border: 1px solid var(--grey-light);
    padding: 0.5rem;
    text-align: left;
  }

  .info-row {
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

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
