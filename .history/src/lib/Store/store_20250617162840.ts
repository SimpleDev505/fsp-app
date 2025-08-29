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
    adult: string;
    child: string;
    infant: string;
}
interface SearchFilter {
    triptype: string;
    timings: TimingQuery[];
    currency: string;
}
export const Current_SearchFilter = writable<SearchFilter | null>(null);
