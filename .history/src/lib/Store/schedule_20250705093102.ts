import { writable } from "svelte/store";
import type { FlightOffer } from "./search";
import axios from "axios";

export interface ScheduledFlight {
  scheduledType: "DELAY" | "RESCHEDULED" | "CANCELED";
  rescheduledTime?: string;
  delayTime?: string;
  flight: FlightOffer;
}
export const schFlights = writable<ScheduledFlight[]>([
  {
    flight: {
      id: "",
      source: "",
      oneWay: false,
      instantTicketingRequired: false,
      nonHomogeneous: false,
      isUpsellOffer: false,
      lastTicketingDate: "",
      lastTicketingDateTime: "",
      numberOfBookableSeats: 0,
      price: {
        currency: "",
        total: "",
        base: undefined,
        grandTotal: undefined,
        fees: undefined,
      },
      pricingOptions: {
        fareType: [],
        includedCheckedBagsOnly: false,
      },
      validatingAirlineCodes: [],
      itineraries: [],
      travelerPricings: [],
    },
    scheduledType: "DELAY",
    delayTime: "",
  },
]);

export async function postScheduledFlight(data: ScheduledFlight) {
  await axios.post("http://localhost:8080/api/schedule", data);
}
export async function fetchLatestScheduledFlights() {
  const res = await axios.get("http://localhost:8080/api/schedule/latest");
  schFlights.set(res.data);
}
