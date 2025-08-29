<script lang="ts">
  import { gsap } from "gsap";
  import { onDestroy, onMount } from "svelte";
  import {
    buildFlightOfferFromTicket,
    currentTicket,
    fetchingTicket,
    fetchTicketAndOthers,
    otherPassengersOnSameFlight,
    selectedSeat,
    type Seat,
  } from "./Store/ticket";
  import {
    fetchSeatMap,
    GenerateBoardingPass_State,
    SeatMapData,
  } from "./Store/seatmap";
  import axios from "axios";
  import SeatCell from "./SeatCell.svelte";
  import DataLoader from "./DataLoader.svelte";
  import {
    fetchPastFlights,
    pastFlightsData,
    SelectedPastFlight,
  } from "./Store/past";
  import { get, writable } from "svelte/store";
  import type { StatusMessage } from "./Notifier.svelte";
  import Notifier from "./Notifier.svelte";
  import { removeSeat, seatGrid } from "./Store/seat";
  import GenPass from "./GenPass.svelte";
  import { downloadPass } from "./Store/pass";

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
        { stagger: 0.4, filter: "grayscale(100%)" },
        {
          duration: 0.3,
          stagger: 0.1,
          ease: "sine.inOut",
          delay: 0.1,
          filter: "grayscale(0%)",
        }
      );
    }
  });
  function ClearBoardingPass() {
    boardingpass_cnt = null;
    ticketdetail = null;
    ticketinput = "";
    assgn_err = { message: null, type: "ERROR" };
    selectedseat_index = -1;
    //Assign Seats
    seatAssignments = {};
    mapped_seats = [];
    (maxCol = 0), (maxRow = 0);
    $SeatMapData = null;
    $seatGrid = [];
    $GenerateBoardingPass_State = "Assignment";
    $currentTicket = null;
  }
  onDestroy(() => {
    ClearBoardingPass();
  });
  let boardingpass_cnt: HTMLElement | null = $state(null);
  let ticketdetail = $derived($currentTicket);
  let ticketinput = $state("");
  let assgn_err: StatusMessage = $state({ message: null, type: "ERROR" });
  let selectedseat_index = $state(-1);
  //Assign Seats
  let seatAssignments: Record<string, string> = $state({});
  let genpass_cnt: any = $state();

  function assignSeatToPassenger(passengerName: string) {
    const seats = get(selectedSeat);
    if (selectedseat_index === -1) {
      selectedseat_index = seats?.length ?? -1;
    }
    if (seats && seats.length > 0) {
      if (selectedseat_index > 0) {
        selectedseat_index -= 1;
      } else {
        selectedseat_index = -1;
        $selectedSeat?.forEach((s) => (s.status = "occupied"));
        selectedSeat.set(null);
        return;
      }
      const selectedseat = seats[selectedseat_index];
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
      selectedseat.status = "occupied";
      assgn_err.message = `Assigned seat ${selectedseat.seatNumber} to ${passengerName}`;
      assgn_err.type = "SUCCESS";
      setTimeout(() => {
        assgn_err.message = null;
      }, 4500);
      console.log("Assgn -> ", seatAssignments);
      return;
    }
  }
  function removeSeatAssignment(passengerName: string) {
    const assignedSeat = seatAssignments[passengerName];

    if (!assignedSeat) {
      assgn_err.message = `No seat assignment found for ${passengerName}`;
      assgn_err.type = "WARN";
      setTimeout(() => {
        assgn_err.message = null;
      }, 4500);
      return;
    }
    delete seatAssignments[passengerName];
    const seats = get(selectedSeat);
    if (seats) {
      const seatToUpdate = seats.find((s) => s.seatNumber === assignedSeat);
      if (seatToUpdate) {
        seatToUpdate.status = "available";
      }
      const seatIndex = seats.findIndex((s) => s.seatNumber === assignedSeat);
      if (seatIndex !== -1) {
        selectedseat_index = Math.max(selectedseat_index, seatIndex + 1);
      }
      const updatedSeats = seats.filter((s) => s.seatNumber !== assignedSeat);
      selectedSeat.set(updatedSeats.length > 0 ? updatedSeats : null);
    }
    assgn_err.message = `Removed seat assignment ${assignedSeat} from ${passengerName}`;
    assgn_err.type = "WARN";
    setTimeout(() => {
      assgn_err.message = null;
    }, 4500);
    // console.log("Removed assignment -> ", seatAssignments);
  }
  function areAllAssignmentsFilled(
    assignments: Record<string, string>
  ): boolean {
    return Object.values(assignments).every(
      (value) => value && value.trim() !== ""
    );
  }
  async function finalizeAssignments() {
    if (areAllAssignmentsFilled(seatAssignments)) {
      const ticket = $currentTicket;
      if (!ticket) return;
      const res = await axios.post("http://localhost:8080/assign-seats", {
        ticketNumber: ticket.ticketNumber,
        assignments: Object.entries(seatAssignments).map(
          ([name, seatNumber]) => ({
            fullName: name,
            seatNumber,
          })
        ),
      });
      if (res.status === 200) {
        assgn_err.message = "Seat(s) Assigned Sucessfully!";
        assgn_err.type = "SUCCESS";
        setTimeout(async () => {
          assgn_err.message = null;
          $GenerateBoardingPass_State = "Loading Pass";
          const resy = await fetchTicketAndOthers({
            ticketNumber: ticketinput,
          });
          // console.log("Fetchy ->", $currentTicket);
          $GenerateBoardingPass_State = "Gen Pass";
        }, 4000);
        return;
      }
    } else {
      assgn_err.message = "Seat(s) Cannot Be Empty!";
      assgn_err.type = "ERROR";
      setTimeout(() => {
        assgn_err.message = null;
      }, 4000);
    }
  }
  //Seatmap
  let mapped_seats: Seat[] = $state([]);
  const STATUS_MAP = {
    AVAILABLE: "available",
    OCCUPIED: "occupied",
    BLOCKED: "blocked",
  } as const;
  // let seatGrid: (Seat | null)[][] = $state([]);
  let maxRow = $state(0);
  let maxCol = $state(0);
  async function FetchSeatMapData() {
    if (ticketdetail) {
      fetchSeatMap(buildFlightOfferFromTicket(ticketdetail));
      mapped_seats =
        $SeatMapData?.decks[0].seats.map((seat: any) => {
          const rawStatus =
            seat.travelerPricing?.[0]?.seatAvailabilityStatus ?? "AVAILABLE";
          // console.log("Raw -->", rawStatus);
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
      seatGrid.set(
        Array.from({ length: maxRow + 1 }, () =>
          Array.from({ length: maxCol + 1 }, () => null)
        )
      );

      mapped_seats.forEach((seat: any) => {
        const raw = $SeatMapData?.decks[0].seats.find(
          (s: any) => s.number === seat.seatNumber
        );
        const x = raw?.coordinates.x;
        const y = raw?.coordinates.y;
        if (x !== undefined && y !== undefined) {
          $seatGrid[x][y] = seat;
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
  {#if $GenerateBoardingPass_State === "Assignment"}
    <div class="boarding-cnt" bind:this={boardingpass_cnt}>
      {#if assgn_err.message}
        <div style="width: 100%;">
          <Notifier P_error={assgn_err.message} Type={assgn_err.type}
          ></Notifier>
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
        <span
          class="material-symbols-outlined"
          style="font-size: 20px; position: absolute; margin: 20px; padding: 0;"
        >
          search
        </span>
        <button
          style=" background-color: white; background-color: var(--grey-dark); color: white; margin: -15px;
          padding: 4px; display: flex; justify-content: flex-start; align-items: center; width: fit-content; height: fit-content;"
          class="refresh-btn"
          onclick={() => ClearBoardingPass()}
        >
          Reset
        </button>
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
        Seat Map <button
          onclick={() => {
            seatAssignments = {};
            $selectedSeat = null;
          }}>Clear</button
        >
        <span class="cur-seat" style="color: white; font-size: larger;">
          {#if $selectedSeat}
            Currently Selected =
            {#if $selectedSeat && $currentTicket}
              [{#each $selectedSeat as s}
                {s.seatNumber} ,
              {/each}]
              {#if $selectedSeat.length >= $currentTicket.passengers.length}
                Max({$currentTicket.passengers.length})
              {/if}
            {/if}
          {:else}
            Currently Selected Seat None!
          {/if}
        </span>
      </h4>
      <div class="seat-assgn-section">
        {#if !$fetchingTicket && $SeatMapData}
          <div class="seat-grid">
            {#each $seatGrid as row}
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
                  <span
                    >{seatAssignments[p.fullName.trim()] ??
                      "Not Assigned"}</span
                  >
                  <span>
                    {#if seatAssignments[p.fullName]}
                      <button onclick={() => removeSeatAssignment(p.fullName)}
                        >Remove</button
                      >
                    {:else}
                      <button onclick={() => assignSeatToPassenger(p.fullName)}
                        >Assign</button
                      >
                    {/if}
                  </span>
                  <!-- <button onclick={() => assignSeatToPassenger(p.fullName)}
                   >Assign</button
                 > -->
                </div>
              {/each}
            {/if}
            {#if ticketdetail && ticketdetail?.passengers.length > 0}
              <button
                style="background-color: var(--blue);
                 outline: 2px solid var(--grey-light);
                 border: none;
                 cursor: pointer;
                 color: white;
                 padding: 4px;
                 border-radius: 4px;
                 font-size: 14px;
                 transition: all 0.2s;"
                onclick={() => {
                  finalizeAssignments();
                }}>Assign Seat(s)</button
              >
            {/if}
          </div>
        </div>
      </div>
    </div>
  {:else if $GenerateBoardingPass_State === "Loading Pass"}
    <div
      style="grid-column: 1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"
    >
      <DataLoader
        duration={Math.random() * 3500}
        height={60}
        width={60}
        strokeWidth={4}
      ></DataLoader>
    </div>
  {:else if $GenerateBoardingPass_State === "Gen Pass"}
    <div
      style="grid-column: 1; width: 100%; height: 100%;
       max-width: 900px;
      width: 900px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      padding: 1em;
      margin: 0;
      overflow-y: auto;
      padding-bottom: 105px;"
    >
      <p
        style="background-color: var(--blue-dark); width: 100%; text-align: center;
         padding: 10px; color: white; border-radius: 3px; height:fit-content; font-size: 14px;
         display: flex; justify-content: space-between; align-items: center;"
      >
        Generate Boarding Pass <button
          style="background-color: var(--blue-dark);
        outline: 2px solid var(--grey-light);
        border: none;
        cursor: pointer;
        color: white;
        padding: 4px;
        border-radius: 4px;
        font-size: 14px;
        transition: all 0.2s;"
          onclick={() => {
            if (
              ticketdetail &&
              genpass_cnt &&
              $GenerateBoardingPass_State === "Gen Pass"
            ) {
              const res = downloadPass(ticketdetail);
              if (res != true) {
                assgn_err.message = "Pdf Save Error!";
                assgn_err.type = "ERROR";
                setTimeout(() => {
                  assgn_err.message = null;
                }, 4000);
              }
            }
          }}>Generate Pass</button
        >
        <!-- onclick={() => {
          fetchTicketAndOthers({
            ticketNumber: ticketinput,
          });
        }} -->
      </p>
      <GenPass ticket={$currentTicket} bind:this={genpass_cnt}></GenPass>
    </div>
  {/if}
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
