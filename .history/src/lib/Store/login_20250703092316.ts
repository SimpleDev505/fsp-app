import { writable } from "svelte/store";

//Login Internal Nav
export const LoginStage = writable<
  | "LOGIN"
  | "FORGOT_PASSWORD"
  | "RESET_PASSWORD"
  | "VERIFY_CODE"
  | "REGISTER USER"
>("LOGIN");
//Before Login
export interface LoginType {
  user_type: "CUSTOMER" | "STAFF" | "ADMIN";
}
export const LoginType = writable<LoginType | null>(null);

//After Login
export interface LoginData {
  username?: string;
  id?: string;
  email?: string;
  phone?: string;
  photo?: string;
  user_type: "CUSTOMER" | "STAFF" | "ADMIN";
  login_time?: string;
  banned?: boolean;
  ban_time?: Date;
}
export interface ProfileAnnouncements {
  message: string;
  type: string;
}
export interface ProfileData {
  places_visited?: number;
  flight_bookins?: number;
  amount_spent?: number;
}
export const LoginData = writable<LoginData | null>(null);

export const UserLogged = writable<Boolean>(false);

export interface RegisterData {
  username: string;
  password: string;
  confirm_password: string;
}
export const RegisterCustomer = writable<RegisterData | null>(null);

//Forgot Password
export const ResetEmail = writable<string>("");
export const OTPCode = writable<string>("");
export const ResetCode = writable("");
