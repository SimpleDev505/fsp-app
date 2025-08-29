<script lang="ts">
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import {
    buildFlightOfferFromTicket,
    currentTicket,
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
  let seatmap = $derived($SeatMapData);
  const deck = $derived(seatmap?.decks?.[0]);
  const rows = $derived(deck?.deckConfiguration?.length || 33);
  const cols = $derived(deck?.deckConfiguration?.width || 7);
  const seat_grid: any[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
  );

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
  let ticketdetail = $derived($currentTicket);
  let ticketinput = $derived("");

  //Assign Seats
  let passengers: TravelerInfo[] = $state([]);
  let seatAssignments: Record<string, string> = {};

  function assignSeatToPassenger(passengerName: string) {
    $selectedSeat && (seatAssignments[passengerName] = $selectedSeat);
  }

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
      // for (const seat of deck?.seats || []) {
      //   const { x, y } = seat.coordinates;
      //   if (x != null && y != null) seat_grid[x][y] = seat;
      // }
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
          }
        }}
      />
      <span class="material-symbols-outlined" style="font-size: 20px;">
        search
      </span>
    </div>
    <div class="ticket-detail">
      <p
        style="width: 100%; height: fit-content; padding: 4px; margin: 0;
      color: var(--blue-dark); font-size: var(--font-sm);"
      >
        Ticket Detail:
      </p>
      {#if ticketdetail}
        <span>Name {ticketdetail?.user.username}</span>
        <span>Ticket Number {ticketdetail?.ticketNumber}</span>
        <span>Flight Number {ticketdetail?.flight.flightNumber}</span>
        <span
          >Airline {ticketdetail?.flight.airlineCode ||
            ticketdetail?.flight.aircraftCode}</span
        >
        <div
          style="display: flex; justify-content: center; align-items: center; width: fit-content; height: fit-content;
          white-space: nowrap; column-gap: 15px;"
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
          <span>Flight Hrs {ticketdetail?.flight.duration.split("PT")[1]}</span>
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
        </div>
        <span>{ticketdetail?.flight.from.terminal}</span>
        <span>Contact {ticketdetail?.user.email}</span>
        <span>Stops {ticketdetail?.flight.stops}</span>
        <span>Booking Date {ticketdetail?.bookingDate.split("T", 2)[0]}</span>
        <span>Status</span>
      {:else}
        <p style="width: 100%; text-align: center;">
          Search For Ticket To Obtain Information About It!
        </p>
      {/if}
    </div>
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
    <div class="seat-passenger">
      <div class="assign-panel">
        {#each passengers as p}
          <div class="passenger-row">
            {p.fullName} ({p.travelerType}) —
            <button onclick={() => assignSeatToPassenger(p.fullName)}
              >Assign</button
            >
          </div>
        {/each}
        <button onclick={finalizeAssignments}>Assign Seat(s)</button>
      </div>
    </div>
  </div>
  <!-- Column 2 -->
  <div class="boarding-detail"></div>
</div>

<style>
  .seat-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    height: fit-content;
  }

  .seat-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10px, 1fr));
    gap: 6px;
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
    width: 100%;
    max-width: 415px;
    height: 100%;
    padding: 1em;
    background-color: white;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 10px;
    margin: 0;
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
