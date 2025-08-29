interface AmadeusFlightOffer {
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
