<script lang="ts">
  import { view_seatinfo } from "./Store/seat";
  import { selectedSeat, type Seat } from "./Store/ticket";
  import { gsap } from "gsap";
  let { seat }: { seat: Seat } = $props();
  let view_seatinfo_internal = $state(false);
  function handleClick() {
    if (seat.status === "available") {
      selectedSeat.set(seat);
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
    view_seatinfo.set(true);
  }}
  onmouseleave={() => {
    view_seatinfo_internal = false;
    view_seatinfo.set(false);
  }}
  class="seat-cell {seat.status} {view_seatinfo_internal ? 'view-info' : ''}"
  onclick={handleClick}
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
  }
  .seat-cell:hover {
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
    margin-bottom: 60px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 30px;
  }
  .available {
    background-color: var(--grey-light);
  }
  .occupied {
    background-color: var(--red);
    color: white;
    cursor: not-allowed;
  }
  .view-info {
    outline: 3px solid var(--blue-dark);
  }
  .selected {
    background-color: var(--blue);
    color: white;
  }
</style>
