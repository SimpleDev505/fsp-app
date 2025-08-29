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
</script>

<div class="flight-card">
  <div class="main-info" on:click={toggleDetails}>
    <div class="flight-time">
      <h2>
        {flight?.itineraries[0]?.segments[0]?.departure?.at?.slice(11, 16)}
      </h2>
      <span>{flight?.itineraries[0]?.segments[0]?.departure?.iataCode}</span>
    </div>

    <div class="duration">
      <p>
        <span class="material-symbols-outlined">schedule</span>
        {flight?.itineraries[0]?.duration?.replace("PT", "").toLowerCase()}
        <br />
        <span style="width: 100%;" class="material-symbols-outlined"
          >horizontal_rule</span
        >
        {flight?.itineraries[0]?.segments?.length === 1
          ? "Non-stop"
          : `${flight?.itineraries[0]?.segments?.length - 1} layover`}
      </p>
    </div>

    <div class="flight-time">
      <h2>
        {flight?.itineraries[0]?.segments.at(-1)?.arrival?.at?.slice(11, 16)}
      </h2>
      <span>{flight?.itineraries[0]?.segments.at(-1)?.arrival?.iataCode}</span>
    </div>

    <div class="price">
      <span class="material-symbols-outlined">payments</span>
      ₹{flight?.price?.total}
    </div>
  </div>

  {#if showDetails}
    <div class="details-section">
      <!-- Baggage -->
      <div class="detail-card">
        <h3><span class="material-symbols-outlined">luggage</span> Baggage</h3>
        <table>
          <thead>
            <tr><th>Type</th><th>Weight</th></tr>
          </thead>
          <tbody>
            {#if cabinBag}
              <tr>
                <td
                  ><span class="material-symbols-outlined">work</span> Cabin</td
                >
                <td>{cabinBag.weight} {cabinBag.weightUnit}</td>
              </tr>
            {/if}
            {#if checkinBag}
              <tr>
                <td
                  ><span class="material-symbols-outlined">inventory_2</span> Check-in</td
                >
                <td>{checkinBag.weight} {checkinBag.weightUnit}</td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>

      <!-- Change / Cancellation -->
      {#if getAmenitiesByType("BRANDED_FARES").length > 0}
        <div class="detail-card">
          <h3>
            <span class="material-symbols-outlined">autorenew</span> Change / Cancellation
          </h3>
          <table>
            <thead>
              <tr><th>Description</th><th>Charge</th></tr>
            </thead>
            <tbody>
              {#each getAmenitiesByType("BRANDED_FARES") as a}
                <tr>
                  <td>
                    <span class="material-symbols-outlined">
                      {a.description.includes("REFUNDABLE")
                        ? "autorenew"
                        : a.description.includes("CHANGE")
                          ? "cached"
                          : "info"}
                    </span>
                    {a.description}
                  </td>
                  <td>{a.isChargeable ? "Chargeable" : "Free"}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      <!-- Add-ons -->
      {#if getAmenitiesByType("MEAL").length > 0 || getAmenitiesByType("PRE_RESERVED_SEAT").length > 0 || getAmenitiesByType("UPGRADES").length > 0}
        <div class="detail-card">
          <h3>
            <span class="material-symbols-outlined">add_circle</span> Add-ons & Services
          </h3>
          <table>
            <thead>
              <tr><th>Service</th><th>Status</th></tr>
            </thead>
            <tbody>
              {#each amenities as a (a.description)}
                {#if ["MEAL", "PRE_RESERVED_SEAT", "UPGRADES"].includes(a.amenityType)}
                  <tr>
                    <td>
                      <span class="material-symbols-outlined">
                        {a.amenityType === "MEAL"
                          ? "restaurant"
                          : a.amenityType === "PRE_RESERVED_SEAT"
                            ? "event_seat"
                            : "upgrade"}
                      </span>
                      {a.description}
                    </td>
                    <td>{a.isChargeable ? "Chargeable" : "Free"}</td>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <!-- Book Row -->
    <div class="book-row">
      <div class="price-display">
        {#if flight.price?.base && flight.price?.base !== flight.price?.total}
          <span class="strike">₹{flight.price.base}</span>
        {/if}
        <span class="offer">₹{flight.price.total}</span>
      </div>
      <button class="book-btn">
        <span class="material-symbols-outlined">flight_takeoff</span>
        Book Now
      </button>
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
    border: 1px solid #ddd;
    border-radius: 12px;
    margin: 1rem 0;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    font-family: sans-serif;
    background: #fff;
  }

  .main-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    background: #f9f9ff;
  }

  .flight-time h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .flight-time span {
    color: var(--grey-dark);
    font-size: 0.9rem;
  }

  .duration p {
    text-align: center;
    color: var(--grey-dark);
    font-size: 0.95rem;
  }

  .price {
    font-size: 1.3rem;
    color: var(--blue-dark);
    font-weight: bold;
  }

  .details-section {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
    padding: 0 1rem;
  }

  .detail-card {
    flex: 1 1 250px;
    border: 1px solid var(--grey-light);
    border-radius: 8px;
    padding: 1rem;
    background: white;
  }

  .detail-card h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: var(--blue-dark);
    border-left: 4px solid var(--blue);
    padding-left: 0.5rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  th,
  td {
    border: 1px solid var(--grey-light);
    padding: 0.5rem;
    color: var(--grey-dark);
  }

  .book-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--grey-light);
  }

  .price-display {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
  }

  .strike {
    text-decoration: line-through;
    color: var(--grey-dark);
    font-size: 1rem;
  }

  .offer {
    font-size: 1.4rem;
    font-weight: bold;
    color: var(--green);
  }

  .book-btn {
    background-color: var(--blue);
    color: white;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .book-btn:hover {
    background-color: var(--blue-dark);
  }
</style>
