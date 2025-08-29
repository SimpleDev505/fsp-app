import { writable } from "svelte/store";
//DropDown
export interface MenuItem {
    label: string;
    action: () => void; // Function to call on click
    split: boolean;
    icon?: string;
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

//Footer - Links
export const Links_Social = {
    Insta: "www.instagra.com",
};
