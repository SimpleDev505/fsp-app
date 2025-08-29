import axios from "axios";
import { writable } from "svelte/store";

export interface SeatSegment {
  from: string; // e.g. NCE
  to: string; // e.g. ORY
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
}
export const SeatMapData = writable<SeatMapInfo | null>(null);

export async function fetchSeatMap(flightOffer: any) {
  try {
    const AMADEUS_CLIENT_SECRET = import.meta.env.VITE_CLIENTSEC;
    const AMADEUS_CLIENT_ID = import.meta.env.VITE_CLIENTID;
    const tokenRes = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const token = tokenRes.data.access_token;
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/shopping/seatmaps",
      {
        data: [flightOffer],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-HTTP-Method-Override": "GET",
          "Content-Type": "application/json",
        },
      }
    );

    const seatmapData = response.data?.data?.[0];

    if (!seatmapData) {
      console.error("Seat map response missing data.");
      return;
    }

    const formatted: SeatMapInfo = {
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
          trav.fareDetailsBySegment[0].includedCheckedBags.quantity,
      })),
    };

    SeatMapData.set(formatted);
  } catch (err) {
    console.error("Failed to fetch seat map:", err);
  }
}
