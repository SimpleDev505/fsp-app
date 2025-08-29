import { writable } from "svelte/store";
//DropDown
//DropDown
export const dropdown_enabled = writable<boolean>(false);
export interface MenuItem {
    label: String;
    action: () => void; // Function to call on click
    split: boolean;
}
