<script lang="ts">
  import {
    Current_SearchFilter,
    FlightSearchResults,
    SelectedFlight,
    type BaggageInfo,
    type TravelerInfo,
  } from "./Store/store";
  import { derived, get } from "svelte/store";

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
    <div class="summary-card"></div>
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
