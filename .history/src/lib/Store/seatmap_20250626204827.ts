import axios from "axios";
import { writable } from "svelte/store";
import type { FlightOffer } from "./search";
export interface SeatCoordinates {
  x: number;
  y: number;
}

export interface SeatFacility {
  code: string;
  column: string;
  row?: string;
  position: "FRONT" | "REAR" | "SEAT";
  coordinates: SeatCoordinates;
}

export interface SeatCellInfo {
  number: string;
  cabin: string;
  coordinates: SeatCoordinates;
  characteristicsCodes: string[];
  travelerPricing: {
    travelerId: string;
    seatAvailabilityStatus: "AVAILABLE" | "BLOCKED" | "TAKEN";
  }[];
}

export interface SeatDeckConfig {
  width: number;
  length: number;
  startSeatRow: number;
  endSeatRow: number;
  startWingsRow: number;
  endWingsRow: number;
  exitRowsX: number[];
}

export interface SeatDeck {
  deckType: string; // e.g. MAIN
  deckConfiguration: SeatDeckConfig;
  facilities: SeatFacility[];
  seats: SeatCellInfo[];
}

export interface SeatSegment {
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  carrierCode: string;
  aircraftCode: string;
  duration: string;
  segmentId: string;
}

export interface SeatTraveler {
  travelerId: string;
  travelerType: "ADULT" | "CHILD" | "INFANT";
  fareOption: string;
  totalPrice: string;
  basePrice: string;
  cabinClass: string;
  brandedFare: string;
  includedCheckedBags: number;
}

export interface SeatMapInfo {
  flightId: string;
  airlineCode: string;
  totalPrice: string;
  currency: string;
  numberOfSeats: number;
  segments: SeatSegment[];
  travelers: SeatTraveler[];
  decks: SeatDeck[];
}
export const SeatMapData = writable<SeatMapInfo | null>(null);

// export async function fetchSeatMap(flightOffer: FlightOffer) {
//   try {
//     const AMADEUS_CLIENT_SECRET = import.meta.env.VITE_CLIENTSEC;
//     const AMADEUS_CLIENT_ID = import.meta.env.VITE_CLIENTID;
//     const tokenRes = await axios.post(
//       "https://test.api.amadeus.com/v1/security/oauth2/token",
//       new URLSearchParams({
//         grant_type: "client_credentials",
//         client_id: AMADEUS_CLIENT_ID,
//         client_secret: AMADEUS_CLIENT_SECRET,
//       }),
//       { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//     );

//     const token = tokenRes.data.access_token;
//     const response = await axios.post(
//       "https://test.api.amadeus.com/v1/shopping/seatmaps",
//       {
//         data: [flightOffer],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-HTTP-Method-Override": "GET",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const seatmapData = response.data?.[1]?.[0]; // seatmap array
//     const dictionaries = response.data?.[2]; // seat - Characteristics, facilities, etc.

//     if (!seatmapData) {
//       console.error("Seat map response missing data.");
//       return;
//     }

