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
    width: 30px;
    height: 30px;
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
    background-color: #e0f7fa;
  }
  .occupied {
    background-color: #f44336;
    color: white;
    cursor: not-allowed;
  }
  .selected {
    background-color: #29b6f6;
    color: white;
  }
</style>
