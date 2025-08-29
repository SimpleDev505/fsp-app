<script lang="ts">
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import {
    buildFlightOfferFromTicket,
    currentTicket,
    fetchingTicket,
    fetchTicketAndOthers,
    seatMapData,
    selectedSeat,
    type Seat,
    type TicketData,
  } from "./Store/ticket";
  import { fetchSeatMap, SeatMapData } from "./Store/seatmap";
  import axios from "axios";
  import type { TravelerInfo } from "./Store/store";
  import SeatCell from "./SeatCell.svelte";
  import DataLoader from "./DataLoader.svelte";
  import { fetchPastFlights, pastFlightsData } from "./Store/past";
  let seatmap = $derived($SeatMapData);
  const deck = $derived(seatmap?.decks?.[0]);
  const rows = $derived(deck?.deckConfiguration?.length || 33);
  const cols = $derived(deck?.deckConfiguration?.width || 7);

  onMount(() => {
    gsap.fromTo(
      ".ticket-detail > *",
      {
        y: -10,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.25,
        ease: "back.inOut",
      }
    );
  });
  $effect(() => {
    if (ticketdetail) {
      gsap.fromTo(
        ".ticket-detail > *",
        {
          y: -10,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.25,
          ease: "back.inOut",
        }
      );
    }
  });
  $effect(() => {
    if (ticketdetail) {
      gsap.fromTo(
        ".seat-grid > * > *",
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.01,
          duration: 0.4,
          ease: "back.inOut",
        }
      );
    }
  });
  let ticketdetail = $derived($currentTicket);
  let ticketinput = $derived("");

  //Assign Seats
  let passengers: TravelerInfo[] = $state([]);
  let seatAssignments: Record<string, string> = {};

  // function assignSeatToPassenger(passengerName: string) {
  //   $selectedSeat && (seatAssignments[passengerName] = $selectedSeat);
  // }

  async function finalizeAssignments() {
    const ticket = $currentTicket;
    if (!ticket) return;
    await axios.post("http://localhost:8080/api/tickets/assign-seats", {
      ticketNumber: ticket.ticketNumber,
      assignments: Object.entries(seatAssignments).map(
        ([name, seatNumber]) => ({
          fullName: name,
          seatNumber,
        })
      ),
    });
  }
  //Seatmap
  let mapped_seats: Seat[] = $state([]);
  const STATUS_MAP = {
    AVAILABLE: "available",
    OCCUPIED: "occupied",
    BLOCKED: "occupied",
  } as const;
  let seatGrid: (Seat | null)[][] = $state([]);
  let maxRow = $state(0);
  let maxCol = $state(0);
  async function FetchSeatMapData() {
    if (ticketdetail) {
      fetchSeatMap(buildFlightOfferFromTicket(ticketdetail));
      mapped_seats =
        $SeatMapData?.decks[0].seats.map((seat: any) => {
          const rawStatus =
            seat.travelerPricing?.[0]?.seatAvailabilityStatus ?? "AVAILABLE";
          return {
            seatNumber: seat.number,
            status: STATUS_MAP[rawStatus as keyof typeof STATUS_MAP],
            bookedBy: seat.travelerPricing?.[0]?.travelerId ?? undefined,
          };
        }) ?? [];

      maxRow = Math.max(
        ...($SeatMapData?.decks?.[0]?.seats?.map(
          (s: any) => s.coordinates.x
        ) ?? [0])
      );
      maxCol = Math.max(
        ...($SeatMapData?.decks?.[0]?.seats?.map(
          (s: any) => s.coordinates.y
        ) ?? [0])
      );
      seatGrid = Array.from({ length: maxRow + 1 }, () =>
        Array.from({ length: maxCol + 1 }, () => null)
      );

      mapped_seats.forEach((seat: any) => {
        const raw = $SeatMapData?.decks[0].seats.find(
          (s: any) => s.number === seat.seatNumber
        );
        const x = raw?.coordinates.x;
        const y = raw?.coordinates.y;
        if (x !== undefined && y !== undefined) {
          seatGrid[x][y] = seat;
        }
      });
      console.log(
        "Mapped Seats ->",
        mapped_seats,
        "R C",
        maxRow,
        maxCol,
        "Seat Grid ->",
        seatGrid
      );
    }
  }
