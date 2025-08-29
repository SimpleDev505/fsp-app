async function generateTicketNumber(): Promise<string> {
  let ticketNumber = `HRTCKT-${Math.floor(100000 + Math.random() * 900000)}`; // Generates HRTCKT-XXXXXX
  const existingTicket = await Ticket.findOne({ ticketNumber });

  // If the ticket number exists, regenerate it
  if (existingTicket) {
    return generateTicketNumber(); // recursive call to get a unique ticket number
  }

  return ticketNumber;
}
