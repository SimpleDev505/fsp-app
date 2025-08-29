import { writable } from "svelte/store";

export const view_seatinfo = writable<boolean>(false);

export function addSeat(newSeat: Seat) {
  selectedSeat.update((currentSeats) => {
    // If the store is null, initialize it with the new seat
    if (!currentSeats) {
      return [newSeat];
    }
    // Check if the seat already exists to avoid duplicates
    if (!currentSeats.some((seat) => seat.seatNumber === newSeat.seatNumber)) {
      return [...currentSeats, newSeat];
    }
    return currentSeats; // Return unchanged if seat already exists
  });
}
