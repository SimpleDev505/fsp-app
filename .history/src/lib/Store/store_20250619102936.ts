import { writable } from "svelte/store";
import type { FlightData } from "./search";
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
export const Searched = writable<boolean>(true);
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
interface ExtraFilters {
    popularfilters: "none" | "1" | "2" | "Air India" | "SpiceJet";
    pricerange: number;
    stops: "none" | "1" | "2";
    departime: "Before 6Am" | "6Am to 12Pm" | "12Pm to 6Pm" | "After 6Pm";
    duration_hrs: number;
    airlines:
        | "Air India"
        | "SpiceJet"
        | "Thai Airways"
        | "IndiGo"
        | "Etihad Airways"
        | "Air India Express"
        | "Srilankan Airlines"
        | "Malaysia Airlines";
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
