import type { TicketData } from "./ticket";
// @ts-ignore
import html2pdf from "html2pdf.js";
const options = {
  margin: 10,
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
};
export function downloadPass(ticket: TicketData): Boolean {
  if (ticket) {
    const element = document.getElementById("gen-pass-boarding-pdf");
    html2pdf().from(element).save(`${ticket.ticketNumber}.pdf`);
    return true;
  }
  return false;
}
