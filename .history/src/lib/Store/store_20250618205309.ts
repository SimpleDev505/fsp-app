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
    flight_date: string;
    flight_status: string;
    flight: {
        number: string;
        iata: string;
        icao: string;
    };
    airline: {
        name: string;
        iata: string;
        icao: string;
    };
    departure: {
        airport: string;
        iata: string;
        scheduled: string;
        terminal?: string;
        gate?: string;
    };
    arrival: {
        airport: string;
        iata: string;
        scheduled: string;
        terminal?: string;
        gate?: string;
    };
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
