import { writable } from "svelte/store";
//DropDown
export interface MenuItem {
    label: string;
    action: () => void; // Function to call on click
    split: boolean;
}

//Search
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
}
export const Current_SearchFilter = writable<SearchFilter>({
    triptype: "roundtrip",
    timings: [
        {
            from: "New York",
            to: "London",
            dep: "2024-06-15",
            return: "2024-06-22",
        },
    ],
    passengers: {
        adult: 1,
        child: 0,
        infant: 0,
    },
    currency: "USD",
});

//From To - to remove duplicated , from and to should'nt be same
export const AirportSelected = writable<string[]>([]);