//     const formatted: SeatMapInfo = {
//       flightId: flightOffer.id,
//       airlineCode: flightOffer.validatingAirlineCodes[0],
//       totalPrice: flightOffer.price.total,
//       currency: flightOffer.price.currency,
//       numberOfSeats: flightOffer.numberOfBookableSeats,
//       segments: flightOffer.itineraries.flatMap((it: any) =>
//         it.segments.map((seg: any) => ({
//           from: seg.departure.iataCode,
//           to: seg.arrival.iataCode,
//           departureTime: seg.departure.at,
//           arrivalTime: seg.arrival.at,
//           carrierCode: seg.carrierCode,
//           aircraftCode: seg.aircraft.code,
//           duration: seg.duration,
//           segmentId: seg.id,
//         }))
//       ),
//       travelers: flightOffer.travelerPricings.map((trav: any) => ({
//         travelerId: trav.travelerId,
//         travelerType: trav.travelerType,
//         fareOption: trav.fareOption,
//         totalPrice: trav.price.total,
//         basePrice: trav.price.base,
//         cabinClass: trav.fareDetailsBySegment[0].cabin,
//         brandedFare: trav.fareDetailsBySegment[0].brandedFare,
//         includedCheckedBags:
//           trav.fareDetailsBySegment[0].includedCheckedBags?.quantity ?? 0,
//       })),
//       decks: seatmapData.decks.map((deck: any) => ({
//         deckType: deck.deckType,
//         deckConfiguration: deck.deckConfiguration,
//         facilities: deck.facilities.map((fac: any) => ({
//           code: fac.code,
//           column: fac.column,
//           row: fac.row,
//           position: fac.position,
//           coordinates: fac.coordinates,
//         })),
//         seats: deck.seats.map((seat: any) => ({
//           number: seat.number,
//           cabin: seat.cabin,
//           coordinates: seat.coordinates,
//           characteristicsCodes: seat.characteristicsCodes,
//           travelerPricing: seat.travelerPricing.map((tp: any) => ({
//             travelerId: tp.travelerId,
//             seatAvailabilityStatus: tp.seatAvailabilityStatus,
//           })),
//         })),
//       })),
//     };
//     SeatMapData.set(formatted);
//   } catch (err) {
//     console.error("Failed to fetch seat map:", err);
//   }
// }
export async function fetchSeatMap(flightOffer: FlightOffer) {
  try {
    const response = await fetch("http://localhost:8080/seatmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flightOffer }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch seat map");
    }

    const data = await response.json();

    // Now parse and set into SeatMapData like before
    const seatmapData = data?.data?.[0];

    if (!seatmapData) {
      console.error("Seat map response missing data.");
      return;
    }

    const formatted = {
      flightId: flightOffer.id,
      airlineCode: flightOffer.validatingAirlineCodes[0],
      totalPrice: flightOffer.price.total,
      currency: flightOffer.price.currency,
      numberOfSeats: flightOffer.numberOfBookableSeats,
      segments: flightOffer.itineraries.flatMap((it: any) =>
        it.segments.map((seg: any) => ({
          from: seg.departure.iataCode,
          to: seg.arrival.iataCode,
          departureTime: seg.departure.at,
          arrivalTime: seg.arrival.at,
          carrierCode: seg.carrierCode,
          aircraftCode: seg.aircraft.code,
          duration: seg.duration,
          segmentId: seg.id,
        }))
      ),
      travelers: flightOffer.travelerPricings.map((trav: any) => ({
        travelerId: trav.travelerId,
        travelerType: trav.travelerType,
        fareOption: trav.fareOption,
        totalPrice: trav.price.total,
        basePrice: trav.price.base,
        cabinClass: trav.fareDetailsBySegment[0].cabin,
        brandedFare: trav.fareDetailsBySegment[0].brandedFare,
        includedCheckedBags:
          trav.fareDetailsBySegment[0].includedCheckedBags?.quantity ?? 0,
      })),
      decks: seatmapData.decks.map((deck: any) => ({
        deckType: deck.deckType,
        deckConfiguration: deck.deckConfiguration,
        facilities: deck.facilities.map((fac: any) => ({
          code: fac.code,
          column: fac.column,
          row: fac.row,
          position: fac.position,
          coordinates: fac.coordinates,
        })),
        seats: deck.seats.map((seat: any) => ({
          number: seat.number,
          cabin: seat.cabin,
          coordinates: seat.coordinates,
          characteristicsCodes: seat.characteristicsCodes,
          travelerPricing: seat.travelerPricing.map((tp: any) => ({
            travelerId: tp.travelerId,
            seatAvailabilityStatus: tp.seatAvailabilityStatus,
          })),
        })),
      })),
    };

    SeatMapData.set(formatted);
  } catch (err) {
    console.error("Failed to fetch seat map:", err);
  }
}
