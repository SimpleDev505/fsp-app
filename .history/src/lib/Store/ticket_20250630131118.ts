import axios from "axios";
import { get, writable } from "svelte/store";
import { SelectedFlight, type TravelerInfo } from "./store";
import { LoginData } from "./login";
import { SelectedFlightOffer, type FlightOffer } from "./search";
export const TickedMode = writable<
  "PAYMENT PROCESSING" | "PAYED" | "PAYERROR" | "VIEW PAYMENT"
>("VIEW PAYMENT");
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
export function buildFlightOfferFromTicket(ticket: TicketData): FlightOffer {
  const segmentId = "1"; // Use fixed or derived unique value
  return {
    id: ticket.flight.flightId || "1",
    source: "GDS",
    oneWay: true,
    instantTicketingRequired: false,
    nonHomogeneous: false,
    isUpsellOffer: false,
    lastTicketingDate: ticket.bookingDate,
    lastTicketingDateTime: ticket.bookingDate,
    numberOfBookableSeats: ticket.passengers.length,
    price: {
      currency: ticket.flight.price.currency,
      total: ticket.flight.price.total,
      base: ticket.flight.price.base,
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    },
    validatingAirlineCodes: [ticket.flight.airlineCode],
    itineraries: [
      {
        duration: ticket.flight.duration,
        segments: [
          {
            id: segmentId,
            duration: ticket.flight.duration,
            numberOfStops: ticket.flight.stops,
            carrierCode: ticket.flight.airlineCode,
            number: ticket.flight.flightNumber,
            blacklistedInEU: false,
            aircraft: {
              code: ticket.flight.aircraftCode,
            },
            operating: {
              carrierCode: ticket.flight.airlineCode,
            },
            departure: {
              iataCode: ticket.flight.from.iataCode,
              at: ticket.flight.from.dateTime,
              terminal: ticket.flight.from.terminal,
            },
            arrival: {
              iataCode: ticket.flight.to.iataCode,
              at: ticket.flight.to.dateTime,
              terminal: ticket.flight.to.terminal,
            },
          },
        ],
      },
    ],
    travelerPricings: ticket.passengers.map((traveler, index) => ({
      travelerId: (index + 1).toString(),
      fareOption: "STANDARD",
      travelerType: traveler.travelerType,
      price: {
        currency: ticket.flight.price.currency,
        total: ticket.flight.price.total,
        base: ticket.flight.price.base,
      },
      fareDetailsBySegment: [
        {
          segmentId,
          cabin: "ECONOMY",
          brandedFare: "LIGHT",
          brandedFareLabel: "Standard",
          fareBasis: "Y",
          class: "Y",
        },
      ],
    })),
  };
}
export const fetchingTicket = writable<boolean>(false);
function getCleanFlightOffer() {
  const raw = get(SelectedFlightOffer);
  if (!raw) return null;

  let fixedFees = raw.price.fees;
  if (typeof fixedFees === "string") {
    try {
      fixedFees = JSON.parse(fixedFees);
    } catch {
      console.warn(
        "Could not parse flightOffer.price.fees, falling back to []"
      );
      fixedFees = [];
    }
  }

  // Return a new object with everything else unchanged, but with fees corrected
  const _selectedFlightOffer = {
    ...raw,
    price: {
      ...raw.price,
      fees: fixedFees,
    },
  };

  return _selectedFlightOffer;
}
export async function bookTicket() {
  const _selectedFlight = get(SelectedFlight); // Get current flight details from writable store
  const _loginInfo = get(LoginData); // Get current login data (you may get it from session or store)
  const _selectedFlightOffer = getCleanFlightOffer();
  // const _selectedFlightOffer = get(SelectedFlightOffer);
  console.log("fixed ->", _selectedFlightOffer);
  try {
    TickedMode.set("PAYMENT PROCESSING");
    console.log("Booking Starting");
    const bookingData = {
      userId: _loginInfo?.id,
      username: _loginInfo?.username,
      email: _loginInfo?.email,
      phone: _loginInfo?.phone,
      flightDetails: _selectedFlight,
      sflightoffer: _selectedFlightOffer,
      passengers: _selectedFlight?.passengers.map((p: { info: any }) => p.info),
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
    TickedMode.set("PAYERROR");
  }
}
export async function fetchTicketAndOthers({
  ticketNumber,
  bookingDate,
}: {
  ticketNumber?: string;
  bookingDate?: string;
}) {
  try {
    fetchingTicket.set(true);
    const res = await axios
      .post("http://localhost:8080/api/tickets/search", {
        ticketNumber,
        bookingDate,
      })
      .then((res) => {
        fetchingTicket.set(false);
        setTimeout(() => {
          fetchingTicket.set(false);
          currentTicket.set(res.data.currentTicket);
        }, 3000);
        otherPassengersOnSameFlight.set(res.data.otherPassengersOnSameFlight);
      })
      .catch((err) => {
        fetchingTicket.set(false);
        currentTicket.set(null);
        seatMapData.set([]);
      });
    return false;
  } catch (err) {
    fetchingTicket.set(false);
    console.error("Failed to fetch ticket data:", err);
  }
}
//Assignment
export interface Seat {
  seatNumber: string;
  status: "available" | "occupied" | "selected" | "blocked";
  bookedBy?: string;
}
export const selectedSeat = writable<Seat[] | null>(null);
export const seatMapData = writable<Seat[][]>();
export async function assignSeats(
  ticketNumber: string,
  seatAssignments: string[]
) {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/tickets/assign-seats",
      {
        ticketNumber,
        seatAssignments,
      }
    );

    console.log(res.data.message);

    // Refresh current ticket after seat assignment
    currentTicket.set(res.data.ticket);
  } catch (err) {
    console.error("Seat assignment failed:", err);
  }
}
