export interface FlightData {
    legs: FlightLeg[]; // Array of flight legs (for one-way, round-trip, or multi-city)
}

export interface FlightLeg {
    segment: number; // Index of timing (0 for one-way/round-trip outbound, 1 for return, etc.)
    flights: Flight[]; // Flights matching the segment
}

export interface Flight {
    icao24: string; // Unique ICAO 24-bit address
    callsign: string | null; // Callsign (e.g., "AIC123")
    estDepartureAirport: string | null; // ICAO code of departure airport
    estArrivalAirport: string | null; // ICAO code of arrival airport
    firstSeen: number; // Unix timestamp of departure
    lastSeen: number; // Unix timestamp of arrival
    airline: string | null; // Airline name (mocked from callsign)
}
