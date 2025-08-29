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
        (a) => a.amenityType === type
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
        {flight?.itineraries[0]?.duration?.replace("PT", "").toLowerCase()}
        <br />
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
      ₹{flight?.price?.total}
    </div>
  </div>

  {#if showDetails}
    <div class="details">
      <div class="section">
        <h3>Fare Types</h3>
        <p>
          {flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
            ?.brandedFareLabel}
        </p>
      </div>

      {#if cabinBag || checkinBag}
        <div class="section">
          <h3>Baggage</h3>
          {#if cabinBag}
            <div class="row">
              <span class="material-icons-outlined">work</span>
              {cabinBag.weight}
              {cabinBag.weightUnit} Cabin bag
            </div>
          {/if}
          {#if checkinBag}
            <div class="row">
              <span class="material-icons-outlined">luggage</span>
              {checkinBag.weight}
              {checkinBag.weightUnit} Check-in bag
            </div>
          {/if}
        </div>
      {/if}

      {#if getAmenitiesByType("BRANDED_FARES").length > 0}
        <div class="section">
          <h3>Change / Cancellation</h3>
          {#each getAmenitiesByType("BRANDED_FARES") as a}
            <div class="row">
              <span class="material-icons-outlined">
                {a.description.includes("REFUNDABLE")
                  ? "autorenew"
                  : a.description.includes("CHANGE")
                    ? "cached"
                    : "info"}
              </span>
              {a.description}
            </div>
          {/each}
        </div>
      {/if}

      {#if getAmenitiesByType("MEAL").length > 0 || getAmenitiesByType("PRE_RESERVED_SEAT").length > 0 || getAmenitiesByType("UPGRADES").length > 0}
        <div class="section">
          <h3>Add-ons & Services</h3>
          {#each amenities as a (a.description)}
            {#if ["MEAL", "PRE_RESERVED_SEAT", "UPGRADES"].includes(a.amenityType)}
              <div class="row">
                <span class="material-icons-outlined">
                  {a.amenityType === "MEAL"
                    ? "restaurant"
                    : a.amenityType === "PRE_RESERVED_SEAT"
                      ? "event_seat"
                      : "upgrade"}
                </span>
                {a.description}
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
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
    color: #666;
    font-size: 0.9rem;
  }

  .duration p {
    text-align: center;
    color: #333;
  }

  .price {
    font-size: 1.3rem;
    color: #007b5e;
    font-weight: bold;
  }

  .details {
    padding: 1rem;
    border-top: 1px solid #ddd;
  }

  .section {
    margin-bottom: 1rem;
  }

  .section h3 {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    color: #444;
  }

  .row {
    display: flex;
    align-items: center;
    margin: 0.25rem 0;
    color: #333;
    gap: 0.5rem;
  }

  .material-icons-outlined {
    font-size: 18px;
    color: #4caf50;
  }
</style>
