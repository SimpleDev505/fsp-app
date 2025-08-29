export interface FlightData {
    aggregation: Aggregation;
    flightOffers: FlightOffer[];
    flightDeals: FlightDeal[];
    searchId: string;
    tripType: "ONEWAY" | "ROUNDTRIP" | "MULTICITY";
    searchCriteria: {
        cabinClass: string;
    };
}

export interface Aggregation {
    totalCount: number;
    filteredTotalCount: number;
    stops: StopCount[];
    airlines: AirlineInfo[];
    departureIntervals: TimeInterval[];
    flightTimes: FlightTime[];
    shortLayoverConnection: { count: number };
    durationMin: number;
    durationMax: number;
    baggage: BaggageInfo[];
    budget: BudgetRange;
    budgetPerAdult: BudgetRange;
    duration: DurationFilter[];
    filtersOrder: string[];
}

export interface StopCount {
    numberOfStops: number;
    count: number;
    minPrice: Money;
    minPriceRound: Money;
}

export interface AirlineInfo {
    name: string;
    logoUrl: string;
    iataCode: string;
    count: number;
    minPrice: Money;
}

export interface TimeInterval {
    start: string;
    end: string;
}

export interface FlightTime {
    arrival: TimeRange[];
    departure: TimeRange[];
}

export interface TimeRange {
    start: string;
    end: string;
    count: number;
}

export interface BaggageInfo {
    paramName: string;
    count: number;
    enabled: boolean;
    baggageType: "CABIN" | "CHECKIN";
}

export interface BudgetRange {
    paramName: string;
    min: Money;
    max: Money;
}

export interface DurationFilter {
    min: number;
    max: number;
    durationType: "JOURNEY" | "LAYOVER";
    enabled: boolean;
    paramName: string;
}

// export interface FlightOffer {
//     token: string;
//     segments: FlightSegment[];
//     priceBreakdown: PriceBreakdown;
//     seatAvailability: { numberOfSeatsAvailable: number };
//     tripType: "ONEWAY" | "ROUNDTRIP" | "MULTICITY";
//     brandedFareInfo: BrandedFareInfo;
//     fareRules: FareRule[];
//     carriers?: string[];
// }
export interface FlightOffer {
    token: string;
    segments: FlightSegment[];
    priceBreakdown: PriceBreakdown;
    seatAvailability?: { numberOfSeatsAvailable: number };
    tripType: "ONEWAY" | "ROUNDTRIP" | "MULTICITY";
    brandedFareInfo: BrandedFareInfo;
    fareRules: FareRule[];
    carriers?: string[];
    travellerCheckedLuggage?: {
        travellerReference: string;
        luggageAllowance: {
            luggageType: string;
            ruleType: string;
            maxTotalWeight: number;
            massUnit: string;
            maxPiece: number;
        };
    }[];
    travellerCabinLuggage?: {
        travellerReference: string;
        luggageAllowance: {
            luggageType: string;
            maxPiece: number;
            maxWeightPerPiece: number;
            massUnit: string;
            sizeRestrictions: {
                maxLength: number;
                maxWidth: number;
                maxHeight: number;
                sizeUnit: string;
            };
        };
        personalItem?: boolean;
    }[];
    isAtolProtected?: boolean;
    showWarningDestinationAirport?: boolean;
    showWarningOriginAirport?: boolean;
    includedProductsBySegment?: any[];
    extraProducts?: any[];
    offerExtras?: any;
    ancillaries?: any;
    appliedDiscounts?: any[];
    offerKeyToHighlight?: string;
    requestableBrandedFares?: boolean;
    extraProductDisplayRequirements?: any;
    unifiedPriceBreakdown?: any;
}

export interface FlightSegment {
    departureAirport: Airport;
    arrivalAirport: Airport;
    departureTime: string;
    arrivalTime: string;
    totalTime: number;
    legs: FlightLeg[];
}

export interface FlightLeg {
    departureTime: string;
    arrivalTime: string;
    departureAirport: Airport;
    arrivalAirport: Airport;
    cabinClass: string;
    totalTime: number;
    flightInfo: {
        flightNumber: number;
        planeType: string;
        carrierInfo: {
            operatingCarrier: string;
            marketingCarrier: string;
        };
    };
    carriersData: CarrierData[];
    departureTerminal?: string;
    arrivalTerminal?: string;
}

export interface CarrierData {
    name: string;
    code: string;
    logo: string;
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

export interface PriceBreakdown {
    total: Money;
    baseFare: Money;
    tax: Money;
    fee: Money;
    totalRounded: Money;
    discount: Money;
    showPriceStrikethrough: boolean;
    carrierTaxBreakdown?: CarrierTaxBreakdown[];
}

export interface CarrierTaxBreakdown {
    carrier: {
        name: string;
        code: string;
        logo: string;
    };
    avgPerAdult: Money;
}

export interface BrandedFareInfo {
    fareName: string;
    cabinClass: string;
    features: FareFeature[];
}

export interface FareFeature {
    featureName: string;
    category: string;
    label: string;
    availability: "INCLUDED" | "PAID";
    icon: string;
}

export interface FareRule {
    availablePolicies: {
        type: "CHANGE_BEFORE" | "CANCEL_BEFORE";
        priceBreakdown: {
            total: Money;
        };
    }[];
}

export interface FlightDeal {
    key: "CHEAPEST" | "FASTEST" | "BEST";
    offerToken: string;
    price: Money;
    priceRounded: Money;
}

export interface Money {
    currencyCode: string;
    units: number;
    nanos: number;
}
