interface StateVector {
    icao24: string;
    callsign: string | null;
    origin_country: string;
    time_position: number | null;
    last_contact: number;
    longitude: number | null;
    latitude: number | null;
    baro_altitude: number | null;
    on_ground: boolean;
    velocity: number | null;
    true_track: number | null;
    vertical_rate: number | null;
    sensors: number[] | null;
    geo_altitude: number | null;
    squawk: string | null;
    spi: boolean;
    position_source: number;
}

interface OpenSkyStatesResponse {
    time: number;
    states: StateVector[];
}

interface FlightInfo {
    icao24: string;
    firstSeen: number;
    estDepartureAirport: string | null;
    lastSeen: number;
    estArrivalAirport: string | null;
    callsign: string | null;
    estDepartureAirportHorizDistance: number | null;
    estDepartureAirportVertDistance: number | null;
    estArrivalAirportHorizDistance: number | null;
    estArrivalAirportVertDistance: number | null;
    departureAirportCandidatesCount: number;
    arrivalAirportCandidatesCount: number;
}

interface FlightSearchResult {
    route: string;
    date: string;
    flights: FlightInfo[];
}

interface SearchState {
    isLoading: boolean;
    results: FlightSearchResult[];
    error: string | null;
    lastSearchTime: number;
}

//Filters
export const AIRPORT_ICAO_MAP: Record<string, string> = {
    "DEL": "VIDP", // Delhi
    "BOM": "VABB", // Mumbai
    "BLR": "VOBL", // Bangalore
    "MAA": "VOMM", // Chennai
    "CCU": "VECC", // Kolkata
    "HYD": "VOHS", // Hyderabad
    "AMD": "VAAH", // Ahmedabad
    "COK": "VOCI", // Kochi
    "TRV": "VOTV", // Trivandrum
    "GOI": "VOGO", // Goa
};

// Airline ICAO mapping
export const AIRLINE_ICAO_MAP: Record<string, string[]> = {
    "Air India": ["AIC"],
    "SpiceJet": ["SEJ"],
    "IndiGo": ["IGO"],
    "Air India Express": ["AXB"],
    // Add more airlines as needed
};
