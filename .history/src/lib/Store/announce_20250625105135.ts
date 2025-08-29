import axios from "axios";
import { writable } from "svelte/store";

interface GlobalAnnouncement {
  message_author: string;
  message: string;
  type: "WARNING" | "INFO" | "ALERT";
  timestamp: string; // ISO format
}
export const Announcements = writable<GlobalAnnouncement[]>([]);
export async function AnnounceGlobalMessage(payload: {
  author: string;
  message: string;
  type: string;
  timestamp: Date;
}) {
  try {
    await axios.post("http://localhost:8000/api/announce", {
      message_author: payload.author,
      message: payload.message,
      type: payload.type.toUpperCase(),
      timestamp: payload.timestamp.toISOString(),
    });
  } catch (err) {
    console.error("Failed to post announcement:", err);
  }
}

export async function fetchLatestAnnouncements() {
  try {
    const res = await axios.get("http://localhost:8000/api/announce/latest");
    Announcements.set(res.data);
  } catch (err) {
    console.error("Failed to fetch announcements:", err);
  }
}
