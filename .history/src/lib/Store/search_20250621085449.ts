// export interface FlightOffer {
//     id: string;
//     source: string;
//     oneWay: boolean;
//     price: {
//         total: string;
//         currency: string;
//     };
//     itineraries: {
//         duration: string;
//         segments: {
//             departure: {
//                 iataCode: string;
//                 at: string;
//             };
//             arrival: {
//                 iataCode: string;
//                 at: string;
//             };
//             carrierCode: string;
//             duration: string;
//             numberOfStops: number;
//         }[];
//     }[];
// }
interface FlightOffer {
    id: string;
    source: string;
    oneWay: boolean;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    isUpsellOffer: boolean;
    lastTicketingDate: string;
    lastTicketingDateTime: string;
    numberOfBookableSeats: number;
    price: {
        currency: string;
        total: string;
        base?: string;
        grandTotal?: string;
        fees?: { amount: string; type: string }[];
    };
    pricingOptions: {
        fareType: string[];
        includedCheckedBagsOnly: boolean;
    };
    validatingAirlineCodes: string[];
    itineraries: {
        duration: string;
        segments: {
            id: string;
            duration: string;
            numberOfStops: number;
            carrierCode: string;
            number: string;
            blacklistedInEU: boolean;
            aircraft: { code: string };
            operating: { carrierCode: string };
            departure: {
                iataCode: string;
                at: string;
                terminal?: string;
            };
            arrival: {
                iataCode: string;
                at: string;
                terminal?: string;
            };
        }[];
    }[];
    travelerPricings: {
        travelerId: string;
        fareOption: string;
        travelerType: string;
        price: {
            currency: string;
            total: string;
            base: string;
        };
        fareDetailsBySegment: {
            segmentId: string;
            cabin: string;
            brandedFare: string;
            brandedFareLabel: string;
            fareBasis: string;
            class: string;
            includedCheckedBags?: {
                weight: number;
                weightUnit: string;
            };
            includedCabinBags?: {
                weight: number;
                weightUnit: string;
            };
            amenities?: {
                description: string;
                isChargeable: boolean;
                amenityType: string;
                amenityProvider: {
                    name: string;
                };
            }[];
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
