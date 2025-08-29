export interface FilterableFlightData {
    aggregation: {
        totalCount: number;
        filteredTotalCount: number;
        stops: {
            numberOfStops: number;
            count: number;
            minPrice: CurrencyAmount;
        }[];
        airlines: {
            name: string;
            logoUrl: string;
            iataCode: string;
            count: number;
            minPrice: CurrencyAmount;
        }[];
        minPrice: CurrencyAmount;
        minRoundPrice: CurrencyAmount;
        baggage: {
            paramName: string;
            count: number;
            enabled: boolean;
            baggageType: "CABIN" | "CHECKIN";
        }[];
        budget: {
            min: CurrencyAmount;
            max: CurrencyAmount;
        };
        durationMin: number;
        durationMax: number;
    };
    flightOffers: FlightOffer[]; // (retain full details here)
}
