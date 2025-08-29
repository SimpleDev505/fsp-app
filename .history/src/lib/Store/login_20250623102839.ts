import { writable } from "svelte/store";

//Login Internal Nav
export const LoginStage = writable<
  "LOGIN" | "FORGOT_PASSWORD" | "RESET_PASSWORD"
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
  photo?: string;
  user_type: LoginType;
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

//Forgot Password
export const ResetEmail = writable<string>("");
export const OTPCode = writable<string>("");
