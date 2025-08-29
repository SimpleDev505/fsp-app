export interface FlightOffer {
    id: string;
    source: string;
    oneWay: boolean;
    price: {
        total: string;
        currency: string;
    };
    itineraries: {
        duration: string;
        segments: {
            departure: {
                iataCode: string;
                at: string;
            };
            arrival: {
                iataCode: string;
                at: string;
            };
            carrierCode: string;
            duration: string;
            numberOfStops: number;
        }[];
    }[];
}

export interface FlightSearchResponse {
    data: FlightOffer[];
    dictionaries: {
        carriers: Record<string, string>;
        aircraft: Record<string, string>;
        [key: string]: any;
    };
}
