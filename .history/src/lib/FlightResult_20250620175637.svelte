<script lang="ts">
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
</style>
