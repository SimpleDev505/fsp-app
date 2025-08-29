import axios from "axios";
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
  // Profile
  ticket_booked?: number;
  recent_place?: number;
  amount_saved?: number;
}
export const LoginData = writable<LoginData | null>(null);
//user
export const UserLogged = writable<Boolean>(false);
export async function UpdateUserData(
  userId: string,
  fieldName: string,
  value: any
) {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/users/updatedata",
      {
        userId: userId,
        fieldName: fieldName,
        newValue: value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Updated User Profile ->", res.data);
  } catch (error) {
    console.log("Updated User Profile Error ->", error);
  }
}

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
