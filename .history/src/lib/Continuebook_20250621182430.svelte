<script lang="ts">
  import Dropdownmenu from "./dropdownmenu.svelte";
import {
    SelectedFlight,
    type BaggageInfo,
    type MenuItem,
    type TravelerInfo,
  } from "./Store/store";
  let flight = $derived($SelectedFlight);
  type Travellers = {
    adult: number;
    children: number;
    infant: number;
  };
  let travellercount: Travellers = $state({
    adult: 1,
    children: 0,
    infant: 0,
  });
  let total_travellercount = $derived(
    travellercount.adult + travellercount.children + travellercount.infant
  );
  let current_dropdown : MenuItem[] = [];
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
    <hr
      style="margin: 0; border-width: 2px; width:100%;text-align:left;margin-left:0"
    />
    {#if flight}
      <div class="summary-card">
        <h4 style="margin: 0; font-size: var(--font-lg); color:var(--blue);">
          FLIGHT INFO
        </h4>
        <hr style=" width:100%;text-align:left;margin-left:0" />
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
    <div class="traveller-counter">
      <span
        style=" text-align:center; width:100%; font-size: var(--font-lg); color: var(--blue); font-weight: bold;"
        >TRAVELLER DETAILS</span
      >
      <div style="width: fit-content; height: fit-content;">
        <button onclick={() => (travellercount.adult += 1)}>Adult +</button>
        <button onclick={() => (travellercount.children += 1)}>Child +</button>
        <button onclick={() => (travellercount.infant += 1)}>Infant +</button>
      </div>
      <div style="width: fit-content; height: fit-content;">
        <button
          onclick={() => {
            if (travellercount.adult >= 2) {
              travellercount.adult -= 1;
            }
          }}>Adult -</button
        >
        <button onclick={() => (travellercount.children -= 1)}>Child -</button>
        <button onclick={() => (travellercount.infant -= 1)}>Infant -</button>
      </div>
    </div>
    <div class="traveller-detail-cnt">
      <div class="traveller-detail">
        <span
          style=" text-align:center; width:100%; font-size: var(--font-lg); color: var(--blue); font-weight: bold;"
          >ADULT</span
        >
        <Dropdownmenu leftpx={0} rightpx={0} items={}></Dropdownmenu>
        <label for="traveller-name">Name:</label>
        <input id="traveller-name" placeholder="Name" type="text" />
        <label for="traveller-name">Email:</label>
        <input placeholder="Email" type="email" />
        <label for="traveller-name">Phone Number:</label>
        <input placeholder="Phone Number" type="tel" />
      </div>
      <button>Next</button>
    </div>
  </div>
</div>

<style>
  .traveller-detail-cnt {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 25em;
    padding-left: 10px;
    padding-right: 10px;
  }
  .traveller-detail-cnt button {
    border: none;
    background-color: white;
    font-weight: bold;
    border-radius: 4px;
    padding: 8px;
    color: var(--blue);
    position: absolute;
    outline: 2px solid var(--grey-light);
  }
  .traveller-detail-cnt button:hover {
    outline: 2px solid var(--blue-dark);
    cursor: pointer;
  }
  .traveller-counter {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    height: fit-content;
    padding: 10px;
    outline: 2px solid var(--grey-light);
    border-radius: 8px;
  }
  .traveller-counter button {
    border: none;
    box-shadow: none;
    background-color: var(--blue);
    padding: 5px;
    color: white;
    border-radius: 4px;
    font-weight: bold;
    white-space: nowrap;
    margin-top: 10px;
  }
  .traveller-counter button:hover {
    background-color: var(--blue-dark);
    cursor: pointer;
  }
  /* Travellers */
  .traveller-detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 8px;
    margin-top: 10px;
    outline: 2px solid var(--grey-light);
    padding: 1em;
    border-radius: 10px;
    margin-left: 5px;
    width: 100%;
    height: fit-content;
  }
  .traveller-detail input {
    border: 1px solid var(--grey-light);
    padding: 0.5em;
    border-radius: 4px;
    width: 100%;
  }
  .traveller-detail label {
    font-size: var(--font-s);
    color: var(--grey-dark);
    width: 100%;
    text-align: start;
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
    border: 1px solid var(--grey-light);
    border-radius: 10px;
    padding: 1rem;
    background: #fff;
    margin: 1rem 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    margin: 0;
  }

  .airline-logo {
    width: 40px;
    height: 40px;
    margin-right: 1rem;
  }
  .summary-card {
    border: 1px solid var(--grey-light);
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
    color: var(--grey-dark);
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .price-section {
    text-align: right;
    font-size: 0.9rem;
  }

  .price {
    color: var(--green);
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .base-price {
    color: var(--grey-dark);
    font-size: 0.85rem;
  }

  .summary-bottom {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    text-align: center;
    gap: 2rem;
    width: 100%;
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
    overflow: hidden;
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
    row-gap: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
