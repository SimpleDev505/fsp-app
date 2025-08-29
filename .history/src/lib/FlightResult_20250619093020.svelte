<script lang="ts">
  import { prop, state } from "svelte";
  import type {
    FlightSegment,
    FareInfo,
    BaggageInfo,
    CancelRule,
  } from "../types";

  const flightSegments = prop<FlightSegment[]>(); // DEL → HYD → BOM
  const price = prop<number>();
  const originalPrice = prop<number>();
  const discountLabel = prop<string>();
  const fareInfo = prop<FareInfo>();
  const baggageInfo = prop<BaggageInfo[]>();
  const cancelRules = prop<CancelRule>();
  const departureTime = prop<string>();
  const arrivalTime = prop<string>();
  const fromCity = prop<string>();
  const toCity = prop<string>();
  const duration = prop<string>();

  const activeTab = state("info");

  const tabs = [
    { key: "info", label: "Flight Information" },
    { key: "fare", label: "Fare Details & Rules" },
    { key: "baggage", label: "Baggage Information" },
    { key: "cancel", label: "Cancellation & Change Rule" },
  ];
</script>

<div class="flight-card">
  <!-- Flight Overview Header -->
  <div class="header">
    <div class="flight-brand">
      <img src="/airline-logo.png" alt="Airline Logo" class="logo" />
      <div>
        <div class="brand">IndiGo</div>
        <div class="flight-code">6E - 382</div>
      </div>
    </div>
    <div class="time-block">
      <div class="big">{departureTime}</div>
      <div class="small">{fromCity}</div>
    </div>
    <div class="duration">
      <div>{duration}</div>
      <div class="stop-text">1 stop</div>
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

  <!-- Tabs -->
  <div class="tabs">
    {#each tabs as tab}
      <button
        class:active-tab={activeTab === tab.key}
        on:click={() => (activeTab = tab.key)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    {#if activeTab === "info"}
      <!-- Flight Info Content -->
      <!-- Loop segments like DEL > HYD > BOM -->
      {#each flightSegments as seg}
        <div class="segment">
          <div class="seg-line">
            <div class="airline">IndiGo {seg.flightCode}</div>
            <div>{seg.departureTime} — {seg.arrivalTime}</div>
          </div>
          <div class="seg-location">
            {seg.from} → {seg.to}
          </div>
          <div class="seg-duration">⏱ {seg.duration}</div>
        </div>
      {/each}
    {:else if activeTab === "fare"}
      <!-- Fare Details Content -->
      <div class="fare-details">
        <div>Base Fare: ₹{fareInfo.baseFare}</div>
        <div>Tax: ₹{fareInfo.tax}</div>
        <div>Total: ₹{fareInfo.total}</div>
        <!-- Rules Table -->
        <div class="rules">
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
      </div>
    {:else if activeTab === "baggage"}
      <!-- Baggage Info Content -->
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
      <!-- Cancellation Rules -->
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
    overflow: hidden;
    background-color: #fff;
    font-family: sans-serif;
  }
  .header {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #eee;
    gap: 12px;
  }
  .flight-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .flight-brand .logo {
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
    text-align: center;
    flex: 1;
  }
  .time-block .big {
    font-size: 18px;
    font-weight: bold;
  }
  .time-block .small {
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
  }
  .tabs button {
    border: none;
    padding: 6px 14px;
    border-radius: 999px;
    background-color: #fff;
    cursor: pointer;
    font-weight: bold;
  }
  .tabs button.active-tab {
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
  .rule-block .title {
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
