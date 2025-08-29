<script lang="ts">
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import {
    currentTicket,
    fetchTicketAndOthers,
    type TicketData,
  } from "./Store/ticket";

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
      <span>PassengerName {ticketdetail?.user.username}</span>
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
          <span style="outline:  none;">{ticketdetail?.flight.from}</span>
        </span>
        <span>Flight Hrs {ticketdetail?.flight.duration.split("PT")}</span>
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
          <span style="outline:  none;">{ticketdetail?.flight.to}</span>
        </span>
      </div>
      <span>{ticketdetail?.flight.from.terminal}</span>
      <span>Contact {ticketdetail?.user.email}</span>
      <span>Stops {ticketdetail?.flight.stops}</span>
      <span>Booking Date {ticketdetail?.bookingDate.split("T")}</span>
      <span>Status</span>
    </div>
  </div>
  <!-- Column 2 -->
  <div class="boarding-detail"></div>
</div>

<style>
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