</script>

<div class="boarding-cnt-wrap">
  <div class="boarding-cnt">
    <div class="ticket-search">
      <input
        bind:value={ticketinput}
        placeholder="Ticket Number..."
        type="text"
        onkeydown={(e: KeyboardEvent) => {
          if (e.key === "Enter") {
            fetchTicketAndOthers({
              ticketNumber: ticketinput,
            });
            FetchSeatMapData();
            // FetchSeatMapData();
          }
        }}
      />
      <span class="material-symbols-outlined" style="font-size: 20px;">
        search
      </span>
    </div>
    <div class="ticket-detail">
      <p
        style="background-color: var(--blue-dark); width: 100%;
      padding: 10px; color: white; border-radius: 3px;"
      >
        Ticket Detail:
      </p>
      {#if ticketdetail && !$fetchingTicket}
        <span
          >Flight Number <span style="color: var(--blue-dark);"
            >{ticketdetail?.flight.flightNumber}</span
          ></span
        >
        <span
          >Airline <span style="color: var(--blue-dark);">
            {ticketdetail?.flight.airlineCode ||
              ticketdetail?.flight.aircraftCode}
          </span></span
        >

        <span
          >Terminal <span style="color: var(--blue-dark);"
            >{ticketdetail?.flight.from.terminal}</span
          ></span
        >
        <span
          >Contact <span style="color: var(--blue-dark);"
            >{ticketdetail?.user.email}</span
          ></span
        >
        <span
          >Stops <span style="color: var(--blue-dark);"
            >{ticketdetail?.flight.stops}</span
          ></span
        >
        <span>Status</span>
        <span
          >Booking Date <span style="color: var(--blue-dark);"
            >{ticketdetail?.bookingDate.split("T", 2)[0]}</span
          ></span
        >

        <div
          style="display: flex; justify-content: center; align-items: center; width: fit-content; height: fit-content;
          white-space: nowrap; column-gap: 15px;"
        >
          <span
            style="white-space: nowrap; display: flex; justify-content: center; align-items: center;"
          >
            <span
              style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;
              padding: 0;"
            >
              <span
                class="material-symbols-outlined"
                style="color: var(--blue); font-size: 24px;
                    outline: none; background-color: transparent;
                    display: flex;justify-content:center; align-items: center;"
              >
                flight_takeoff
              </span>
              <span style="outline:  none;"
                >{ticketdetail?.flight.from.iataCode}</span
              >
            </span>
            <span style="color: var(--blue-dark);"
              >Flight Hrs {ticketdetail?.flight.duration.split("PT")[1]}</span
            >
            <span
              style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;
              padding: 0;"
            >
              <span
                class="material-symbols-outlined"
                style="color: var(--blue); font-size: 24px;
                    outline: none; background-color: transparent;
                    display: flex;justify-content:center; align-items: center;"
              >
                flight_land
              </span>
              <span style="outline:  none;"
                >{ticketdetail?.flight.to.iataCode}</span
              >
            </span>
          </span>
        </div>
      {:else if !$fetchingTicket && !ticketdetail}
        <p style="width: 100%; text-align: center;">
          Search For Ticket To Obtain Information About It!
        </p>
      {:else if $fetchingTicket}
        <DataLoader strokeWidth={3} infinite duration={4000}></DataLoader>
      {/if}
    </div>
    <h4
      style="background-color: var(--blue-dark); width: 100%;
    padding: 10px; color: white; border-radius: 3px;"
    >
      Seat Map
    </h4>
    <div class="seat-assgn-section">
      {#if !$fetchingTicket && seatmap}
        <div class="seat-grid">
          {#each seatGrid as row}
            <div class="seat-row">
              {#each row as seat}
                {#if seat}
                  <div class="seat-cell">
                    <SeatCell {seat} />
                  </div>
                {:else}
                  <div class="empty-cell"></div>
                {/if}
              {/each}
            </div>
          {/each}
        </div>
      {:else if $fetchingTicket}
        <DataLoader strokeWidth={3} infinite duration={4000}></DataLoader>
      {:else}
        <h2 style="width: 100%; text-align: center;">Seatmap Unavailable!</h2>
      {/if}
      <div class="seat-passenger">
        <div class="assign-panel">
          {#each passengers as p}
            <div class="passenger-row">
              {p.fullName} ({p.travelerType}) —
              <!-- <button onclick={() => assignSeatToPassenger(p.fullName)}
                >Assign</button
              > -->
            </div>
          {/each}
          <button onclick={finalizeAssignments}>Assign Seat(s)</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Column 2 -->
  <div class="boarding-detail">
    <span
      style="display: flex; justify-content: center; align-items: center; background-color: var(--blue-dark); width: 100%;
    padding: 4px; color: white; border-radius: 3px;
    font-size: var(--font-sm);">Customer Details</span
    >
    <img src="src/assets/img/blank_profile.webp" alt="profilephoto" />
    <span
      style="display: flex; justify-content: space-between;outline: 3px solid var(--grey-light); "
    >
      <span
        style="color: var(--blue-dark); width: fit-content;
      outline: none; ">Ticket No</span
      >
      {ticketdetail?.ticketNumber}
    </span>
    <span
      style="display: flex; justify-content: space-between; outline: 3px solid var(--grey-light);"
      ><span
        style="color: var(--blue-dark); width: fit-content;
      outline: none;">Name</span
      >
      {ticketdetail?.user.username}</span
    >
    <span
      style="display: flex; justify-content: space-between; outline: 3px solid var(--grey-light);"
      ><span
        style="color: var(--blue-dark); width: fit-content;
      outline: none;">Email</span
      >
      {ticketdetail?.user.email}</span
    >
    <h4
      style="text-align: center; background-color: var(--blue-dark); width: 100%;
    padding: 10px; color: white; border-radius: 3px;
    display: flex; justify-content: space-between;
    align-items: center;"
    >
      Past Flights
      <button
        class="refresh-btn"
        onclick={() => fetchPastFlights(ticketdetail?.user.id ?? "")}
        ><span class="material-symbols-outlined"> autorenew </span></button
      >
    </h4>
    {#if $pastFlightsData.length === 0}
      <p>No Past Flights</p>
    {:else}
      <div class="boarding-past">
        {#each $pastFlightsData as pflight}
          <div class="pflight">
            <div
              style="display: flex; justify-content: flex-start;
              align-items: center; column-gap: 10px; width: 100%;
              flex-wrap: wrap;"
            >
              <span
                class="material-symbols-outlined"
                style="color: var(--blue-dark);
                font-size: 32px;
                width: fit-content;"
              >
                airplane_ticket
              </span>
              <span
                style="font-size: 10px; width: fit-content; height: fit-content;
                padding: 0; margin: 0;"
                ><span
                  class="material-symbols-outlined"
                  style="color: var(--blue-dark);
                  font-size: 24px;
                  width: fit-content;"
                >
                  groups_3
                </span><span
                  style="font-size: 16px; color: var(--blue-dark); font-weight: bold;"
                  >{pflight.passengers.length}</span
                ></span
              >
              <span
                style="font-size: 14px; color: var(--blue-dark); font-weight: bold; width: fit-content; height: fit-content;
              padding: 0; margin: 0;"
                ><span
                  class="material-symbols-outlined"
                  style="color: var(--grey-dark);
                font-size: 18px;
                width: fit-content;"
                >
                  calendar_month
                </span>{pflight.bookingDate.split("T")[0]}</span
              >
              <span
                style="font-size: 14px; color: var(--blue-dark); font-weight: bold; width: fit-content; height: fit-content;
              padding: 0; margin: 0;">{pflight.ticketNumber}</span
              >
              <span
                style="font-size: 14px; color: var(--blue-dark); font-weight: bold; width: fit-content; height: fit-content;
              padding: 0; margin: 0;"
                ><span
                  class="material-symbols-outlined"
                  style="color: var(--grey-dark);
                font-size: 18px;
                width: fit-content;"
                >
                  currency_rupee
                </span>{pflight.price.total}</span
              >
            </div>
            <div style="width: 100%; height: fit-content;">
              <span
                ><span class="material-symbols-outlined">
                  flight_takeoff
                </span>{pflight.from.iataCode}</span
              >
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .pflight {
    position: relative;
    width: 100%;
    height: fit-content;
    padding: 12px;
    border-bottom: 3px solid var(--grey-light);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .pflight:hover {
    background: var(--grey-light);
    border-bottom: 3px solid var(--blue-dark);
    cursor: pointer;
  }
  .refresh-btn {
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0.2rem 0.3rem;
    cursor: pointer;
  }
  .seat-assgn-section {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    width: 100%;
    height: 25em;
    overflow: hidden;
    padding: 10px;
    background-color: white;
    border-radius: 5px;
    outline: 3px solid var(--blue-dark);
    overflow-y: scroll;
    box-shadow:
      rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
      rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  }
  .seat-grid {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    height: fit-content;
    background-color: white;
    padding: 10px;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
    border-radius: 10px;
  }

  .seat-row {
    display: grid;
    /* grid-template-columns: repeat(auto-fit, minmax(30px, 1fr)); */
    grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
    gap: 1px;
  }

  .empty-cell {
    width: fit-content;
    height: fit-content;
    border-radius: 4px;
    background-color: transparent;
  }
  /* Seat */
  .assign-panel {
    padding: 1rem;
  }
  .passenger-row {
    margin-bottom: 0.5rem;
  }
  /* Assigment */
  .boarding-cnt-wrap {
    display: grid;
    grid-template-columns: auto 1fr;
    width: 100%;
    height: 100%;
  }
  .boarding-cnt {
    grid-column: 1;
    width: 100%;
    height: 100%;
    max-width: 900px;
    width: 900px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 1em;
    margin: 0;
  }
  .boarding-detail {
    justify-self: flex-end;
    grid-column: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    row-gap: 15px;
    width: 100%;
    max-width: 415px;
    height: 100%;
    padding: 1em;
    background-color: white;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 10px;
    margin: 0;
  }
  .boarding-detail span {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 4px;
    color: var(--grey-dark);
    font-weight: 500;
    border-radius: 3px;
    font-size: var(--font-sm);
  }
  .boarding-detail img {
    object-fit: contain;
    width: 128px;
    height: 128px;
    border-radius: 50%;
    outline: 4px solid var(--grey-light);
  }
  .boarding-past {
    overflow-y: auto;
    width: 100%;
    height: 12em;
    scrollbar-color: var(--blue-dark) transparent;
  }
  .ticket-search {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: fit-content;
  }
  .ticket-search input[type="text"] {
    padding: 1em 5em;
    width: 100%;
    border-radius: 10px;
    box-shadow: none;
    border: none;
    outline: 3px solid var(--grey-light);
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 10px;
    font-size: var(--font-sm);
  }
  .ticket-search input[type="text"]:focus {
    outline: 3px solid var(--blue-dark);
    transition: 0.2s ease-in;
  }
  .ticket-search span {
    position: absolute;
    right: 12px;
    color: var(--blue-dark);
  }
  .ticket-detail {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    column-gap: 15px;
    outline: 3px solid var(--blue-dark);
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    width: 100%;
    padding: 10px;
    background-color: white;
    row-gap: 12px;
  }
  .ticket-detail span {
    outline: 3px solid var(--grey-light);
    padding: 4px;
    border-radius: 5px;
    background-color: var(--grey-light);
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }
  .ticket-detail span:hover {
    outline: 2px solid var(--blue-dark);
  }
  .ticket-detail span,
  * {
    font-size: var(--font-s);
    font-weight: bold;
    white-space: nowrap;
    color: var(--grey-dark);
  }
</style>
