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

  const segment = flight.itineraries[0].segments[0];
  const departureTime = segment.departure.at.slice(11, 16);
  const arrivalTime = segment.arrival.at.slice(11, 16);
  const duration = flight.itineraries[0].duration
    .replace("PT", "")
    .toLowerCase();
</script>

<div class="flight-card">
  <div class="top-section" on:click={() => (isExpanded = !isExpanded)}>
    <div class="flight-info">
      <div class="flight-time">{departureTime}</div>
      <div class="flight-path">
        <div class="duration">{duration}</div>
        <div class="non-stop">Non-stop</div>
      </div>
      <div class="flight-time">{arrivalTime}</div>
    </div>
    <div class="price-section">
      <div class="price">₹{flight.price.total}</div>
      <div class="subtext">Starts at</div>
    </div>
  </div>

  {#if isExpanded}
    <div class="details">
      <div class="fare-types">
        <div class="fare">
          <h4>Saver fare</h4>
          <p class="fare-price">₹{flight.price.total}</p>
          <ul>
            <li>✔ 7 kg Cabin bag allowance</li>
            <li>✔ 15 kg Check-in bag</li>
            <li>✱ Change charges apply</li>
            <li>✱ Cancellation charges apply</li>
          </ul>
        </div>
        <div class="fare">
          <h4>Flexi plus fare</h4>
          <p class="fare-price">₹{parseInt(flight.price.total) + 50}</p>
          <ul>
            <li>✔ + Free seat</li>
            <li>✔ + Free meal</li>
            <li>✱ Moderate cancellation</li>
          </ul>
        </div>
        <div class="fare">
          <h4>Super 6E fare</h4>
          <p class="fare-price">₹{parseInt(flight.price.total) + 1500}</p>
          <ul>
            <li>✔ XL seat + 20kg bag</li>
            <li>✔ Free meal</li>
            <li>✔ Free XL seat</li>
          </ul>
        </div>
      </div>
      <a href="#">Click here</a> to know more about this flight.
    </div>
  {/if}
</div>

<style>
  .flight-card {
    border: 1px solid #ddd;
    border-radius: 12px;
    margin-bottom: 20px;
    padding: 16px;
    font-family: sans-serif;
    background: #f9f9f9;
  }

  .top-section {
    display: flex;
    justify-content: space-between;
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
    color: #555;
  }

  .duration {
    font-weight: bold;
  }

  .non-stop {
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
    background: #fff;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }

  .fare-types {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .fare {
    flex: 1;
    background: #f2faff;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #d2e6ec;
  }

  .fare h4 {
    margin: 0;
    font-size: 14px;
    color: #555;
  }

  .fare-price {
    font-size: 16px;
    color: #333;
    margin-bottom: 6px;
  }

  .fare ul {
    list-style: none;
    padding-left: 0;
    font-size: 13px;
  }

  .fare ul li {
    margin-bottom: 4px;
  }
</style>
