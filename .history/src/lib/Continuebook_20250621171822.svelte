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
        <div class="summary-header">
          <img
            src="/airline-default.png"
            alt="Airline Logo"
            class="airline-logo"
          />
          <div class="flight-info">
            <div class="flight-number">
              <strong>{flight.airlineCode} {flight.flightNumber}</strong>
            </div>
            <div class="aircraft">Aircraft: {flight.aircraftCode}</div>
          </div>
          <div class="price-block">
            <div class="price">
              ₹{flight.price.total}
              {flight.price.currency}
            </div>
            <div class="base-price">Base: ₹{flight.price.base}</div>
          </div>
        </div>

        <div class="summary-body">
          <div class="route-info">
            <div class="route-point">
              <div class="time">{flight.from.dateTime.slice(11, 16)}</div>
              <div class="location">{flight.from.iataCode}</div>
              <div class="terminal">
                Terminal: {flight.from.terminal ?? "N/A"}
              </div>
            </div>

            <div class="duration-center">
              <div class="duration">
                {flight.duration.replace("PT", "").toLowerCase()}
              </div>
              <div class="stops">
                {flight.isNonStop
                  ? "Non-stop"
                  : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
              </div>
            </div>

            <div class="route-point">
              <div class="time">{flight.to.dateTime.slice(11, 16)}</div>
              <div class="location">{flight.to.iataCode}</div>
              <div class="terminal">
                Terminal: {flight.to.terminal ?? "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Booking */
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
