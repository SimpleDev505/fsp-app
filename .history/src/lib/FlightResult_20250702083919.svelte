<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import {
    ContinueBooking,
    SelectedFlight,
    type SelectedFlightDetail,
  } from "./Store/store";
  import { SelectedFlightOffer, type FlightOffer } from "./Store/search";
  let {
    flight,
    staffview = false,
  }: { flight: FlightOffer; staffview?: boolean } = $props();
  $effect(() => {
    if (showDetails) {
      requestAnimationFrame(() => {
        gsap.fromTo(
          ".tab-headings > *",
          {
            opacity: 0,
          },
          {
            opacity: 1,
            stagger: 0.1,
            duration: 1,
          }
        );
        gsap.fromTo(
          ".tab-content > * > *",
          {
            opacity: 0,
          },
          {
            opacity: 1,
            stagger: 0.1,
            duration: 1,
          }
        );
      });
    }
  });
  let showDetails = $state(false);
  const getAmenitiesByType = (type: string) => {
    return (
      flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.amenities?.filter(
        (a: { amenityType: string }) => a.amenityType === type
      ) || []
    );
  };

  const cabinBag =
    flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCabinBags;
  const checkinBag =
    flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
      ?.includedCheckedBags;
  const amenities =
    flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.amenities || [];
  let activeTab = $state("info");
  //Save Data when book button is clicked for payment processing
  function handleBookNow(flight_new: any) {
    const seg = flight_new.itineraries[0].segments;
    const firstSeg = seg[0];
    const lastSeg = seg.at(-1);

    const detail: SelectedFlightDetail = {
      flightId: flight_new.id,
      airlineCode: firstSeg.carrierCode,
      airlineName: "Air India", // Optional: map carrierCode to name if available
      flightNumber: `${firstSeg.carrierCode} ${firstSeg.number}`,
      aircraftCode: firstSeg.aircraft?.code ?? "N/A",

      from: {
        iataCode: firstSeg.departure.iataCode,
        terminal: firstSeg.departure.terminal,
        dateTime: firstSeg.departure.at,
      },
      to: {
        iataCode: lastSeg.arrival.iataCode,
        terminal: lastSeg.arrival.terminal,
        dateTime: lastSeg.arrival.at,
      },

      duration: flight_new.itineraries[0].duration,
      isNonStop: seg.length === 1,
      stops: seg.length - 1,

      price: {
        base: flight_new.price.base,
        total: flight_new.price.total,
        currency: flight_new.price.currency,
      },

      passengers: [
        {
          info: {
            travelerType:
              flight_new.travelerPricings[0]?.travelerType ?? "ADULT",
            fullName: "",
            gender: "M",
            passportNumber: "",
            age: 0,
          },
          count: 1,
          fareOption: flight_new.travelerPricings[0]?.fareOption ?? "STANDARD",
          brandedFare:
            flight_new.travelerPricings[0]?.fareDetailsBySegment?.[0]
              ?.brandedFare ?? "",
          cabinClass:
            flight_new.travelerPricings[0]?.fareDetailsBySegment?.[0]?.cabin ??
            "",

          baggage: {
            cabinBag:
              flight_new.travelerPricings[0]?.fareDetailsBySegment?.[0]
                ?.includedCabinBags ?? undefined,
            checkinBag:
              flight_new.travelerPricings[0]?.fareDetailsBySegment?.[0]
                ?.includedCheckedBags ?? undefined,
          },

          amenities:
            flight_new.travelerPricings[0]?.fareDetailsBySegment?.[0]
              ?.amenities ?? [],
        },
      ],

      bookingDate: new Date().toISOString(),
    };
    SelectedFlightOffer.set(flight);
    SelectedFlight.set(detail);
    ContinueBooking.set(true);
  }
</script>

