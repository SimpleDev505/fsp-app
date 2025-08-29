import { get, writable } from "svelte/store";
import type { FlightOffer } from "./search";
import axios from "axios";
import { LoginType } from "./login";
import { LoadingType } from "./dash";

export interface ScheduledFlight {
  scheduledType: "DELAY" | "RESCHEDULED" | "CANCELED";
  rescheduledTime?: string;
  delayTime?: string;
  flight: FlightOffer;
  scheduledBy?: string;
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
export async function LoadLatestScheduledFlights(): Promise<void> {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/schedule/latest`
    );
    schFlights.set(response.data);
    console.log(get(schFlights));
    setTimeout(() => {
      LoadingType.set(null);
    }, 4000);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.message);
    }
    throw new Error("Failed to load flight history");
  }
}

export async function fetchScheduledFlightsByUsername(username: string) {
  if (!username) return;

  try {
    const res = await axios.get<ScheduledFlight[] | null>(
      `http://localhost:8080/api/scheduled-flights/by-user`,
      { params: { username } }
    );

    return res.data || null;
  } catch (err: any) {
    console.error("Error fetching scheduled flights:", err);
  }
}
