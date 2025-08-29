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
  export let flight;

  let isExpanded = false;
  const itinerary = flight.itineraries[0];
  const segments = itinerary.segments;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  const departureTime = firstSegment?.departure?.at?.slice(11, 16) ?? "";
  const arrivalTime = lastSegment?.arrival?.at?.slice(11, 16) ?? "";
  const duration = itinerary?.duration?.replace("PT", "").toLowerCase() ?? "";
  const totalStops = segments.length - 1;
</script>

<div class="flight-card">
  <div class="top-section" on:click={() => (isExpanded = !isExpanded)}>
    <div class="flight-info">
      <div class="flight-time">{departureTime}</div>
      <div class="flight-path">
        <div class="duration">{duration}</div>
        <div class="stop-info">
          {#if totalStops === 0}
            Non-stop
          {:else}
            {totalStops} stop{totalStops > 1 ? "s" : ""}
          {/if}
        </div>
      </div>
      <div class="flight-time">{arrivalTime}</div>
    </div>
    <div class="price-section">
      <div class="price">₹{flight?.price?.total}</div>
      {#if flight?.price?.currency}
        <div class="subtext">in {flight.price.currency}</div>
      {/if}
    </div>
  </div>

  {#if isExpanded}
    <div class="details">
      <h4>Flight Segments</h4>
      {#each segments as segment, i}
        <div class="segment">
          <div><strong>{segment?.carrierCode} {segment?.number}</strong></div>
          <div>
            From: {segment?.departure?.iataCode} @ {segment?.departure?.at}
          </div>
          <div>To: {segment?.arrival?.iataCode} @ {segment?.arrival?.at}</div>
          <div>Duration: {segment?.duration}</div>
          {#if segment?.numberOfStops > 0}
            <div>Stops: {segment.numberOfStops}</div>
          {/if}
          {#if i < segments.length - 1}
            <hr />
            <div class="layover">Layover at {segment.arrival.iataCode}</div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .flight-card {
    border: 1px solid #ddd;
    border-radius: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: #fdfdfd;
    transition: box-shadow 0.2s ease;
  }
  .flight-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .flight-info {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .flight-time {
    font-size: 20px;
    font-weight: bold;
  }

  .flight-path {
    text-align: center;
    font-size: 14px;
  }

  .duration {
    font-weight: bold;
    color: #333;
  }

  .stop-info {
    font-size: 12px;
    color: #2a9d8f;
  }

  .price-section {
    text-align: right;
  }

  .price {
    font-size: 22px;
    font-weight: bold;
    color: #000;
  }

  .subtext {
    font-size: 12px;
    color: #2a9d8f;
  }

  .details {
    margin-top: 16px;
    background: #f2faff;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #cde7ef;
  }

  .segment {
    font-size: 13px;
    margin-bottom: 12px;
  }

  .layover {
    color: #555;
    font-style: italic;
    margin-top: 4px;
  }
</style>
