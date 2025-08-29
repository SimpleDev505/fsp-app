import axios from "axios";
import { writable } from "svelte/store";
import { LoadingType } from "./dash";
import { gsap } from "gsap";

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
    LoadingType.set(null);
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
    if (!res) {
      return;
    }
    Announcements.set([]);
    gsap.fromTo(
      ".announcement",
      {
        opacity: 0,
        y: 200,
      },
      {
        onStart: () => {
          Announcements.set(formatted);
        },
        delay: 0.4,
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "circ.inOut",
      }
    );
    console.log("Ann ->", formatted);
    gsap.fromTo(
      ".announcement",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "circ.inOut",
      }
    );
    setTimeout(() => {
      LoadingType.set(null);
    }, 2500);
  } catch (err) {
    console.error("Failed to fetch announcements:", err);
    LoadingType.set(null);
  }
}
