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
  const {
    flightSegments,
    price,
    originalPrice,
    discountLabel,
    fareInfo,
    baggageInfo,
    cancelRules,
    departureTime,
    arrivalTime,
    fromCity,
    toCity,
    duration,
  } = $props<{
    flightSegments: {
      flightCode: string;
      from: string;
      to: string;
      departureTime: string;
      arrivalTime: string;
      duration: string;
    }[];
    price: number;
    originalPrice: number;
    discountLabel: string;
    fareInfo: {
      baseFare: number;
      tax: number;
      total: number;
      rules: {
        title: string;
        entries: {
          label: string;
          airlineFee: number;
          emtFee: number;
        }[];
      }[];
    };
    baggageInfo: {
      airline: string;
      code: string;
      checkIn: string;
      cabin: string;
    }[];
    cancelRules: {
      rules: {
        title: string;
        entries: {
          label: string;
          airlineFee: number;
          emtFee: number;
        }[];
      }[];
    };
    departureTime: string;
    arrivalTime: string;
    fromCity: string;
    toCity: string;
    duration: string;
  }>();

  let activeTab = $state<"info" | "fare" | "baggage" | "cancel">("info");
</script>

<div class="flight-card">
  <div class="header">
    <div class="flight-brand">
      <img src="/airline-logo.png" alt="Airline Logo" class="logo" />
      <div>
        <div class="brand">IndiGo</div>
        <div class="flight-code">{flightSegments[0].flightCode}</div>
      </div>
    </div>
    <div class="time-block">
      <div class="big">{departureTime}</div>
      <div class="small">{fromCity}</div>
    </div>
    <div class="duration">
      <div>{duration}</div>
      <div class="stop-text">{flightSegments.length - 1} stop</div>
    </div>
    <div class="time-block">
      <div class="big">{arrivalTime}</div>
      <div class="small">{toCity}</div>
    </div>
    <div class="pricing">
      <div class="strike">₹{originalPrice}</div>
      <div class="final">₹{price}</div>
      <div class="discount">{discountLabel}</div>
      <button class="book">BOOK NOW</button>
    </div>
  </div>

  <div class="tabs">
    <button
      on:click={() => (activeTab = "info")}
      class:active-tab={activeTab === "info"}>Flight Information</button
    >
    <button
      on:click={() => (activeTab = "fare")}
      class:active-tab={activeTab === "fare"}>Fare Details & Rules</button
    >
    <button
      on:click={() => (activeTab = "baggage")}
      class:active-tab={activeTab === "baggage"}>Baggage Information</button
    >
    <button
      on:click={() => (activeTab = "cancel")}
      class:active-tab={activeTab === "cancel"}
      >Cancellation & Change Rule</button
    >
  </div>

  <div class="tab-content">
    {#if activeTab === "info"}
      {#each flightSegments as seg}
        <div class="segment">
          <div class="seg-line">
            <div class="airline">IndiGo {seg.flightCode}</div>
            <div>{seg.departureTime} — {seg.arrivalTime}</div>
          </div>
          <div class="seg-location">{seg.from} → {seg.to}</div>
          <div class="seg-duration">⏱ {seg.duration}</div>
        </div>
      {/each}
    {:else if activeTab === "fare"}
      <div class="fare-details">
        <div>Base Fare: ₹{fareInfo.baseFare}</div>
        <div>Tax: ₹{fareInfo.tax}</div>
        <div>Total: ₹{fareInfo.total}</div>
        {#each fareInfo.rules as rule}
          <div class="rule-block">
            <div class="title">{rule.title}</div>
            {#each rule.entries as r}
              <div class="entry">
                {r.label} → Airline Fee: ₹{r.airlineFee}, EMT Fee: ₹{r.emtFee}
              </div>
            {/each}
          </div>
        {/each}
      </div>
    {:else if activeTab === "baggage"}
      <table class="baggage-table">
        <thead>
          <tr><th>Airline</th><th>Check-in</th><th>Cabin</th></tr>
        </thead>
        <tbody>
          {#each baggageInfo as item}
            <tr>
              <td>{item.airline} ({item.code})</td>
              <td>{item.checkIn}</td>
              <td>{item.cabin}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else if activeTab === "cancel"}
      <div class="cancel-section">
        {#each cancelRules.rules as rule}
          <div class="rule-block">
            <div class="title">{rule.title}</div>
            {#each rule.entries as r}
              <div class="entry">
                {r.label} → Airline Fee: ₹{r.airlineFee}, EMT Fee: ₹{r.emtFee}
              </div>
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .flight-card {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #fff;
    font-family: sans-serif;
    overflow: hidden;
  }
  .header {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #eee;
    flex-wrap: wrap;
  }
  .flight-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo {
    width: 40px;
    height: 40px;
  }
  .brand {
    font-weight: bold;
  }
  .flight-code {
    font-size: 12px;
    color: gray;
  }
  .time-block {
    flex: 1;
    text-align: center;
  }
  .big {
    font-size: 18px;
    font-weight: bold;
  }
  .small {
    font-size: 14px;
    color: #555;
  }
  .duration {
    text-align: center;
    font-size: 14px;
  }
  .stop-text {
    font-size: 12px;
    color: #777;
  }
  .pricing {
    text-align: right;
  }
  .strike {
    text-decoration: line-through;
    font-size: 12px;
    color: gray;
  }
  .final {
    font-size: 20px;
    color: #d9534f;
    font-weight: bold;
  }
  .discount {
    font-size: 12px;
    color: green;
  }
  .book {
    margin-top: 6px;
    background-color: orange;
    border: none;
    padding: 6px 12px;
    color: white;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
  }
  .tabs {
    display: flex;
    gap: 10px;
    padding: 10px 16px;
    border-bottom: 1px solid #eee;
    background: #f5f5f5;
    flex-wrap: wrap;
  }
  .tabs button {
    border: none;
    padding: 6px 14px;
    border-radius: 999px;
    background-color: #fff;
    cursor: pointer;
    font-weight: bold;
  }
  .active-tab {
    background-color: #2196f3;
    color: white;
  }
  .tab-content {
    padding: 16px;
  }
  .segment {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }
  .seg-line {
    font-weight: bold;
  }
  .seg-location {
    font-size: 14px;
    margin-top: 2px;
  }
  .seg-duration {
    font-size: 12px;
    color: gray;
  }
  .fare-details {
    font-size: 14px;
    line-height: 1.6;
  }
  .rule-block {
    margin-top: 12px;
  }
  .title {
    font-weight: bold;
    margin-bottom: 4px;
  }
  .entry {
    font-size: 13px;
    margin-left: 10px;
  }
  .baggage-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .baggage-table th,
  .baggage-table td {
    border: 1px solid #ccc;
    padding: 6px;
  }
  .cancel-section {
    font-size: 14px;
  }
</style>
