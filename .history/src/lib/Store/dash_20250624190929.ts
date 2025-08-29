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
export const flightStats = writable<FlightStatus>({
  airportCode: "JFK",
  cancelledCount: 0,
  date: "2023-11-12",
  delayedCount: 0,
  onTimeCount: 0,
  probability: 0,
  resultScore: 0,
});
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

    const status = parseFloat(result) >= 0.75 ? "delayed" : "on-time";

    flightStats.update((prev) => ({
      airportCode,
      date,
      onTimeCount: prev.onTimeCount + (status === "on-time" ? 1 : 0),
      delayedCount: prev.delayedCount + (status === "delayed" ? 1 : 0),
      cancelledCount: prev.cancelledCount,
      resultScore: parseFloat(result),
      probability: parseFloat(probability),
    }));
  } catch (err) {
    console.error("Error fetching flight status:", err);
  }
}

//Weather
interface ForecastDay {
  date: string;
  temperatureCelsius: number;
  weatherType: string;
}

export interface WeatherInfo {
  forecast: ForecastDay[];
}
export const weatherInfo = writable<WeatherInfo>({ forecast: [] });

const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 1);
const WEATHER_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${
  import.meta.env.VITE_WEATHER_KEY
}&q=LOCATION&days=7`;

export async function fetchWeather() {
  try {
    const res = await axios.get(WEATHER_API_URL);
    const data = await res.data;
    const forecastList =
      data.forecast?.forecastday?.map((day: any) => ({
        date: day.date,
        temperatureCelsius: day.day.avgtemp_c,
        weatherType: day.day.condition.text,
      })) ?? [];

    weatherInfo.set({ forecast: forecastList });
    console.log(forecastList);
  } catch (error) {
    console.error("Weather API error:", error);
  }
}
