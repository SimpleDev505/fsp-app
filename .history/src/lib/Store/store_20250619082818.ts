import { writable } from "svelte/store";
//Login

//DropDown
export interface MenuItem {
    label: string;
    action: () => void; // Function to call on click
    split: boolean;
    icon?: string;
}
//Date
export const disabledDates = writable<Date[]>([
    new Date(2025, 5, 20),
    new Date(2025, 5, 21),
    new Date(2025, 5, 22),
]);

//Search
export const Searched = writable<boolean>(false);
interface TimingQuery {
    from: string;
    to: string;
    dep: string;
    return?: string;
}
interface AmountQuery {
    adult: number;
    child: number;
    infant: number;
}
interface SearchFilter {
    triptype: string;
    timings: TimingQuery[];
    passengers: AmountQuery;
    currency: string;
    class: string;
}
export const Current_SearchFilter = writable<SearchFilter>({
    triptype: "One Way",
    class: "Economy",
    timings: [
        {
            from: "none",
            to: "none",
            dep: "none",
            return: "none",
        },
    ],
    passengers: {
        adult: 1,
        child: 0,
        infant: 0,
    },
    currency: "INR",
});
//Search - Results
export interface FlightData {
    token: string;
    airlineName: string;
    airlineCode: string;
    airlineLogo: string;
    flightNumber: string;
    fareName: string;
    departure: {
        airportCode: string;
        airportName: string;
        cityName: string;
        countryName: string;
        time: string; // ISO string
        terminal?: string;
    };
    arrival: {
        airportCode: string;
        airportName: string;
        cityName: string;
        countryName: string;
        time: string; // ISO string
        terminal?: string;
    };
    durationSeconds: number;
    numberOfStops: number;
    cabinClass: string;
    seatAvailability: number;
    price: {
        currency: string;
        total: number;
        baseFare: number;
        tax: number;
        fee: number;
        totalRounded: number;
        strikethrough: boolean;
    };
    baggage: {
        personalItem: boolean;
        cabin: {
            pieces: number;
            maxWeight: number;
            weightUnit: string;
            sizeRestrictions?: {
                length: number;
                width: number;
                height: number;
                unit: string;
            };
        };
        checked: {
            pieces: number;
            maxWeight: number;
            weightUnit: string;
        };
    };
    includedFeatures?: string[]; // e.g. ["1 personal item", "1 carry-on", "Free cancellation"]
    isAtolProtected?: boolean;
    seatMapAvailable: boolean; // For visual boarding pass seat layout
}

export const FlightSearchResults = writable<FlightData[]>([]);

//From To - to remove duplicated , from and to should'nt be same
export const AirportSelected = writable<string[]>([]);

//Contact form
export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    howFound: string;
}

export const contactEntries = writable<ContactFormData>(
    {
        name: "none",
        email: "none@gmail.com",
        phone: "12345667890",
        howFound: "google",
    },
);
// CONFIG
//Footer - Links
export const Links_Social = {
    Insta: "https://www.instagram.com",
    X: "https://www.twitter.com",
    Youtube: "https://www.youtube.com",
    LinkedIn: "https://www.linkedin.com",
};

// const options = {
//   method: "GET",
//   url: `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}`,
//   params: {
//     date: flight_date,
//     dep_iata: dep_iata,
//     arr_iata: arr_iata,
//   },
// };
