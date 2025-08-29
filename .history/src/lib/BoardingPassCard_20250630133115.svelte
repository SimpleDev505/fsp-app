<script lang="ts">
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import {
    buildFlightOfferFromTicket,
    currentTicket,
    fetchingTicket,
    fetchTicketAndOthers,
    selectedSeat,
    type Seat,
  } from "./Store/ticket";
  import { fetchSeatMap, SeatMapData } from "./Store/seatmap";
  import axios from "axios";
  import type { TravelerInfo } from "./Store/store";
  import SeatCell from "./SeatCell.svelte";
  import DataLoader from "./DataLoader.svelte";
  import {
    fetchPastFlights,
    pastFlightsData,
    SelectedPastFlight,
  } from "./Store/past";
  import { get } from "svelte/store";
  import type { StatusMessage } from "./Notifier.svelte";
  import Notifier from "./Notifier.svelte";
  let seatmap = $derived($SeatMapData);

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
  $effect(() => {
    if ($selectedSeat) {
      console.log("seatss");
      gsap.fromTo(
        ".cur-seat",
        {
          fontSize: 0,
        },
        {
          fontSize: 14,
          duration: 0.24,
          ease: "circ.inOut",
        }
      );
    }
  });
  $effect(() => {
    if (assgn_err.message && boardingpass_cnt) {
      gsap.fromTo(
        boardingpass_cnt.children,
        { y: 10, stagger: 0.4 },
        {
          y: 0,
          duration: 0.05,
          stagger: 0.1,
          ease: "circ.inOut",
          delay: 0.05,
        }
      );
    }
  });
  let boardingpass_cnt: HTMLElement | null = $state(null);
  let ticketdetail = $derived($currentTicket);
  let ticketinput = $derived("");
  let assgn_err: StatusMessage = $state({ message: null, type: "ERROR" });

  //Assign Seats
  let seatAssignments: Record<string, string> = {};

  function assignSeatToPassenger(passengerName: string) {
    const seats = get(selectedSeat);
    if (seats && seats.length > 0) {
      const selectedseat = seats[seats.length - 1];
      const alreadyAssigned = Object.entries(seatAssignments).find(
        ([existingPassenger, seatNumber]) =>
          seatNumber === selectedseat.seatNumber &&
          existingPassenger !== passengerName
      );
      if (alreadyAssigned) {
        assgn_err.message = `Seat ${selectedseat.seatNumber} is already assigned to ${alreadyAssigned[0]}`;
        assgn_err.type = "WARN";
        setTimeout(() => {
          assgn_err.message = null;
        }, 4500);
        return;
      }
      seatAssignments[passengerName] = selectedseat.seatNumber;
      assgn_err.message = `Assigned seat ${selectedseat.seatNumber} to ${passengerName}`;
      assgn_err.type = "SUCCESS";
      setTimeout(() => {
        assgn_err.message = null;
      }, 4500);
      return;
    }
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
    BLOCKED: "blocked",
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
          console.log("Raw -->", rawStatus);
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
      // console.log(
      //   "Mapped Seats ->",
      //   mapped_seats,
      //   "R C",
      //   maxRow,
      //   maxCol,
      //   "Seat Grid ->",
      //   seatGrid
      // );
    }
  }
</script>

