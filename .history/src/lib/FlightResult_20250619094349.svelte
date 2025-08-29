<!-- <script lang="ts">
  let {
    airline,
    flightCode,
    from,
    to,
    departure,
    arrival,
    duration,
    baseFare,
    tax,
    totalFare,
    originalFare,
    refundable,
    cancellationPolicy,
    reschedulePolicy,
  }: {
    airline: string;
    flightCode: string;
    from: string;
    to: string;
    departure: string;
    arrival: string;
    duration: string;
    baseFare: number;
    tax: number;
    totalFare: number;
    originalFare: number;
    refundable: boolean;
    cancellationPolicy: {
      label: string;
      airlineFee: number;
      serviceFee: number;
    }[];
    reschedulePolicy: {
      label: string;
      airlineFee: number;
      serviceFee: number;
    }[];
  } = $props();

  let revealed = $state(false);

  function toggleReveal() {
    revealed = !revealed;
  }

  function formatTime(str: string) {
    return new Date(str).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

<div class="flightresultcard">
  <div
    class="flightresultcard-top"
    role="button"
    tabindex="0"
    onclick={toggleReveal}
  >
    <div class="airline-logo"></div>

    <div class="airline-info">
      <div class="airline-name">{airline}</div>
      <div class="flight-code">{flightCode}</div>
    </div>

    <div class="flight-time">
      <div class="time">{formatTime(departure)}</div>
      <div class="duration">{duration}</div>
      <div class="time">{formatTime(arrival)}</div>
    </div>

    <div class="location">
      <div>{from}</div>
      <div>Non Stop</div>
      <div>{to}</div>
    </div>

    <div class="fare-section">
      <div class="original-price">₹{originalFare}</div>
      <div class="final-price">₹{totalFare}</div>
      <button class="book-btn">Book Now</button>
    </div>
  </div>

  {#if revealed}
    <div class="flightresultcard-bottom">
      <div class="tabs">
        <div class="tab selected">Fees</div>
        <div class="tab">Rules</div>
        <div class="tab">Baggage</div>
        <div class="tab">Cancellation</div>
        <div class="tab">Help</div>
        <div class="refundable">
          {refundable ? "Refundable" : "Non-refundable"}
        </div>
      </div>

      <div class="fees-wrapper">
        <div class="fees-section">
          <div><strong>Fees Details</strong></div>
          <div>Base Fare ₹ {baseFare}</div>
          <div>Total Tax ₹ {tax}</div>
          <div><strong>Total ₹ {totalFare}</strong></div>
        </div>

        <div class="policy-section">
          <div><strong>Cancellation Time Frame</strong></div>
          {#each cancellationPolicy as item}
            <div class="row">
              <div>{item.label}</div>
              <div>₹{item.airlineFee}</div>
              <div>₹{item.serviceFee}</div>
            </div>
          {/each}

          <div><strong>Time Frame to Reschedule</strong></div>
          {#each reschedulePolicy as item}
            <div class="row">
              <div>{item.label}</div>
              <div>₹{item.airlineFee}</div>
              <div>₹{item.serviceFee}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .flightresultcard {
    border: 1px solid #ccc;
    border-radius: 8px;
    margin: 12px;
    overflow: hidden;
    font-family: sans-serif;
    background: #fff;
    cursor: pointer;
    width: fit-content;
  }

  .flightresultcard-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    position: relative;
    width: fit-content;
  }

  .airline-logo {
    width: 48px;
    height: 48px;
    background-color: #eee;
    border-radius: 6px;
    margin-right: 12px;
  }

  .airline-info {
    flex: 1;
  }

  .airline-name {
    font-weight: bold;
    font-size: 15px;
  }

  .flight-code {
    font-size: 13px;
    color: #777;
  }

  .flight-time {
    flex: 1;
    text-align: center;
  }

  .time {
    font-size: 16px;
    font-weight: bold;
  }

  .duration {
    font-size: 12px;
    color: #555;
  }

  .location {
    flex: 1;
    text-align: center;
    font-size: 13px;
  }

  .fare-section {
    flex: 1;
    text-align: right;
  }

  .original-price {
    font-size: 13px;
    color: red;
    text-decoration: line-through;
  }

  .final-price {
    font-size: 18px;
    font-weight: bold;
    color: green;
  }

  .book-btn {
    margin-top: 4px;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    background: #03c04a;
    color: #fff;
    cursor: pointer;
  }

  .flightresultcard-bottom {
    border-top: 1px solid #ddd;
    background: #f9f9f9;
    padding: 12px;
  }

  .tabs {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .tab {
    padding: 5px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    font-size: 12px;
  }

  .tab.selected {
    background: #d6faff;
    border-color: #00bcd4;
  }

  .refundable {
    margin-left: auto;
    font-weight: bold;
    color: green;
    font-size: 12px;
  }

  .fees-wrapper {
    display: flex;
    gap: 24px;
    font-size: 13px;
  }

  .fees-section,
  .policy-section {
    flex: 1;
  }

  .row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
  }

  strong {
    display: block;
    margin: 8px 0 4px;
    font-size: 13px;
  }
</style> -->

<script lang="ts">
  export let offer: FlightOffer;

  // State to toggle reveal
  let isRevealed = false;

  // Helper function to format money
  function formatMoney(money: {
    currencyCode: string;
    units: number;
    nanos: number;
  }) {
    return `${money.currencyCode} ${money.units}.${(money.nanos / 1000000000).toFixed(2)}`;
  }

  // Helper function to format time
  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Helper function to calculate total duration in hours and minutes
  function formatDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  // Calculate total layover time (simplified for one segment)
  function getLayoverDuration(
    legs: { departureTime: string; arrivalTime: string }[]
  ) {
    let totalLayover = 0;
    for (let i = 0; i < legs.length - 1; i++) {
      const depTime = new Date(legs[i].arrivalTime).getTime();
      const arrTime = new Date(legs[i + 1].departureTime).getTime();
      totalLayover += (arrTime - depTime) / 1000; // Convert to seconds
    }
    return totalLayover > 0 ? formatDuration(totalLayover) : "None";
  }
</script>

<div class="flight-card" on:click={() => (isRevealed = !isRevealed)}>
  <!-- Summary Section (Always Visible) -->
  <div class="summary">
    <div class="airline-info">
      <img
        src={offer.segments[0].legs[0].carriersData[0].logo}
        alt="Airline Logo"
        class="logo"
      />
      <span
        >{offer.segments[0].legs[0].carriersData[0].name}
        {offer.segments[0].legs[0].flightInfo.flightNumber}</span
      >
    </div>
    <div class="flight-times">
      <span>{formatTime(offer.segments[0].departureTime)}</span>
      <span class="duration">{formatDuration(offer.segments[0].totalTime)}</span
      >
      <span>{formatTime(offer.segments[0].arrivalTime)}</span>
    </div>
    <div class="route">
      <span>{offer.segments[0].departureAirport.cityName}</span>
      <span
        >{offer.segments.length > 1
          ? `${offer.segments.length - 1} stop`
          : "Direct"}</span
      >
      <span>{offer.segments[0].arrivalAirport.cityName}</span>
    </div>
    <div class="price">
      <span>{formatMoney(offer.priceBreakdown.total)}</span>
      <span class="discount">Rs. 276 Discount Applied</span>
    </div>
    <button class="book-btn">BOOK NOW</button>
  </div>

  <!-- Revealed Section (Conditional) -->
  {#if isRevealed}
    <div class="details">
      <div class="segment">
        {#each offer.segments as segment, index}
          <div class="leg">
            <div class="route-info">
              <span
                >{segment.departureAirport.cityName} ({segment.departureAirport
                  .code})</span
              >
              <span>{formatTime(segment.departureTime)}</span>
            </div>
            <div class="layover">
              <span>{formatDuration(segment.totalTime)}</span>
              {#if index < offer.segments.length - 1}
                <span>Layover: {getLayoverDuration(segment.legs)}</span>
              {/if}
            </div>
            <div class="route-info">
              <span
                >{segment.arrivalAirport.cityName} ({segment.arrivalAirport
                  .code})</span
              >
              <span>{formatTime(segment.arrivalTime)}</span>
            </div>
          </div>
        {/each}
      </div>
      <div class="fare-info">
        <h4>Fare Details & Rules</h4>
        <p>Fare Name: {offer.brandedFareInfo.fareName}</p>
        <p>Cabin Class: {offer.brandedFareInfo.cabinClass}</p>
        {#each offer.brandedFareInfo.features as feature}
          <p>{feature.label} - {feature.availability}</p>
        {/each}
      </div>
      <div class="baggage-info">
        <h4>Baggage Information</h4>
        {#each offer.includedProducts.segments[0] as baggage}
          <p>
            {baggage.luggageType}: {baggage.maxPiece} piece(s), Max Weight: {baggage.maxWeightPerPiece ||
              baggage.maxTotalWeight}
            {baggage.massUnit}
          </p>
        {/each}
      </div>
      <div class="cancellation-info">
        <h4>Cancellation & Change Rule</h4>
        {#each offer.fareRules[0].availablePolicies as policy}
          <p>{policy.type}: {formatMoney(policy.priceBreakdown.total)}</p>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .flight-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    margin: 10px 0;
    overflow: hidden;
    cursor: pointer;
    background-color: #fff;
  }

  .summary {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .airline-info {
    display: flex;
    align-items: center;
  }

  .logo {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  .flight-times {
    text-align: center;
  }

  .duration {
    display: block;
    color: #666;
  }

  .route {
    text-align: center;
  }

  .price {
    text-align: right;
  }

  .discount {
    color: green;
    font-size: 0.9em;
  }

  .book-btn {
    background-color: #00aaff;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
  }

  .details {
    padding: 15px;
    background-color: #f9f9f9;
    border-top: 1px solid #ccc;
  }

  .segment {
    margin-bottom: 15px;
  }

  .leg {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }

  .route-info {
    text-align: center;
  }

  .layover {
    text-align: center;
    color: #ff0000;
  }

  h4 {
    margin-top: 0;
    font-size: 1.1em;
  }

  p {
    margin: 5px 0;
  }
</style>
