import type { TicketData } from "./ticket";
// @ts-ignore
import { html2pdf } from "html2pdf.js";
export function downloadPass(ticket: TicketData) {
  if (ticket) {
    const element = document.getElementById("gen-pass-boarding-pdf");
    html2pdf().from(element).save(`${ticket.ticketNumber}.pdf`);
  }
}
