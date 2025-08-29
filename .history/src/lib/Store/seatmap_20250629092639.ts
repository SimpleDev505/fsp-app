import axios from "axios";
import { writable } from "svelte/store";
import type { FlightOffer } from "./search";
import { seatmapdata } from "$lib/seatmap.json";
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

export async function fetchSeatMap(flightOffer: FlightOffer) {
  try {
    // verifyFlightOfferStructure(flightOffer);
    // const AMADEUS_CLIENT_SECRET = import.meta.env.VITE_CLIENTSEC;
    // const AMADEUS_CLIENT_ID = import.meta.env.VITE_CLIENTID;
    // const tokenRes = await axios.post(
    //   "https://test.api.amadeus.com/v1/security/oauth2/token",
    //   new URLSearchParams({
    //     grant_type: "client_credentials",
    //     client_id: AMADEUS_CLIENT_ID,
    //     client_secret: AMADEUS_CLIENT_SECRET,
    //   }),
    //   { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    // );
    // const fixedOffer = normalizeFlightOffer(flightOffer);
    // const token = tokenRes.data.access_token;
    // const response = await axios.post(
    //   "https://test.api.amadeus.com/v1/shopping/seatmaps",
    //   {
    //     data: [
    //       {
    //         type: "flight-offer",
    //         ...fixedOffer,
    //         lastTicketingDateTime: undefined,
    //       },
    //     ],
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    let response = JSON.parse("src/lib/seatmap.json");
    const seatmapData = response.data.data?.[0]; // safely get the first seatmap object
    const dictionaries = response.data.dictionaries;
    console.log("Seatmap -> ", response.data);
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
export function normalizeFlightOffer(original: any): any {
  const flightOffer = structuredClone(original);
  const fixes: string[] = [];

  // Top-level defaults
  flightOffer.type = flightOffer.type ?? "flight-offer";

  if (!flightOffer.id) {
    flightOffer.id = "1";
    fixes.push("Added default 'id'");
  }

  if (!flightOffer.source) {
    flightOffer.source = "GDS";
    fixes.push("Added default 'source': 'GDS'");
  }

  flightOffer.instantTicketingRequired ??= false;
  flightOffer.nonHomogeneous ??= false;
  flightOffer.oneWay ??= false;

  if (!flightOffer.lastTicketingDate) {
    flightOffer.lastTicketingDate = new Date().toISOString().split("T")[0];
    fixes.push("Added current 'lastTicketingDate'");
  }

  if (!flightOffer.lastTicketingDateTime) {
    flightOffer.lastTicketingDateTime = new Date().toISOString();
    fixes.push("Added current 'lastTicketingDateTime'");
  }

  if (!flightOffer.numberOfBookableSeats) {
    flightOffer.numberOfBookableSeats = 1;
    fixes.push("Added default 'numberOfBookableSeats': 1");
  }

  if (!flightOffer.price) {
    flightOffer.price = { currency: "USD", total: "100.00", base: "80.00" };
    fixes.push("Inserted minimal 'price' structure");
  }

  if (!flightOffer.pricingOptions) {
    flightOffer.pricingOptions = {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false,
    };
    fixes.push("Inserted 'pricingOptions'");
  }

  if (!Array.isArray(flightOffer.validatingAirlineCodes)) {
    flightOffer.validatingAirlineCodes = ["ZZ"];
    fixes.push("Inserted 'validatingAirlineCodes': ['ZZ']");
  }

  // Itineraries & segments
  if (
    !Array.isArray(flightOffer.itineraries) ||
    flightOffer.itineraries.length === 0
  ) {
    flightOffer.itineraries = [
      {
        duration: "PT1H",
        segments: [
          {
            id: "1",
            duration: "PT1H",
            numberOfStops: 0,
            carrierCode: "ZZ",
            number: "9999",
            blacklistedInEU: false,
            aircraft: { code: "320" },
            operating: { carrierCode: "ZZ" },
            departure: {
              iataCode: "AAA",
              terminal: "1",
              at: new Date().toISOString(),
            },
            arrival: {
              iataCode: "BBB",
              terminal: "1",
              at: new Date(Date.now() + 3600000).toISOString(),
            },
          },
        ],
      },
    ];
    fixes.push("Inserted dummy itinerary and segment");
  } else {
    for (const itinerary of flightOffer.itineraries) {
      for (const seg of itinerary.segments) {
        if (seg?.number?.match(/^[A-Z]{2} \d+$/)) {
          seg.number = seg.number.split(" ")[1]; // convert "AI 440" → "440"
          fixes.push(`Normalized flight number '${seg.number}'`);
        }
      }
    }
  }

  // Traveler pricings
  if (!Array.isArray(flightOffer.travelerPricings)) {
    flightOffer.travelerPricings = [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: flightOffer.price?.currency ?? "USD",
          total: flightOffer.price?.total ?? "100.00",
          base: flightOffer.price?.base ?? "80.00",
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            brandedFare: "LIGHT",
            brandedFareLabel: "Standard",
            fareBasis: "Y",
            class: "Y",
            includedCheckedBags: {
              weight: 15,
              weightUnit: "KG",
            },
          },
        ],
      },
    ];
    fixes.push("Added dummy 'travelerPricings'");
  }

  // Show summary
  if (fixes.length > 0) {
    console.warn(
      "FlightOffer had missing/invalid fields. Applied corrections:"
    );
    fixes.forEach((fix) => console.log(" -", fix));
  } else {
    console.info("FlightOffer structure is valid.");
  }

  return flightOffer;
}

