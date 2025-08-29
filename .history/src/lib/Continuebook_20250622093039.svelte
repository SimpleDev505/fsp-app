<script lang="ts">
  import Dropdownmenu from "./dropdownmenu.svelte";
  import {
    ContinueBooking,
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
  let current_travellercount: Travellers = $state({
    adult: 1,
    children: 0,
    infant: 0,
  });
  $effect(() => {
    current_travellercount = travellercount;
  });
  const adult_dropdown: MenuItem[] = [
    {
      label: "Mr.",
      action: () => {
        P_Gender = "M";
      },
      split: false,
    },
    {
      label: "Ms.",
      action: () => {
        P_Gender = "F";
      },
      split: false,
    },
    {
      label: "Mrs.",
      action: () => {
        P_Gender = "F";
      },
      split: false,
    },
  ];
  const child_infant_dropdown: MenuItem[] = [
    {
      label: "Master",
      action: () => {
        P_Gender = "M";
      },
      split: false,
    },
    {
      label: "Miss",
      action: () => {
        P_Gender = "F";
      },
      split: false,
    },
  ];
  let current_dropdown: MenuItem[] = $state(adult_dropdown);
  function updateTravelerAndBaggageDetails(
    travelers: TravelerInfo[],
    baggageOverrides: BaggageInfo[]
  ) {
    SelectedFlight.update((flight) => {
      if (!flight) return flight;

      flight.passengers = travelers.map((trav) => ({
        info: {
          travelerType: trav.travelerType,
          age: trav.age,
          fullName: trav.fullName,
          gender: trav.gender,
          passportNumber: trav.passportNumber,
        },
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
  let Traveller: "ADULT" | "CHILD" | "INFANT" = $state("ADULT");

  //Form Values
  let P_Name = $state("");
  let P_Email = $state("");
  let P_Number = $state(0);
  let P_Gender: "M" | "F" | "O" = $state("M");
  let P_error = $state("");
  //Passenger Mode
  let Traveller_Details: TravelerInfo[] = $state([]);
  let Applied_TravelledAmount = $state(false);
  //Stage
  let Continuebook_stage: "Passenger Data" | "Baggage Data" | "Payment" =
    $state("Passenger Data");
  function SetTravellerDetail() {
    if (current_travellercount.adult !== 1) {
      Traveller = "ADULT";
      current_travellercount.adult -= 1;
      current_dropdown = adult_dropdown;
      Traveller_Details.push({
        age: 0,
        fullName: P_Name,
        gender: P_Gender,
        travelerType: Traveller,
        passportNumber: "",
      });
    } else if (
      current_travellercount.adult == 1 &&
      current_travellercount.children != 0
    ) {
      Traveller = "CHILD";
      current_dropdown = child_infant_dropdown;
      current_travellercount.children -= 1;
      Traveller_Details.push({
        age: 0,
        fullName: P_Name,
        gender: P_Gender,
        travelerType: Traveller,
        passportNumber: "",
      });
    } else if (
      current_travellercount.adult == 1 &&
      current_travellercount.children == 0 &&
      current_travellercount.infant != 0
    ) {
      Traveller = "INFANT";
      current_dropdown = child_infant_dropdown;
      current_travellercount.infant -= 1;
      Traveller_Details.push({
        age: 0,
        fullName: P_Name,
        gender: P_Gender,
        travelerType: Traveller,
        passportNumber: "",
      });
    } else if (
      current_travellercount.adult === 1 &&
      current_travellercount.children === 0 &&
      current_travellercount.infant === 0
    ) {
      travellercount.adult = 1;
      travellercount.children = 0;
      travellercount.infant = 0;
      updateTravelerAndBaggageDetails(Traveller_Details, []);
      console.log($SelectedFlight);
      Continuebook_stage = "Baggage Data";
    }
  }
  //baggage
  let baggagecount = $state({
    "3kg": 0,
    "5kg": 0,
    "10kg": 0,
    "15kg": 0,
    "20kg": 0,
    "30kg": 0,
  });

  function increment(key: keyof typeof baggagecount) {
    baggagecount[key]++;
  }
  function decrement(key: keyof typeof baggagecount) {
    if (baggagecount[key] > 0) baggagecount[key]--;
  }
</script>

<div class="book-flight">
  <div
    class="book-flight-overlay"
    onmousedown={() => ContinueBooking.set(false)}
  ></div>
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
    {#if !Applied_TravelledAmount}
      <div class="traveller-counter">
        <span
          style=" text-align:center; width:fit-content; font-size: var(--font-s); color: var(--blue); font-weight: bold; white-space: nowrap;"
          >TRAVELLER DETAILS
          <br />
          <span
            style=" text-align:center; width:100%; font-size: var(--font-s); color: var(--grey-dark); font-weight: normal;"
            >Adult {travellercount.adult} Children {travellercount.children} Infants
            {travellercount.infant}</span
          ></span
        >
        <button
          onclick={() => (Applied_TravelledAmount = true)}
          class="traveller-apply-btn"
          style="border: none ; font-weight: bold; color: white; padding: 5px;
          border-radius: 4px; cursor: pointer;">Apply</button
        >
        <div
          class="counter-btns"
          style="width: fit-content; height: fit-content;"
        >
          <span class="counter-btn">
            <button onclick={() => (travellercount.adult += 1)}>+</button>
            <span>Adult</span>
            <button
              onclick={() => {
                if (travellercount.adult >= 2) {
                  travellercount.adult -= 1;
                }
              }}>-</button
            >
          </span>
          <span class="counter-btn">
            <button onclick={() => (travellercount.children += 1)}>+</button>
            <span>Child</span>
            <button
              onclick={() => {
                if (travellercount.children != 0) {
                  travellercount.children -= 1;
                }
              }}>-</button
            >
          </span>
          <span class="counter-btn">
            <button
              onclick={() => {
                if (travellercount.infant > travellercount.adult) {
                  P_error = "Infant Count Cannot Be Greater Than Adult Count";
                } else {
                  travellercount.infant += 1;
                }
              }}>+</button
            >
            <span>Infant</span>
            <button
              onclick={() => {
                if (travellercount.infant != 0) {
                  travellercount.infant -= 1;
                }
              }}>-</button
            >
          </span>
        </div>
      </div>
    {/if}
    {#if Applied_TravelledAmount}
      <div class="traveller-detail-cnt">
        {#if Continuebook_stage === "Passenger Data"}
          <div class="traveller-detail">
            <span
              style=" text-align:center; width:100%; font-size: var(--font-lg); color: var(--blue); font-weight: bold;"
            >
              {#if Traveller === "ADULT"}
                {"ADULT " + current_travellercount.adult}
              {:else if Traveller === "CHILD"}
                {"CHILD " + current_travellercount.children}
              {:else if Traveller === "INFANT"}
                {"INFANT " + current_travellercount.infant}
              {/if}</span
            >
            <label for="traveller-name">Title:</label>
            <div
              style="display: flex; flex-direction: row; width: 100%; height: fit-content; justify-content: flex-start; align-items: center;"
            >
              <Dropdownmenu leftpx={0} rightpx={0} items={current_dropdown}
              ></Dropdownmenu>
            </div>
            <label for="traveller-name">Name:</label>
            <input
              id="traveller-name"
              placeholder="Name"
              type="text"
              bind:value={P_Name}
            />
            <label for="traveller-name">Email:</label>
            <input placeholder="Email" type="email" bind:value={P_Email} />
            <label for="traveller-name">Phone Number:</label>
            <input
              placeholder="Phone Number"
              type="tel"
              bind:value={P_Number}
            />
          </div>
          <button onclick={() => SetTravellerDetail()}>Next</button>
          <button
            style="margin-left: 55px;"
            onclick={() => {
              Applied_TravelledAmount = false;
              travellercount = {
                adult: 1,
                children: 0,
                infant: 0,
              };
              current_travellercount = travellercount;
            }}>Clear</button
          >
        {:else if Continuebook_stage === "Baggage Data"}
          <div
            style="width: 100%; padding: 15px; display: flex; flex-direction: column; justify-content: center; align-items: center; outline: 2px solid var(--grey-light);
            color:var(--blue); font-weight: bold;"
          >
            <span>Baggage Details</span>
            <div class="baggage-grid">
              {#each Object.entries(baggagecount) as [key, value]}
                {@const typedKey = key as keyof typeof baggagecount}
                <div class="baggage-item">
                  <button onclick={() => decrement(typedKey)}>−</button>
                  <span>{value}</span>
                  <div class="label">{typedKey.toUpperCase()}</div>
                  <button onclick={() => increment(typedKey)}>+</button>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* Baggage */
  .baggage-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1rem;
    border-radius: 10px;
    width: 100%;
    justify-items: center;
    align-items: center;
  }

  .baggage-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    justify-items: flex-start;
    background: white;
    border-radius: 8px;
    padding: 0.5rem 0.8rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    width: fit-content;
    outline: 2px solid var(--grey-light);
  }

  .baggage-item .label {
    font-weight: 500;
    color: var(--grey-dark);
    width: fit-content;
  }

  .baggage-item button {
    border: none;
    background: transparent;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--grey-dark);
    transition: 0.2s ease-in;
    padding: 0;
    margin: 0;
  }

  .baggage-item button:hover {
    background: var(--grey-light);
  }

  .baggage-item span {
    width: fit-content;
    text-align: center;
    font-weight: bold;
  }
  /* ----------- */
  .traveller-apply-btn {
    background-color: var(--blue);
  }
  .traveller-apply-btn:hover {
    background-color: var(--blue-dark);
  }
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
    justify-content: flex-start;
    align-items: center;
    height: fit-content;
    padding: 10px;
    outline: 2px solid var(--grey-light);
    border-radius: 8px;
    column-gap: 10px;
  }
  .counter-btns {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    column-gap: 10px;
  }
  .counter-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 4em;
    color: var(--grey-dark);
    border-radius: 8px;
    user-select: none;
    background-color: var(--grey-light);
    overflow: hidden;
  }
  .counter-btn:hover {
    outline: 2px solid var(--blue-dark);
    cursor: pointer;
  }
  .counter-btn button {
    text-align: center;
    vertical-align: middle;
    height: fit-content;
    width: 100%;
    background-color: transparent;
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
    background-color: var(--grey-light);
    color: var(--grey-dark);
    font-size: 20px;
    padding: 0;
    font-weight: bold;
    white-space: nowrap;
  }
  .traveller-counter .counter-btn button:hover {
    background-color: var(--grey-dark);
    color: var(--grey-light);
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
