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
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/shopping/seatmaps",
      {
        data: [flightOffer],
      },
      {
        headers: {
          Authorization: `Bearer ${your_token}`,
          "X-HTTP-Method-Override": "GET",
          "Content-Type": "application/json",
        },
      }
    );

    const data = flightOffer;
    const formatted: SeatMapInfo = {
      flightId: data.id,
      airlineCode: data.validatingAirlineCodes[0],
      totalPrice: data.price.total,
      currency: data.price.currency,
      numberOfSeats: data.numberOfBookableSeats,
      segments: data.itineraries.flatMap((it: any) =>
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
      travelers: data.travelerPricings.map((trav: any) => ({
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
