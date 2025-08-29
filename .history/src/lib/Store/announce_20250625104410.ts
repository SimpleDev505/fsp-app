import axios from "axios";

interface GlobalAnnouncement {
  message_author: string;
  message: string;
  type: "WARNING" | "INFO" | "ALERT";
  timestamp: string; // ISO format
}

export async function AnnounceGlobalMessage(payload: {
  author: string;
  message: string;
  type: string;
  announceTime: Date;
}) {
  const body: GlobalAnnouncement = {
    message_author: payload.author,
    message: payload.message,
    type: payload.type.toUpperCase() as any,
    timestamp: payload.announceTime.toISOString(),
  };

  try {
    await axios.post("http://localhost:8080/api/announce", body);
  } catch (err) {
    console.error("Announcement failed", err);
  }
}
