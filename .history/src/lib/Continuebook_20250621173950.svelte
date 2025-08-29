<script lang="ts">
  import {
    SelectedFlight,
    type BaggageInfo,
    type TravelerInfo,
  } from "./Store/store";
  let flight = $derived($SelectedFlight);

  function updateTravelerAndBaggageDetails(
    travelers: TravelerInfo[],
    baggageOverrides: BaggageInfo[]
  ) {
    SelectedFlight.update((flight) => {
      if (!flight) return flight;

      flight.passengers = travelers.map((trav) => ({
        travelerType: trav.travelerType,
        count: 1,
        fareOption: "STANDARD",
        brandedFare: flight.passengers[0]?.brandedFare ?? "",
        cabinClass: flight.passengers[0]?.cabinClass ?? "",

        baggage: {
          cabinBag:
            baggageOverrides.find((b) => b.type === "Cabin") ?? undefined,
          checkinBag:
            baggageOverrides.find((b) => b.type === "Check-in") ?? undefined,
        },
      }));

      return flight;
    });
  }
</script>

<div class="book-flight">
  <div class="book-flight-overlay"></div>
  <div class="book-flight-summary">
    <span style="font-size: var(--font-lg); font-weight: bold;margin-top:15px;"
      >SUMMARY</span
    >
    <hr style="border-width: 2px; width:100%;text-align:left;margin-left:0" />
    {#if flight}
      <div class="summary-card">
        <h4 style="margin: 0; font-size: var(--font-lg); color:var(--blue);">
          Summary
        </h4>
        <hr style="width:100%;text-align:left;margin-left:0" />
        <div class="summary-top">
          <img
            src="/airline-default.png"
            alt="Airline Logo"
            class="airline-logo"
          />

          <div class="flight-details">
            <strong>
              <span class="material-symbols-outlined icon">flight</span>
              {flight.flightNumber}
            </strong>
            <div class="sub-info">
              <span class="material-symbols-outlined icon">airlines</span>
              Aircraft: {flight.aircraftCode}
            </div>
          </div>

          <div class="price-section">
            <div class="price">
              <!-- <span class="material-symbols-outlined icon">payments</span> -->
              ₹{flight.price.total}
              {flight.price.currency}
            </div>
            <div class="base-price">
              Base: ₹{flight.price.base}
            </div>
          </div>
        </div>

        <div class="summary-bottom">
          <div class="flight-time">
            <div class="time-block">
              <span class="time">{flight.from.dateTime.slice(11, 16)}</span>
              <div>{flight.from.iataCode}</div>
              <small>Terminal: {flight.from.terminal ?? "N/A"}</small>
            </div>

            <div class="middle-block">
              <div class="duration">
                <span class="material-symbols-outlined icon">schedule</span>
                {flight.duration.replace("PT", "").toLowerCase()}
              </div>
              <div class="stops">
                {flight.isNonStop
                  ? "Non-stop"
                  : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
              </div>
            </div>

            <div class="time-block">
              <span class="time">{flight.to.dateTime.slice(11, 16)}</span>
              <div>{flight.to.iataCode}</div>
              <small>Terminal: {flight.to.terminal ?? "N/A"}</small>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Travellers Details -->
    <div class="traveller-detail">
      <label for="traveller-name">Name:</label>
      <input id="traveller-name" placeholder="Name" type="text" />
      <label for="traveller-name">Email:</label>
      <input placeholder="Email" type="email" />
      <label for="traveller-name">Phone Number:</label>
      <input placeholder="Phone Number" type="tel" />
    </div>
  </div>
</div>

<style>
  /* Travellers */
  .traveller-detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    row-gap: 12px;
    outline: 2px solid var(--grey-light);
    padding: 3em;
  }
  .traveller-detail input {
    border: 1px solid var(--grey-light);
    padding: 1em;
    border-radius: 8px;
  }
  .traveller-detail label {
    font-size: var(--font-s);
    color: var(--grey-dark);
  }
  /* Booking */

  .flight-time {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }
  .summary-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1rem;
    background: #fff;
    margin: 1rem 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .airline-logo {
    width: 40px;
    height: 40px;
    margin-right: 1rem;
  }
  .summary-card {
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 1rem;
    width: fit-content;
    font-family: "Segoe UI", sans-serif;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .summary-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .airline-logo {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }

  .flight-details {
    flex: 1;
  }

  .flight-details strong {
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .sub-info {
    font-size: 0.85rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .price-section {
    text-align: right;
    font-size: 0.9rem;
  }

  .price {
    color: #2d9c3b;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .base-price {
    color: #999;
    font-size: 0.85rem;
  }

  .summary-bottom {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    text-align: center;
    gap: 2rem;
  }

  .time-block {
    font-size: 0.9rem;
  }

  .time {
    font-weight: bold;
    font-size: 1.1rem;
    display: block;
  }

  .middle-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    font-size: 0.9rem;
    color: #333;
  }

  .icon {
    font-size: 1rem;
    vertical-align: middle;
  }
  .book-flight {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100vh;
    z-index: 1001;
  }
  .book-flight-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
  }
  .book-flight-summary {
    display: flex;
    flex-direction: column;
    padding-top: 50px;
    justify-content: flex-start;
    align-items: center;
    width: 40em;
    height: 100%;
    background-color: white;
    row-gap: 15px;
  }
</style>
