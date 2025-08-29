import { writable } from "svelte/store";

export interface LoginData {
    username?: string;
    id?: string;
    photo?: string;
    user_type: "CUSTOMER" | "STAFF" | "ADMIN";
    login_time?: string;
}

export const UserLogged = writable<Boolean>(false);
