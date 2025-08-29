import axios from "axios";
import { writable } from "svelte/store";
import { LoadingType } from "./dash";

interface GlobalAnnouncement {
  message_author: string;
  message: string;
  type: "";
  timestamp: string; // ISO format
}
//Post
export const Announcements = writable<GlobalAnnouncement[]>([]);
export async function AnnounceGlobalMessage(payload: {
  author: string;
  message: string;
  type: string;
  timestamp: Date;
}) {
  try {
    LoadingType.set("ANN");
    const res = await axios.post("http://localhost:8080/api/announce", {
      message_author: payload.author,
      message: payload.message,
      type: payload.type.toUpperCase(),
      timestamp: payload.timestamp.toISOString(),
    });
    LoadingType.set(null);
    if (res.status) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Failed to post announcement:", err);
    LoadingType.set("ANN");
  }
}
//Fetch
export async function fetchLatestAnnouncements() {
  try {
    LoadingType.set("ANN");
    const res = await axios.get("http://localhost:8080/api/announce/latest");
    const formatted = res.data.map((item: any) => ({
      message_author: item.message_author,
      message: item.message,
      type: item.type,
      timestamp: item.timestamp,
    }));

    Announcements.set(formatted);
    console.log("Ann ->", formatted);
    LoadingType.set(null);
  } catch (err) {
    console.error("Failed to fetch announcements:", err);
    LoadingType.set(null);
  }
}
