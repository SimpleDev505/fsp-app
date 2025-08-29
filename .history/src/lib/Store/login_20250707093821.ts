import axios from "axios";
import { writable } from "svelte/store";
import type { GlobalAnnouncement } from "./announce";

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
  passportno?: string;
  pancardno?: string;
  user_type: "CUSTOMER" | "STAFF" | "ADMIN";
  login_time?: string;
  banned?: boolean;
  ban_time?: Date;
  // Profile
  ticket_booked?: number;
  recent_place?: string;
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
    if (value === "" || value === "-" || value === null) {
      return false;
    }
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
    if (res.status != 200 && !res.data) {
      return false;
    }
    console.log("Updated User Profile ->", res.data);
    LoginData.update(res.data);
    return true;
  } catch (error) {
    console.log("Updated User Profile Error ->", error);
    return false;
  }
}
export async function GetUserData(userId: string, fieldName: string) {
  try {
    const res = await axios.get("http://localhost:8080/api/user/field", {
      params: { userId, fieldName },
    });
    const value = res.data.value;
    return value;
  } catch (error) {
    console.error("Error fetching field value:", error);
    return null;
  }
}
export async function getUserByName(
  username: string
): Promise<LoginData | null> {
  try {
    const res = await axios.get(
      `http://localhost:8080/get-by-username/${username}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return (res.data as LoginData) || null;
  } catch (err: any) {
    console.error("Fetch failed:", err);
    return null;
  }
}
export async function getAnnouncementsByAuthor(
  author: string
): Promise<GlobalAnnouncement[] | null> {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/announcements/get-by-author/${author}`
    );
    return res.data as GlobalAnnouncement[];
  } catch (err: any) {
    console.error(
      "Error fetching announcements:",
      err.response?.data || err.message
    );
    return null;
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
