export interface FlightData {
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
    geo_altitude: number | null;
    squawk: string | null;
    spi: boolean;
    position_source: number;
    // Additional fields for your needs
    departure_airport?: string;
    arrival_airport?: string;
    departure_time?: string;
    arrival_time?: string;
    route?: string;
}
