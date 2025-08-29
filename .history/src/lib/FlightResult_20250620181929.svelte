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
  const segments = itinerary?.segments ?? [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  const depTime = firstSegment?.departure?.at?.slice(11, 16) ?? "";
  const arrTime = lastSegment?.arrival?.at?.slice(11, 16) ?? "";
  const duration = itinerary?.duration?.replace("PT", "").toLowerCase() ?? "";
  const totalStops = segments.length - 1;
</script>

<div class="card">
  <div class="summary" on:click={() => (isExpanded = !isExpanded)}>
    <div class="time-info">
      <div class="time-block">
        <span class="material-icons-outlined icon">flight_takeoff</span>
        <span class="time">{depTime}</span>
        <span class="airport">{firstSegment?.departure?.iataCode}</span>
      </div>
      <div class="duration">
        <div>{duration}</div>
        <div class="stops">
          {totalStops === 0
            ? "Non-stop"
            : `${totalStops} stop${totalStops > 1 ? "s" : ""}`}
        </div>
      </div>
      <div class="time-block">
        <span class="material-icons-outlined icon">flight_land</span>
        <span class="time">{arrTime}</span>
        <span class="airport">{lastSegment?.arrival?.iataCode}</span>
      </div>
    </div>
    <div class="price-info">
      <div class="price">₹{flight?.price?.total}</div>
      {#if flight?.price?.currency}
        <div class="currency">({flight?.price?.currency})</div>
      {/if}
    </div>
  </div>

  {#if isExpanded}
    <div class="details">
      {#each segments as segment, i}
        <div class="segment">
          <div class="segment-row">
            <span class="material-icons-outlined icon">airplane_ticket</span>
            <strong>{segment?.carrierCode} {segment?.number}</strong>
          </div>
          <div class="segment-row">
            <span class="material-icons-outlined icon">schedule</span>
            {segment?.departure?.iataCode} → {segment?.arrival?.iataCode}
          </div>
          <div class="segment-row">
            <span class="material-icons-outlined icon">access_time</span>
            {segment?.departure?.at?.slice(11, 16)} → {segment?.arrival?.at?.slice(
              11,
              16
            )}
          </div>
          <div class="segment-row">
            <span class="material-icons-outlined icon">timer</span>
            Duration: {segment?.duration?.replace("PT", "").toLowerCase()}
          </div>
          {#if segment?.numberOfStops > 0}
            <div class="segment-row">
              <span class="material-icons-outlined icon">stop_circle</span>
              Stops: {segment.numberOfStops}
            </div>
          {/if}

          {#if i < segments.length - 1}
            <div class="layover">
              Layover at {segment?.arrival?.iataCode}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .card {
    border: 1px solid #ddd;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    margin-bottom: 20px;
    overflow: hidden;
    transition: 0.3s ease;
  }

  .summary {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background: #f9fcff;
  }

  .time-info {
    display: flex;
    align-items: center;
    gap: 40px;
  }

  .time-block {
    text-align: center;
  }

  .icon {
    font-size: 20px;
    vertical-align: middle;
    color: #1976d2;
    margin-right: 4px;
  }

  .time {
    font-size: 18px;
    font-weight: bold;
    display: block;
  }

  .airport {
    font-size: 13px;
    color: #666;
  }

  .duration {
    text-align: center;
    font-size: 14px;
    color: #333;
  }

  .stops {
    font-size: 12px;
    color: #4caf50;
  }

  .price-info {
    text-align: right;
  }

  .price {
    font-size: 22px;
    font-weight: 600;
    color: #2c3e50;
  }

  .currency {
    font-size: 12px;
    color: #777;
  }

  .details {
    background: #f0f8ff;
    padding: 16px;
    border-top: 1px solid #ccc;
  }

  .segment {
    padding: 12px 0;
    border-bottom: 1px dashed #ccc;
  }

  .segment-row {
    font-size: 14px;
    margin: 4px 0;
    display: flex;
    align-items: center;
  }

  .layover {
    margin-top: 6px;
    font-size: 13px;
    font-style: italic;
    color: #555;
  }
</style>
