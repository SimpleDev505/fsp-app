<script lang="ts">
  import { addSeat, removeSeat } from "./Store/seat";
  import { currentTicket, selectedSeat, type Seat } from "./Store/ticket";
  import { gsap } from "gsap";
  let { seat }: { seat: Seat } = $props();
  let view_seatinfo_internal = $state(false);
  function handleClick() {
    console.log("Report cLICK -> ", seat.status);
    if (seat.status === "available") {
      if (!($selectedSeat?.length === $currentTicket?.passengers.length)) {
        seat.status = "selected";
        addSeat(seat);
      }
    } else if (seat.status === "selected") {
      seat.status = "available";
      removeSeat(seat.seatNumber);
    }
  }
  $effect(() => {
    if (view_seatinfo_internal) {
      gsap.fromTo(
        ".seat-cell-info",
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.3,
          ease: "back.inOut",
        }
      );
    }
  });
</script>

<div
  onmouseenter={() => {
    view_seatinfo_internal = true;
  }}
  onmouseleave={() => {
    view_seatinfo_internal = false;
  }}
  class="seat-cell {seat.status} {view_seatinfo_internal ? 'view-info' : ''}"
  onmousedown={() => handleClick()}
  title={seat.status === "occupied" ? `Booked by ${seat.bookedBy}` : ""}
>
  <span>{seat.seatNumber}</span>
  {#if view_seatinfo_internal}
    <div class="seat-cell-info">
      {seat.bookedBy}
      {seat.seatNumber}
      {seat.status}
    </div>
  {/if}
</div>

<style>
  .seat-cell {
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 3px;
    font-size: 10px;
    cursor: pointer;
    user-select: none;
  }
  .seat-cell:hover {
    position: absolute;
    z-index: 1000;
  }
  .seat-cell:hover span {
    font-size: 18px;
  }
  .seat-cell-info {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background: white;
    outline: 3px solid var(--blue-dark);
    padding: 12px;
    z-index: 100;
    margin-bottom: 80px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 30px;
    pointer-events: none;
  }
  .available {
    background-color: var(--grey-light);
  }
  .occupied {
    background-color: white;
    color: var(--red);
    cursor: not-allowed;
  }
  .view-info {
    outline: 3px solid var(--blue-dark);
  }
  .selected {
    background-color: var(--blue);
    color: var(--blue-dark);
  }
</style>
