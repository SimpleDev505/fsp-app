import { writable } from "svelte/store";
import { selectedSeat } from "./ticket";

export const view_seatinfo = writable<boolean>(false);

export function addSeat(newSeat: Seat) {
  selectedSeat.update((currentSeats) => {
    if (!currentSeats) {
      return [newSeat];
    }
    if (!currentSeats.some((seat) => seat.seatNumber === newSeat.seatNumber)) {
      return [...currentSeats, newSeat];
    }
    return currentSeats;
  });
}
