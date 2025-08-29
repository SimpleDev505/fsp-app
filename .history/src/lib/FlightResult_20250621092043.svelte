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
      <span class="material-symbols-outlined">flight_takeoff</span>
      <div>{flight.itineraries[0].segments[0].departure.at.slice(11, 16)}</div>
      <div class="duration-block">
        <span class="material-symbols-outlined">schedule</span>
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
      <span class="material-symbols-outlined">flight_land</span>
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
              <strong
                style="width: fit-content; height: fit-content; display: flex; flex-direction: row;justify-content:center;align-items:center; column-gap: 10px;"
              >
                <span class="material-symbols-outlined">flight_takeoff</span>
                {seg.departure.iataCode}
                {seg.departure.at.slice(11, 16)}
              </strong>
              <strong>→</strong>
              <strong
                style="width: fit-content; height: fit-content; display: flex; flex-direction: row;justify-content:center;align-items:center; column-gap: 10px;"
              >
                <span class="material-symbols-outlined">flight_land</span>
                {seg.arrival.iataCode}
                {seg.arrival.at.slice(11, 16)}
              </strong>
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
  .material-symbols-outlined {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;
  }

  .flight-card {
    width: 100%;
    border: 1px solid var(--grey-light);
    border-radius: 10px;
    background: #fff;
    font-family: "Segoe UI", sans-serif;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  }

  .main-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    gap: 16px;
    cursor: pointer;
  }

  .airline-logo-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .airline-logo {
    width: 42px;
    height: 42px;
    object-fit: contain;
    border-radius: 5px;
  }

  .airline-logo-info strong {
    font-size: 16px;
  }

  .airline-logo-info span {
    font-size: 12px;
    color: #666;
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 6px;
    display: inline-block;
    margin-top: 2px;
  }

  .center-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex: 1;
    font-size: 14px;
  }

  .center-info > div {
    text-align: center;
  }

  .center-info .duration-block {
    color: var(--grey-dark);
    font-size: 13px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .center-info .duration-block hr {
    width: 30px;
    border: 1px solid #ccc;
    margin: 4px 0;
  }

  .price-col {
    text-align: right;
    min-width: 110px;
  }

  .strike {
    text-decoration: line-through;
    color: #999;
    font-size: 13px;
  }

  .final {
    color: var(--red);
    font-size: 20px;
    font-weight: bold;
  }

  .discount {
    color: var(--green);
    font-size: 12px;
    padding: 4px;
    border-radius: 50%;
    font-weight: bold;
    outline: 2px solid var(--grey-light);
  }

  .book-btn {
    background: var(--blue);
    color: white;
    border: none;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 600;
    margin-top: 4px;
    border-radius: 5px;
    cursor: pointer;
  }
  .book-btn:hover {
    background-color: var(--blue-dark);
  }

  .tabs {
    background: #f9f9f9;
    padding-bottom: 10px;
  }

  .tab-headings {
    display: flex;
    gap: 8px;
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border-bottom: 1px solid #ddd;
  }

  .tab-headings button {
    background: none;
    border: none;
    font-weight: 600;
    font-size: 14px;
    padding: 8px 16px;
    color: #555;
    cursor: pointer;
    border-radius: 20px;
  }

  .tab-headings button.active {
    background: var(--blue);
    color: white;
  }

  .tab-content {
    padding: 1rem;
    font-size: 14px;
    background: white;
  }

  .info-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;
    column-gap: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  .info-row small {
    display: block;
    color: #666;
    margin-top: 2px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    font-size: 14px;
  }

  th,
  td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background: #f9f9f9;
    font-weight: bold;
  }

  p {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 0.5rem 0;
  }
</style>
