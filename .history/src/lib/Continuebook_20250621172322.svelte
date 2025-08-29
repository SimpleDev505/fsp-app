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
    <span style="font-size: var(--font-lg); font-weight: bold;">SUMMARY</span>
    <hr style="border-width: 2px; width:100%;text-align:left;margin-left:0" />
    {#if flight}
      <div class="summary-card">
        <div class="summary-top">
          <img
            src="/airline-default.png"
            alt="Airline Logo"
            class="airline-logo"
          />

          <div class="flight-details">
            <strong>
              <span class="material-symbols-outlined icon">flight</span>
              {flight.airlineCode}
              {flight.flightNumber}
            </strong>
            <div class="sub-info">
              <span class="material-symbols-outlined icon">airlines</span>
              Aircraft: {flight.aircraftCode}
            </div>
          </div>

          <div class="price-section">
            <div class="price">
              <span class="material-symbols-outlined icon">payments</span>
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
                <span class="material-symbols-outlined icon"
                  >travel_explore</span
                >
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
  </div>
</div>

<style>
  /* Booking */
  .summary-card {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1rem;
    background: #fff;
    margin: 1rem 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .airline-logo {
    width: 40px;
    height: 40px;
    margin-right: 1rem;
  }

  .flight-info {
    flex: 1;
  }

  .price-block {
    text-align: right;
  }

  .route-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .route-point,
  .duration-center {
    text-align: center;
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
    padding-top: 100px;
    justify-content: flex-start;
    align-items: center;
    width: 40em;
    height: 100%;
    background-color: white;
    row-gap: 15px;
  }
</style>