function verifyFlightOfferStructure(flightOffer: any): boolean {
  const errors: string[] = [];

  if (!flightOffer) {
    console.error("❌ flightOffer is null or undefined.");
    return false;
  }

  if (flightOffer.type !== "flight-offer") {
    errors.push(
      `Missing or invalid 'type'. Expected: "flight-offer", got: ${flightOffer.type}`
    );
  }

  if (!Array.isArray(flightOffer.itineraries)) {
    errors.push("Missing or invalid 'itineraries' array.");
  } else {
    flightOffer.itineraries.forEach((itin: any, idx: number) => {
      if (!Array.isArray(itin.segments)) {
        errors.push(`Missing 'segments' array in itineraries[${idx}]`);
      } else {
        itin.segments.forEach((seg: any, sIdx: number) => {
          if (!seg.departure?.iataCode || !seg.arrival?.iataCode) {
            errors.push(
              `Missing departure or arrival codes in itineraries[${idx}].segments[${sIdx}]`
            );
          }
          if (!seg.aircraft?.code) {
            errors.push(
              `Missing aircraft.code in itineraries[${idx}].segments[${sIdx}]`
            );
          }
        });
      }
    });
  }

  if (!flightOffer.price?.currency || !flightOffer.price?.total) {
    errors.push("Missing 'price.currency' or 'price.total'");
  }

  if (!Array.isArray(flightOffer.travelerPricings)) {
    errors.push("Missing or invalid 'travelerPricings' array.");
  } else {
    flightOffer.travelerPricings.forEach((tp: any, idx: number) => {
      if (!tp.travelerId) {
        errors.push(`Missing 'travelerId' in travelerPricings[${idx}]`);
      }
      if (!Array.isArray(tp.fareDetailsBySegment)) {
        errors.push(
          `Missing 'fareDetailsBySegment' array in travelerPricings[${idx}]`
        );
      }
    });
  }

  if (
    !Array.isArray(flightOffer.validatingAirlineCodes) ||
    !flightOffer.validatingAirlineCodes[0]
  ) {
    errors.push("Missing or invalid 'validatingAirlineCodes'");
  }

  if (errors.length > 0) {
    console.warn("❌ FlightOffer structure is invalid:");
    errors.forEach((err) => console.warn(" - " + err));
    return false;
  }

  console.info("✅ FlightOffer structure looks valid.");
  return true;
}
// export async function fetchSeatMap(flightOffer: FlightOffer) {
//   try {
//     // if (!verifyFlightOfferStructure(flightOffer)) {
//     //   return;
//     // }
//     const fixedOffer = normalizeFlightOffer(flightOffer);
//     const response = await axios.post("http://localhost:8080/seatmap", {
//       fixedOffer,
//     });
//     console.log("Seat Map Data:", response.data);
//     if (!response.status) {
//       throw new Error("Failed to fetch seat map");
//     }

//     // Now parse and set into SeatMapData like before
//     const seatmapData = response.data;

//     if (!seatmapData) {
//       console.error("Seat map response missing data.");
//       return;
//     }

//     const formatted = {
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