<div class="boarding-cnt-wrap">
  <div class="boarding-cnt" bind:this={boardingpass_cnt}>
    {#if assgn_err.message}
      <div style="width: 100%;">
        <Notifier P_error={assgn_err.message} Type={assgn_err.type}></Notifier>
      </div>
    {/if}
    <div class="ticket-search">
      <input
        bind:value={ticketinput}
        placeholder="Ticket Number..."
        type="text"
        onkeydown={async (e: KeyboardEvent) => {
          if (e.key === "Enter") {
            const res = await fetchTicketAndOthers({
              ticketNumber: ticketinput,
            });
            if (res !== true) {
              assgn_err.message = "Wrong Ticket No!";
              assgn_err.type = "ERROR";
              setTimeout(() => {
                assgn_err.message = null;
              }, 4000);
            } else {
              FetchSeatMapData();
            }

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
      <span class="cur-seat" style="color: white; font-size: larger;">
        {#if $selectedSeat}
          Currently Selected =
          {#if $selectedSeat && $currentTicket}
            {$selectedSeat[$selectedSeat?.length - 1].seatNumber}
            {#if $selectedSeat.length >= $currentTicket.passengers.length}
              Max({$currentTicket.passengers.length - 1})
            {/if}
          {/if}
        {:else}
          Currently Selected Seat None!
        {/if}
      </span>
    </h4>
    <div class="seat-assgn-section">
      {#if !$fetchingTicket && seatmap && ticketdetail}
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
      <h4
        style="background-color: var(--blue-dark); width: 100%;
    padding: 10px; color: white; border-radius: 3px;"
      >
        Seat Assigment
      </h4>

      <div class="seat-passenger">
        <div class="assign-panel">
          {#if ticketdetail && !$fetchingTicket}
            <div
              class="passenger-row"
              style="background-color: var(--grey-light);
              padding: 10px; border-radius: 4px;"
            >
              <span style="color: var(--blue-dark);">S.No</span>
              <span style="color: var(--blue-dark);">PassengerName</span>
              <span style="color: var(--blue-dark);">Type(G)</span>
              <span style="color: var(--blue-dark);">SeatNumber</span>
              <span style="color: var(--blue-dark);">Action</span>
            </div>
            {#each ticketdetail.passengers as p, pindex}
              <div class="passenger-row">
                <span>{pindex}</span>
                <span>{p.fullName}</span>
                <span>{p.travelerType}({p.gender})</span>
                {@html console.log(seatAssignments[pindex])}
                <span>{seatAssignments[p.fullName] ?? "Not Assigned"}</span>
                <span
                  ><button onclick={() => assignSeatToPassenger(p.fullName)}
                    >Assign</button
                  ></span
                >
                <!-- <button onclick={() => assignSeatToPassenger(p.fullName)}
                  >Assign</button
                > -->
              </div>
            {/each}
          {/if}
          <button onclick={finalizeAssignments}>Assign Seat(s)</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Column 2 - Passeger Detail -->
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
        onclick={() => {
          if (ticketdetail) {
            fetchPastFlights(ticketdetail?.user.id ?? "");
          }
        }}><span class="material-symbols-outlined"> autorenew </span></button
      >
    </h4>
    {#if $pastFlightsData.length === 0}
      <p>No Past Flights</p>
    {:else}
      <div class="boarding-past">
        {#each $pastFlightsData as pflight, pflightindex}
          <div
            class="pflight"
            onmousedown={() => {
              if ($SelectedPastFlight === pflightindex) {
                SelectedPastFlight.set(-1);
              } else {
                SelectedPastFlight.set(pflightindex);
              }
            }}
          >
            <div
              style="display: flex; justify-content: flex-start;
              align-items: center; column-gap: 5px; width: 100%;
              flex-wrap: wrap; row-gap: 5px;"
            >
              <span
                style="font-size: 10px; width: fit-content; height: fit-content;
            padding: 4px; margin: 0; background-color: var(--grey-light);"
              >
                <span
                  class="material-symbols-outlined"
                  style="color: var(--blue-dark);
                  font-size: 24px;
                  width: fit-content;"
                >
                  airplane_ticket
                </span>
                <span
                  style="font-size: 14px; color: var(--blue-dark); font-weight: bold;"
                  >{pflight.aircraftCode}</span
                >
              </span>
              <span
                style="font-size: 10px; width: fit-content; height: fit-content;
                padding: 4px; margin: 0; background-color: var(--grey-light);"
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
              padding: 5px; margin: 0; background-color: var(--grey-light);"
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
              padding: 8px; margin: 0;background-color: var(--grey-light);"
                >{pflight.ticketNumber}</span
              >
              <span
                style="font-size: 14px; color: var(--blue-dark); font-weight: bold; width: fit-content; height: fit-content;
              padding: 4px; margin: 0; background-color: var(--grey-light);"
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
            <hr style="width:100%;text-align:left;margin-left:0" />
            <div
              style="width: 100%; height: fit-content; display: flex; justify-content: space-around; align-items: center;
              column-gap: .5em;"
            >
              <div
                style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: fit-content; height: fit-content;"
              >
                <span
                  class="material-symbols-outlined"
                  style="color: var(--blue-dark); font-size: 26px;"
                >
                  flight_takeoff
                </span>{pflight.from.iataCode}
              </div>
              <div
                style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: fit-content; height: fit-content;"
              >
                <span
                  class="material-symbols-outlined"
                  style="color: var(--blue-dark); font-size: 26px; width: fit-content;"
                >
                  avg_pace
                </span>{pflight.duration}
              </div>
              <div
                style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: fit-content; height: fit-content;"
              >
                <span
                  class="material-symbols-outlined"
                  style="color: var(--blue-dark); font-size: 26px;"
                >
                  flight_land
                </span>{pflight.to.iataCode}
              </div>
            </div>
            <!-- Passengers Details -->
            {#if $SelectedPastFlight === pflightindex}
              {#if pflight.passengers.length > 0}
                <h4
                  style="text-align: center; background-color: var(--blue-dark); width: 100%;
              padding: 10px; color: white; border-radius: 3px;
              display: flex; justify-content:center;
              align-items: center; font-size: 14px;"
                >
                  Additional Passengers
                </h4>
                {#each pflight.passengers as pflightpassenger, pflightpassenger_index}
                  <div
                    style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; 
                    margin-top: 12px;"
                  >
                    <span
                      style="display: flex; justify-content: space-between;outline: 2px solid var(--grey-light); "
                    >
                      <span
                        style="color: var(--blue-dark); width: fit-content;
           outline: none; ">Name</span
                      >
                      {pflightpassenger_index === 0
                        ? pflightpassenger.fullName + " (Booked)"
                        : pflightpassenger.fullName}
                    </span>
                  </div>
                {/each}
              {:else}
                <h4>No Additonal Passengers</h4>
              {/if}
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .passenger-row button:hover {
    background-color: var(--blue-dark);
    outline: 3px solid var(--blue-dark);
  }
  .passenger-row button {
    background-color: var(--blue);
    outline: 2px solid var(--grey-light);
    border: none;
    cursor: pointer;
    color: white;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
  }
  .seat-passenger {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
  }
  /* Assignment */
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
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem;
    overflow-y: auto;
  }
  .passenger-row span {
    text-align: center;
    width: 100%;
  }
  .passenger-row {
    width: 100%;
    height: fit-content;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
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
    font-size: 14px;
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
  .ticket-detail > span:hover {
    outline: 2px solid var(--blue-dark);
  }
  .ticket-detail span,
  * {
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
    color: var(--grey-dark);
  }
</style>