<div class="flight-card">
  <div class="main-info" onmousedown={() => (showDetails = !showDetails)}>
    <div class="airline-logo-info">
      <img src="/airline-default.png" alt="Airline Logo" class="airline-logo" />
      <div>
        <strong>Airline {flight.itineraries[0].segments[0].number}</strong><br
        />
        <span
          >{flight.itineraries[0].segments[0].aircraft?.code ??
            "Aircraft N/A"}</span
        >
      </div>
    </div>

    <div class="center-info">
      <span class="material-symbols-outlined">flight_takeoff</span>
      <div>{flight.itineraries[0].segments[0].departure.at.slice(11, 16)}</div>
      <div class="duration-block">
        <span class="material-symbols-outlined">schedule</span>
        <span
          >{flight.itineraries[0].duration
            .replace("PT", "")
            .toLowerCase()
            .replace("h", "h ")
            .replace("m", "m")}</span
        >
        <hr />
        <small>
          {flight.itineraries[0].segments.length > 1
            ? `${flight.itineraries[0].segments.length - 1} stop${flight.itineraries[0].segments.length - 1 > 1 ? "s" : ""}`
            : "Non-stop"}
        </small>
      </div>
      <span class="material-symbols-outlined">flight_land</span>
      <div>
        {flight.itineraries[0].segments.at(-1)?.arrival.at.slice(11, 16)}
      </div>
    </div>

    {#if !staffview}
      <div class="price-col">
        <span>
          {#if flight.price.base && flight.price.base !== flight.price.total}
            <div class="strike">₹{flight.price.total}</div>
          {/if}
          <div class="final">₹{flight.price.base}</div>
        </span>
        <span>
          {#if getAmenitiesByType("MEAL")}
            <span
              style="padding: 5px; outline: 2px solid var(--grey-light);
             border-radius: 5px; padding-top: 1px; padding-bottom: 1px;
             color: var(--grey-dark); font-weight: bold; font-size: var(--font-s);"
              >Meals Available</span
            >
          {/if}

          <span
            style="padding: 5px; outline: 2px solid var(--grey-light);
         border-radius: 5px; padding-top: 1px; padding-bottom: 1px;
         color: var(--red); font-weight: bold; font-size: var(--font-s);"
            ><span style="color: var(--grey-dark);">Seats</span>
            {flight.numberOfBookableSeats}</span
          >
          <small class="discount"
            ><span style="color: var(--grey-dark);">Discount</span> Applied</small
          >
        </span>

        <button class="book-btn" onclick={() => handleBookNow(flight)}
          >BOOK NOW</button
        >
      </div>
    {/if}
  </div>

  {#if showDetails}
    <div class="tabs">
      <div class="tab-headings">
        <button
          onclick={() => (activeTab = "info")}
          class:active={activeTab === "info"}>Flight Information</button
        >
        <button
          onclick={() => (activeTab = "fare")}
          class:active={activeTab === "fare"}>Fare Details & Rules</button
        >
        <button
          onclick={() => (activeTab = "baggage")}
          class:active={activeTab === "baggage"}>Baggage Information</button
        >
        <button
          onclick={() => (activeTab = "cancel")}
          class:active={activeTab === "cancel"}
          >Cancellation & Change Rule</button
        >
      </div>

      <div class="tab-content">
        {#if activeTab === "info"}
          {#each flight.itineraries[0].segments as seg}
            <div class="info-row">
              <strong
                style="width: fit-content; height: fit-content; display: flex; flex-direction: row;justify-content:center;align-items:center; column-gap: 10px;"
              >
                <span class="material-symbols-outlined">flight_takeoff</span>
                {seg.departure.iataCode}
                {seg.departure.at.slice(11, 16)}
              </strong>
              <strong>→</strong>
              <strong
                style="width: fit-content; height: fit-content; display: flex; flex-direction: row;justify-content:center;align-items:center; column-gap: 10px;"
              >
                <span class="material-symbols-outlined">flight_land</span>
                {seg.arrival.iataCode}
                {seg.arrival.at.slice(11, 16)}
              </strong>
              <div>
                <small
                  style="background-color: var(--grey-light); padding: 3px; border-radius: 3px;"
                  >Duration: {seg.duration
                    .replace("PT", "")
                    .toLowerCase()
                    .replace("h", "h ")
                    .replace("m", "m")}</small
                >
              </div>
              <div>
                <small
                  style="background-color: var(--grey-light); padding: 3px; border-radius: 3px;"
                  >Terminal: {seg.departure.terminal ?? "N/A"} → {seg.arrival
                    .terminal ?? "N/A"}</small
                >
              </div>
            </div>
          {/each}
        {:else if activeTab === "fare"}
          {#if amenities.filter((a: { amenityType: string }) => a.amenityType === "BRANDED_FARES").length > 0}
            <table>
              <thead><tr><th>Rule</th><th>Charge</th></tr></thead><tbody>
                {#each amenities.filter((a: { amenityType: string }) => a.amenityType === "BRANDED_FARES") as item}
                  <tr
                    ><td>{item.description}</td><td
                      >{item.isChargeable ? "Chargeable" : "Free"}</td
                    ></tr
                  >
                {/each}
              </tbody>
            </table>
          {:else}
            <p>No data available</p>
          {/if}
        {:else if activeTab === "baggage"}
          {#if cabinBag || checkinBag}
            <table>
              <thead><tr><th>Type</th><th>Weight</th></tr></thead><tbody>
                {#if cabinBag}
                  <tr
                    ><td>Cabin</td><td
                      >{cabinBag.weight} {cabinBag.weightUnit}</td
                    ></tr
                  >
                {/if}
                {#if checkinBag}
                  <tr
                    ><td>Check-in</td><td
                      >{checkinBag.weight} {checkinBag.weightUnit}</td
                    ></tr
                  >
                {/if}
              </tbody>
            </table>
          {:else}
            <p>No data available</p>
          {/if}
        {:else if activeTab === "cancel"}
          {#if amenities.filter( (a: { description: string | string[] }) => a.description.includes("TICKET") ).length > 0}
            <table>
              <thead><tr><th>Type</th><th>Status</th></tr></thead><tbody>
                {#each amenities.filter( (a: { description: string | string[] }) => a.description.includes("TICKET") ) as item}
                  <tr
                    ><td>{item.description}</td><td
                      >{item.isChargeable ? "Chargeable" : "Free"}</td
                    ></tr
                  >
                {/each}
              </tbody>
            </table>
          {:else}
            <p>No data available</p>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  :global(.material-symbols-outlined) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;
    text-decoration: none !important;
  }

  .flight-card {
    width: 100%;
    border: 3px solid var(--grey-light);
    border-radius: 10px;
    background: #fff;
    font-family: "Segoe UI", sans-serif;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  }

  .main-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    gap: 16px;
    cursor: pointer;
  }

  .airline-logo-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .airline-logo {
    width: 42px;
    height: 42px;
    object-fit: contain;
    border-radius: 5px;
  }

  .airline-logo-info strong {
    font-size: 16px;
  }

  .airline-logo-info span {
    font-size: 12px;
    color: #666;
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 6px;
    display: inline-block;
    margin-top: 2px;
  }

  .center-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex: 1;
    font-size: 14px;
  }

  .center-info > div {
    text-align: center;
  }

  .center-info .duration-block {
    color: var(--grey-dark);
    font-size: 13px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .center-info .duration-block hr {
    width: 30px;
    border: 1px solid #ccc;
    margin: 4px 0;
  }

  .price-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    text-align: right;
    min-width: 110px;
    row-gap: 5px;
  }

  .strike {
    text-decoration: line-through;
    color: #999;
    font-size: 13px;
  }

  .final {
    color: var(--red);
    font-size: 20px;
    font-weight: bold;
  }

  .discount {
    color: var(--green);
    font-size: 12px;
    padding: 4px;
    border-radius: 5px;
    font-weight: bold;
    outline: 2px solid var(--grey-light);
  }

  .book-btn {
    background: var(--blue);
    color: white;
    border: none;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 600;
    margin-top: 4px;
    border-radius: 5px;
    cursor: pointer;
  }
  .book-btn:hover {
    background-color: var(--blue-dark);
  }

  .tabs {
    background: #f9f9f9;
    padding-bottom: 10px;
  }

  .tab-headings {
    display: flex;
    gap: 8px;
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    max-width: 100vw;
  }

  .tab-headings button {
    background: none;
    border: none;
    font-weight: 600;
    font-size: 14px;
    padding: 8px 16px;
    color: #555;
    cursor: pointer;
    border-radius: 20px;
  }

  .tab-headings button.active {
    background: var(--blue);
    color: white;
  }

  .tab-content {
    padding: 1rem;
    font-size: 14px;
    background: white;
    max-width: 100vw;
  }

  .info-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;
    column-gap: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  .info-row small {
    display: block;
    color: #666;
    margin-top: 2px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    font-size: 14px;
  }

  th,
  td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background: #f9f9f9;
    font-weight: bold;
  }

  p {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 0.5rem 0;
  }
</style>
