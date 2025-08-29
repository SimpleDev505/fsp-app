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

<!-- FlightResult.svelte -->
<script lang="ts">
  import type { FlightOffer } from "./Store/search";

  interface Props {
    flightOffer: FlightOffer;
    originalPrice?: number;
    discount?: number;
    discountText?: string;
  }

  const { flightOffer, originalPrice, discount, discountText }: Props =
    $props();

  // Helper functions
  function formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
  }

  function formatPrice(money: any): string {
    const totalPrice = money.units + money.nanos / 1000000000;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: money.currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(totalPrice)
      .replace("INR", "₹");
  }

  function getStopsText(segments: any[]): string {
    const totalStops = segments.reduce(
      (acc, segment) => acc + (segment.legs?.length - 1 || 0),
      0
    );
    return totalStops === 0
      ? "Non-stop"
      : `${totalStops} stop${totalStops > 1 ? "s" : ""}`;
  }

  function calculateLayoverTime(segments: any[]): string {
    if (segments.length < 2) return "";
    const firstArrival = new Date(segments[0].arrivalTime);
    const secondDeparture = new Date(segments[1].departureTime);
    const layoverMinutes = Math.floor(
      (secondDeparture.getTime() - firstArrival.getTime()) / (1000 * 60)
    );
    const hours = Math.floor(layoverMinutes / 60);
    const minutes = layoverMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  // Get primary carrier info
  const primaryCarrier = flightOffer.segments[0]?.legs[0]?.carriersData[0];
  const flightNumber =
    flightOffer.segments[0]?.legs[0]?.flightInfo?.flightNumber;

  // Calculate total journey time
  const firstDeparture = flightOffer.segments[0]?.departureTime;
  const lastArrival =
    flightOffer.segments[flightOffer.segments.length - 1]?.arrivalTime;
  const totalJourneyMinutes =
    firstDeparture && lastArrival
      ? Math.floor(
          (new Date(lastArrival).getTime() -
            new Date(firstDeparture).getTime()) /
            (1000 * 60)
        )
      : 0;
  let isDetailsVisible = $state(false);
  let activeTab = $state("flight-info");
  function toggleDetails() {
    isDetailsVisible = !isDetailsVisible;
  }
  function switchTab(tabId: string) {
    activeTab = tabId;
  }
</script>

<div class="flight-card">
  <!-- Header with airline info and price -->
  <div class="flight-header" onclick={toggleDetails}>
    <div class="airline-info">
      <img
        src={primaryCarrier?.logo}
        alt={primaryCarrier?.name}
        class="airline-logo"
      />
      <div class="airline-details">
        <span class="airline-name">{primaryCarrier?.name}</span>
        <span class="flight-code">{primaryCarrier?.code}-{flightNumber}</span>
      </div>
    </div>

    <div class="journey-overview">
      <span class="departure-time">{formatTime(firstDeparture || "")}</span>
      <div class="journey-info">
        <span class="duration">{formatDuration(totalJourneyMinutes)}</span>
        <span class="stops">{getStopsText(flightOffer.segments)}</span>
      </div>
      <span class="arrival-time">{formatTime(lastArrival || "")}</span>
    </div>

    <div class="price-section">
      {#if originalPrice && discount}
        <span class="original-price">₹{originalPrice.toLocaleString()}</span>
      {/if}
      <span class="current-price"
        >{formatPrice(flightOffer.priceBreakdown.total)}</span
      >
      {#if discountText}
        <span class="discount-text">{discountText}</span>
      {/if}
      <button class="book-btn">BOOK NOW</button>
      <button class="more-fare-btn">+ More Fare</button>
      <div class="toggle-arrow" class:rotated={isDetailsVisible}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </div>
    </div>
  </div>

  <!-- Flight Details Section -->
  {#if isDetailsVisible}
    <div class="flight-details">
      <div class="tabs">
        <button
          class="tab"
          class:active={activeTab === "flight-info"}
          onclick={() => switchTab("flight-info")}
        >
          Flight Information
        </button>
        <button
          class="tab"
          class:active={activeTab === "fare-details"}
          onclick={() => switchTab("fare-details")}
        >
          Fare Details & Rules
        </button>
        <button
          class="tab"
          class:active={activeTab === "baggage-info"}
          onclick={() => switchTab("baggage-info")}
        >
          Baggage Information
        </button>
        <button
          class="tab"
          class:active={activeTab === "cancellation-rules"}
          onclick={() => switchTab("cancellation-rules")}
        >
          Cancellation & Change Rule
        </button>
      </div>
      <div class="tab-content">
        {#if activeTab === "flight-info"}
          <!-- Flight Information Content -->
          <table class="flight-table">
            <tbody>
              {#each flightOffer.segments as segment, i}
                <tr class="segment-row">
                  <td class="route-info">
                    <strong
                      >{segment.departureAirport.code} → {segment.arrivalAirport
                        .code}</strong
                    >
                  </td>
                  <td colspan="3"></td>
                </tr>

                {#each segment.legs as leg, j}
                  <tr class="leg-row">
                    <td class="airline-cell">
                      <img
                        src={leg.carriersData[0]?.logo}
                        alt={leg.carriersData[0]?.name}
                        class="small-airline-logo"
                      />
                      <div class="leg-airline-info">
                        <span class="leg-airline-name"
                          >{leg.carriersData[0]?.name}</span
                        >
                        <span class="leg-flight-code"
                          >{leg.carriersData[0]?.code}-{leg.flightInfo
                            .flightNumber}</span
                        >
                        <span class="cabin-class">({leg.cabinClass})</span>
                      </div>
                    </td>

                    <td class="time-cell">
                      <div class="departure-info">
                        <strong>{formatTime(leg.departureTime)}</strong>
                        <div class="airport-info">
                          <span class="city"
                            >{leg.departureAirport.cityName} ({leg
                              .departureAirport.code})</span
                          >
                          <span class="date"
                            >{new Date(leg.departureTime).toLocaleDateString(
                              "en-GB",
                              {
                                weekday: "short",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}</span
                          >
                          {#if leg.departureTerminal}
                            <span class="terminal"
                              >Terminal - {leg.departureTerminal}</span
                            >
                          {/if}
                        </div>
                      </div>
                    </td>

                    <td class="duration-cell">
                      <div class="flight-duration">
                        <span class="duration-time"
                          >{formatDuration(
                            Math.floor(leg.totalTime / 60)
                          )}</span
                        >
                      </div>
                    </td>

                    <td class="time-cell">
                      <div class="arrival-info">
                        <strong>{formatTime(leg.arrivalTime)}</strong>
                        <div class="airport-info">
                          <span class="city"
                            >{leg.arrivalAirport.cityName} ({leg.arrivalAirport
                              .code})</span
                          >
                          <span class="date"
                            >{new Date(leg.arrivalTime).toLocaleDateString(
                              "en-GB",
                              {
                                weekday: "short",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}</span
                          >
                          {#if leg.arrivalTerminal}
                            <span class="terminal"
                              >Terminal - {leg.arrivalTerminal}</span
                            >
                          {/if}
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Layover info if not the last leg -->
                  {#if j < segment.legs.length - 1}
                    <tr class="layover-row">
                      <td colspan="4">
                        <div class="layover-info">
                          <span class="layover-text"
                            >LAYOVER: {calculateLayoverTime([
                              segment.legs[j],
                              segment.legs[j + 1],
                            ])}</span
                          >
                        </div>
                      </td>
                    </tr>
                  {/if}
                {/each}

                <!-- Inter-segment layover -->
                {#if i < flightOffer.segments.length - 1}
                  <tr class="inter-segment-layover">
                    <td colspan="4">
                      <div class="layover-info">
                        <span class="layover-text">
                          LAYOVER: {calculateLayoverTime([
                            flightOffer.segments[i],
                            flightOffer.segments[i + 1],
                          ])}
                        </span>
                      </div>
                    </td>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        {:else if activeTab === "fare-details"}
          <!-- ADD THIS: Fare Details Content -->
          <div class="tab-content-section">
            <div class="fare-breakdown">
              <h4>Fare Breakdown</h4>
              <div class="fare-item">
                <span>Base Fare:</span>
                <span>{formatPrice(flightOffer.priceBreakdown.baseFare)}</span>
              </div>
              <div class="fare-item">
                <span>Taxes & Fees:</span>
                <span>{formatPrice(flightOffer.priceBreakdown.tax)}</span>
              </div>
              <div class="fare-item total">
                <span>Total Amount:</span>
                <span>{formatPrice(flightOffer.priceBreakdown.total)}</span>
              </div>
            </div>
            <div class="fare-rules">
              <h4>Fare Rules</h4>
              <ul>
                <li>This is a special fare and is non-refundable</li>
                <li>Date change charges may apply</li>
                <li>Fare is subject to availability</li>
                <li>Additional charges may apply for seat selection</li>
              </ul>
            </div>
          </div>
        {:else if activeTab === "baggage-info"}
          <!-- ADD THIS: Baggage Information Content -->
          <div class="tab-content-section">
            <div class="baggage-info">
              <h4>Baggage Policy</h4>
              <div class="baggage-section">
                <h5>Cabin Baggage</h5>
                <p>7 kg (1 piece only) - 55 cm x 35 cm x 25 cm</p>
              </div>
              <div class="baggage-section">
                <h5>Check-in Baggage</h5>
                <p>15 kg (1 piece only) - Total dimensions: 158 cm</p>
              </div>
              <div class="baggage-note">
                <p>
                  <strong>Note:</strong> Extra baggage charges will apply for excess
                  weight/pieces
                </p>
              </div>
            </div>
          </div>
        {:else if activeTab === "cancellation-rules"}
          <!-- ADD THIS: Cancellation Rules Content -->
          <div class="tab-content-section">
            <div class="cancellation-info">
              <h4>Cancellation & Change Rules</h4>
              <div class="rule-section">
                <h5>Cancellation Charges</h5>
                <ul>
                  <li>0-2 hours before departure: Non-refundable</li>
                  <li>2-24 hours before departure: ₹3,000 + Airline charges</li>
                  <li>24+ hours before departure: ₹2,500 + Airline charges</li>
                </ul>
              </div>
              <div class="rule-section">
                <h5>Change/Rescheduling Charges</h5>
                <ul>
                  <li>
                    0-2 hours before departure: ₹2,500 + Fare difference +
                    Airline charges
                  </li>
                  <li>
                    2+ hours before departure: ₹2,000 + Fare difference +
                    Airline charges
                  </li>
                </ul>
              </div>
              <div class="rule-note">
                <p>
                  <strong>Note:</strong> All charges are per passenger per sector.
                  Airline charges are additional and vary by airline.
                </p>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .flight-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    gap: 20px;
    cursor: pointer; /* ADD THIS */
    transition: background-color 0.2s; /* ADD THIS */
  }

  .flight-header:hover {
    background-color: #f8f9fa; /* ADD THIS */
  }

  /* ADD THIS: Toggle arrow styles */
  .toggle-arrow {
    margin-left: 12px;
    color: #666;
    transition: transform 0.3s ease;
  }

  .toggle-arrow.rotated {
    transform: rotate(180deg);
  }

  /* ADD THIS: Tab content section styles */
  .tab-content-section {
    padding: 20px;
  }

  .fare-breakdown,
  .baggage-info,
  .cancellation-info {
    max-width: 800px;
  }

  .fare-breakdown h4,
  .baggage-info h4,
  .cancellation-info h4 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 16px;
    font-weight: 600;
  }

  .fare-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .fare-item.total {
    font-weight: 600;
    border-bottom: 2px solid #333;
    margin-top: 8px;
  }

  .fare-rules,
  .baggage-section,
  .rule-section {
    margin-top: 20px;
  }

  .fare-rules h4,
  .baggage-section h5,
  .rule-section h5 {
    margin: 0 0 12px 0;
    color: #333;
    font-size: 14px;
    font-weight: 600;
  }

  .fare-rules ul,
  .rule-section ul {
    margin: 0;
    padding-left: 20px;
  }

  .fare-rules li,
  .rule-section li {
    margin-bottom: 8px;
    color: #666;
    font-size: 14px;
  }

  .baggage-section p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }

  .baggage-note,
  .rule-note {
    margin-top: 16px;
    padding: 12px;
    background: #f8f9fa;
    border-left: 4px solid #1a73e8;
    border-radius: 4px;
  }

  .baggage-note p,
  .rule-note p {
    margin: 0;
    font-size: 13px;
    color: #666;
  }

  /* All other existing styles remain exactly the same */
  .flight-card {
    border: 1px solid #e0e6ed;
    border-radius: 8px;
    background: white;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .airline-info {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 120px;
  }

  .airline-logo {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }

  .airline-details {
    display: flex;
    flex-direction: column;
  }

  .airline-name {
    font-weight: 600;
    font-size: 14px;
    color: #1a73e8;
  }

  .flight-code {
    font-size: 12px;
    color: #666;
  }

  .journey-overview {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
  }

  .departure-time,
  .arrival-time {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .journey-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .duration {
    font-size: 12px;
    color: var(--grey-dark);
  }

  .stops {
    font-size: 12px;
    color: var(--grey-dark);
  }

  .price-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .original-price {
    font-size: 12px;
    color: var(--grey-dark);
    text-decoration: line-through;
  }

  .current-price {
    font-size: 20px;
    font-weight: 700;
    color: var(--red);
  }

  .discount-text {
    font-size: 11px;
    color: var(--green);
    background: #e8f5e8;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .book-btn {
    background: var(--red);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 4px;
  }

  .book-btn:hover {
    background: var(--red);
  }

  .more-fare-btn {
    background: none;
    border: 1px solid var(--blue);
    color: var(--blue);
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    margin-top: 4px;
  }

  .more-fare-btn:hover {
    background: #f8f9fa;
  }

  .flight-details {
    padding: 0;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
  }

  .tab {
    background: none;
    border: none;
    padding: 12px 20px;
    cursor: pointer;
    font-size: 14px;
    border-bottom: 2px solid transparent;
    color: var(--grey-dark);
  }

  .tab.active {
    color: var(--blue);
    border-bottom-color: var(--blue-dark);
    background: #f8f9fa;
    font-weight: 500;
  }

  .tab:hover:not(.active) {
    background: #f5f5f5;
  }

  .tab-content {
    padding: 0;
  }

  .flight-table {
    width: 100%;
    border-collapse: collapse;
  }

  .segment-row td {
    padding: 12px 20px 8px;
    border-bottom: none;
    font-size: 14px;
    color: var(--grey-dark);
  }

  .leg-row td {
    padding: 12px 20px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: top;
  }

  .airline-cell {
    width: 200px;
  }

  .small-airline-logo {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    margin-right: 8px;
    float: left;
  }

  .leg-airline-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .leg-airline-name {
    font-weight: 500;
    font-size: 13px;
    color: var(--grey-dark);
  }

  .leg-flight-code {
    font-size: 12px;
    color: var(--grey-dark);
  }

  .cabin-class {
    font-size: 11px;
    color: var(--grey-dark);
  }

  .time-cell {
    width: 200px;
  }

  .departure-info,
  .arrival-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .departure-info strong,
  .arrival-info strong {
    font-size: 16px;
    color: var(--grey-dark);
  }

  .airport-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .city {
    font-size: 12px;
    color: var(--grey-dark);
  }

  .date {
    font-size: 11px;
    color: var(--grey-dark);
  }

  .terminal {
    font-size: 11px;
    color: var(--grey-dark);
  }

  .duration-cell {
    text-align: center;
    width: 100px;
  }

  .flight-duration {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .duration-time {
    font-size: 12px;
    color: var(--grey-dark);
  }

  .layover-row td,
  .inter-segment-layover td {
    padding: 8px 20px;
    text-align: center;
    background: #fff8f0;
    border-bottom: 1px solid #f0f0f0;
  }

  .layover-info {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .layover-text {
    font-size: 12px;
    color: var(--blue);
    font-weight: 600;
    padding: 4px 12px;
    background: white;
    border: 1px solid var(--blue);
    border-radius: 12px;
  }
</style>
