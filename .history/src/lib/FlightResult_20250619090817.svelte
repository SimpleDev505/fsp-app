<script lang="ts">
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

<div class="card">
  <div class="card-top" on:click={toggleReveal}>
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
    <div class="card-bottom">
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
          <div>Adult X1</div>
          <div>Children X0</div>
          <div>Infants X0</div>
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
  .card {
    border: 1px solid #ccc;
    border-radius: 8px;
    margin: 12px;
    overflow: hidden;
    font-family: sans-serif;
    background: #fff;
    cursor: pointer;
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    position: relative;
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

  .card-bottom {
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
</style>
