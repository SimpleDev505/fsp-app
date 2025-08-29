import { writable } from "svelte/store";

interface NavType {
    Type: "Home" | "About" | "Contact" | "SignUp/Login" = "Home";
}

export let ActiveNav = writable<NavType>();
