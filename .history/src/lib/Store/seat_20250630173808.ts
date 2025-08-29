import { writable } from "svelte/store";
import { selectedSeat, type Seat } from "./ticket";

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
export function removeSeat(seatNumber: string) {
  selectedSeat.update((currentSeats) => {
    if (!currentSeats) {
      return null;
    }
    const updatedSeats = currentSeats.filter(
      (seat) => seat.seatNumber !== seatNumber
    );
    return updatedSeats.length > 0 ? updatedSeats : null;
  });
}

export const seatGrid = writable<(Seat | null)[][]>([]);
