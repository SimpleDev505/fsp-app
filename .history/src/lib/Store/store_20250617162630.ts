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
}
interface SearchFilter {
    triptype: string;
}
export const Current_SearchFilter = writable<SearchFilter | null>(null);
