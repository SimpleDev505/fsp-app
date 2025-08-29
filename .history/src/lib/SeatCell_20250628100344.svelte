<script lang="ts">
  import { selectedSeat, type Seat } from "./Store/ticket";

  let { seat }: { seat: Seat } = $props();

  function handleClick() {
    if (seat.status === "available") {
      selectedSeat.set(seat);
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
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 3px;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .available {
    background-color: var(--grey-light);
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
