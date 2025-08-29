import { writable } from "svelte/store";

export interface LoginData {
    username?: string;
    id?: string;
    photo?: string;
    user_type: "CUSTOMER" | "STAFF" | "ADMIN";
    login_time?: string;
}

export const UserLogged = writable<Boolean>(false);
export const LoginData = writable<LoginData | null>(null);

export interface RegisterData {
    username: string;
    password: string;
    confirm_password: string;
}
export const RegisterCustomer = writable<RegisterData | null>(null);
