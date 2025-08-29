export interface CurrencyAmount {
    currencyCode: string;
    units: number;
    nanos: number;
}

export interface Airline {
    name: string;
    logoUrl: string;
    iataCode: string;
    count: number;
    minPrice: CurrencyAmount;
}

export interface StopInfo {
    numberOfStops: number;
    count: number;
    minPrice: CurrencyAmount;
}

export interface BaggageOption {
    paramName: string;
    count: number;
    enabled: boolean;
    baggageType: "CABIN" | "CHECKIN";
}

export interface BudgetRange {
    min: CurrencyAmount;
    max: CurrencyAmount;
}

export interface Airport {
    code: string;
    name: string;
    city: string;
    cityName: string;
    country: string;
    countryName: string;
    province?: string;
}

export interface CarrierInfo {
    name: string;
    code: string;
    logo: string;
}

export interface FlightLeg {
    departureTime: string;
    arrivalTime: string;
    departureAirport: Airport;
    arrivalAirport: Airport;
    cabinClass: string;
    flightInfo: {
        flightNumber: number;
        planeType: string;
        carrierInfo: {
            marketingCarrier: string;
            operatingCarrier: string;
            operatingCarrierDisclosureText: string;
        };
    };
    carriers: string[];
    carriersData: CarrierInfo[];
    totalTime: number;
    flightStops: any[]; // optional, could define more
    amenities: any[];
    departureTerminal?: string;
    arrivalTerminal?: string;
}

export interface Segment {
    departureAirport: Airport;
    arrivalAirport: Airport;
    departureTime: string;
    arrivalTime: string;
    legs: FlightLeg[];
    totalTime: number;
}

export interface PriceBreakdown {
    total: CurrencyAmount;
    baseFare: CurrencyAmount;
    fee: CurrencyAmount;
    tax: CurrencyAmount;
    totalRounded: CurrencyAmount;
    discount: CurrencyAmount;
    totalWithoutDiscount: CurrencyAmount;
    totalWithoutDiscountRounded: CurrencyAmount;
    showPriceStrikethrough: boolean;
}

export interface TravellerPrice {
    travellerReference: string;
    travellerType: "ADULT" | "CHILD" | "INFANT";
    travellerPriceBreakdown: PriceBreakdown;
}

export interface FlightOffer {
    token: string;
    segments: Segment[];
    priceBreakdown: PriceBreakdown;
    travellerPrices: TravellerPrice[];
    tripType: "ONEWAY" | "ROUNDTRIP";
    brandedFareInfo?: {
        fareName: string;
        cabinClass: string;
        features: {
            featureName: string;
            label: string;
            availability: string;
            icon?: string;
        }[];
    };
    seatAvailability?: {
        numberOfSeatsAvailable: number;
    };
}

export interface FlightData {
    aggregation: {
        totalCount: number;
        filteredTotalCount: number;
        stops: StopInfo[];
        airlines: Airline[];
        baggage: BaggageOption[];
        minPrice: CurrencyAmount;
        minRoundPrice: CurrencyAmount;
        durationMin: number;
        durationMax: number;
        budget: BudgetRange;
    };
    flightOffers: FlightOffer[];
}
