import axios from "axios";
import { get } from "svelte/store";
import { SelectedFlight } from "./store";
import { LoginData } from "./login";

export async function bookTicket() {
  const selectedFlight = get(SelectedFlight); // Get current flight details from writable store
  const loginInfo = get(LoginData); // Get current login data (you may get it from session or store)

  try {
    const bookingData = {
      userId: loginInfo?.id,
      username: loginInfo?.username,
      email: loginInfo?.email,
      phone: loginInfo?.phone,
      flightDetails: selectedFlight?.flight,
      passengers: selectedFlight?.passengers.map((p: { info: any }) => p.info), // Only send relevant passenger info
      bookingDate: new Date().toISOString(), // current date-time in ISO format
    };

    const response = await axios.post(
      "http://localhost:8080/api/book-ticket",
      bookingData
    );
    console.log("New Ticket : ", response.data.ticket.ticketNumber);
    console.log(response.data.message); // Success message from server
  } catch (error) {
    console.error("Error during booking:", error);
  }
}
