import axios from "axios";
import { writable } from "svelte/store";

export interface FlightStatus {
  airportCode: string;
  date: string;
  onTimeCount: number;
  delayedCount: number;
  cancelledCount: number;
  resultScore: number;
  probability: number;
}
export const flightStats = writable<FlightStatus>();
const AIRPORT_CODES = [
  "JFK",
  "BOM",
  "DEL",
  "LHR",
  "DXB",
  "SFO",
  "CDG",
  "FRA",
  "HND",
  "SIN",
];

function getRandomAirportCode() {
  const i = Math.floor(Math.random() * AIRPORT_CODES.length);
  return AIRPORT_CODES[i];
}

function getCurrentDateISO(): string {
  return new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
}

export async function fetchFlightStatus() {
  const airportCode = getRandomAirportCode();
  const date = getCurrentDateISO();
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

  try {
    const res = await fetch(
      `https://test.api.amadeus.com/v1/airport/predictions/on-time?airportCode=${airportCode}&date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await res.json();
    const { probability, result } = json.data;

    const status = parseFloat(result) >= 0.75 ? "on-time" : "delayed";

    flightStats.update((prev) => ({
      airportCode,
      date,
      onTimeCount: prev.onTimeCount + (status === "on-time" ? 1 : 0),
      delayedCount: prev.delayedCount + (status === "delayed" ? 1 : 0),
      cancelledCount: prev.cancelledCount, // Optional if you later support this
      resultScore: parseFloat(result),
      probability: parseFloat(probability),
    }));
  } catch (err) {
    console.error("Error fetching flight status:", err);
  }
}
