<script lang="ts">
  import { selectedSeat, type Seat } from "./Store/ticket";

  let { seat }: { seat: Seat } = $props();

  function handleClick() {
    if (seat.status === "available") {
      selectedSeat.set(seat.seatNumber);
    }
  }
</script>

<div
  class="seat-cell {seat.status}"
  onclick={handleClick}
  title={seat.status === "occupied" ? `Booked by ${seat.bookedBy}` : ""}
>
  {seat.seatNumber}
</div>

<style>
  .seat-cell {
    width: 5px;
    height: 5px;
    margin: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .available {
    background-color: white;
  }
  .occupied {
    background-color: var(--red);
    color: white;
    cursor: not-allowed;
  }
  .selected {
    background-color: var(--blue);
    color: white;
  }
</style>
