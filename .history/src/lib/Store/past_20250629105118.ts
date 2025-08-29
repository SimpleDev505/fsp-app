import axios from "axios";
import { get, writable } from "svelte/store";
import { currentTicket } from "./ticket";

export interface PastFlight {
  ticketNumber: string;
  bookingDate: string;
  from: {
    iataCode: string;
    dateTime: string;
    terminal: string;
  };
  to: {
    iataCode: string;
    dateTime: string;
    terminal: string;
  };
  flightNumber: string;
  airlineCode: string;
  duration: string;
  aircraftCode: string;
  price: {
    total: string;
    currency: string;
  };
  passengers: {
    fullName: string;
    seatNumber: string;
    travelerType: string;
  }[];
}
export const pastFlightsData = writable<PastFlight[]>([]);

export async function fetchPastFlights(userId: string) {
  try {
    const res = await axios.get("http://localhost:8080/api/tickets/past", {
      params: { userId },
    });

    console.log("Past ->", res);
    if (typeof res.data === "string")
      throw new Error("Expected JSON but received HTML/string");
    const flights: PastFlight[] = res.data;
    let flights_processed: PastFlight[] = flights;
    if (get(currentTicket)) {
      flights_processed = flights.filter(
        (flight) => flight.bookingDate !== get(currentTicket)?.bookingDate
      );
    }
    pastFlightsData.set(flights_processed);
  } catch (err) {
    console.error("Error fetching past flights:", err);
    pastFlightsData.set([]);
  }
}
