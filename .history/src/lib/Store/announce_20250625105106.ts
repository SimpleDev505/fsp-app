import axios from "axios";
import { writable } from "svelte/store";

interface GlobalAnnouncement {
  message_author: string;
  message: string;
  type: "WARNING" | "INFO" | "ALERT";
  timestamp: string; // ISO format
}
export const announcements = writable<GlobalAnnouncement[]>([]);
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
