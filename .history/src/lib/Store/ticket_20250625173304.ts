import axios from "axios";
import { get, writable } from "svelte/store";
import { SelectedFlight, type TravelerInfo } from "./store";
import { LoginData } from "./login";
export interface TicketUser {
  id: string;
  username: string;
  email: string;
  phone: string;
}

export interface TicketFlight {
  flightId: string;
  airlineCode: string;
  flightNumber: string;
  aircraftCode: string;
  from: {
    iataCode: string;
    terminal?: string;
    dateTime: string;
  };
  to: {
    iataCode: string;
    terminal?: string;
    dateTime: string;
  };
  duration: string;
  isNonStop: boolean;
  stops: number;
  price: {
    base: string;
    total: string;
    currency: string;
  };
}

export interface TicketData {
  ticketNumber: string;
  user: TicketUser;
  flight: TicketFlight;
  passengers: TravelerInfo[];
  bookingDate: string;
  createdAt?: string;
}

export interface OtherPassengerInfo {
  ticketNumber: string;
  fullName: string;
  age: number;
  gender: string;
  travelerType: string;
  seatNumber: string | null;
}
export const currentTicket = writable<TicketData | null>(null);
export const otherPassengersOnSameFlight = writable<OtherPassengerInfo[]>([]);
export async function bookTicket() {
  const selectedFlight = get(SelectedFlight); // Get current flight details from writable store
  const loginInfo = get(LoginData); // Get current login data (you may get it from session or store)

  try {
    const bookingData = {
      userId: loginInfo?.id,
      username: loginInfo?.username,
      email: loginInfo?.email,
      phone: loginInfo?.phone,
      flightDetails: selectedFlight,
      passengers: selectedFlight?.passengers.map((p: { info: any }) => p.info),
      bookingDate: new Date().toISOString(), // current date-time in ISO format
    };

    const response = await axios.post(
      "http://localhost:8080/api/book-ticket",
      bookingData
    );
    console.log("New Ticket : ", response.data.ticket.ticketNumber);
    console.log(response.data.message); // Success message from server
  } catch (error) {
    console.error("Error during booking:", error);
  }
}
