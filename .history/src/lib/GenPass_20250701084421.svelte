<script>
  // @ts-ignore
  import { html2pdf } from "html2pdf.js";
  export let ticket: any;

  function downloadPDF() {
    const element = document.getElementById("boarding-pass");
    html2pdf().from(element).save(`${ticket.ticketNumber}.pdf`);
  }
</script>

<div id="boarding-pass">
  <div class="header">Boarding Pass</div>

  <div class="row">
    <div class="label">Ticket:</div>
    <div>{ticket.ticketNumber}</div>
  </div>
  <div class="row">
    <div class="label">Passenger:</div>
    <div>{ticket.passengers[0]?.fullName}</div>
  </div>
  <div class="row">
    <div class="label">Flight:</div>
    <div>{ticket.flight.flightNumber} ({ticket.flight.airlineCode})</div>
  </div>
  <div class="row">
    <div class="label">Aircraft:</div>
    <div>{ticket.flight.aircraftCode}</div>
  </div>

  <div class="row">
    <div class="label">From:</div>
    <div>
      {ticket.flight.from.iataCode} - Terminal {ticket.flight.from.terminal}
    </div>
  </div>
  <div class="row">
    <div class="label">To:</div>
    <div>
      {ticket.flight.to.iataCode} - Terminal {ticket.flight.to.terminal}
    </div>
  </div>

  <div class="row">
    <div class="label">Departure:</div>
    <div>{new Date(ticket.flight.from.dateTime).toLocaleString()}</div>
  </div>
  <div class="row">
    <div class="label">Arrival:</div>
    <div>{new Date(ticket.flight.to.dateTime).toLocaleString()}</div>
  </div>

  <div class="row">
    <div class="label">Duration:</div>
    <div>{ticket.flight.duration.replace("PT", "").toLowerCase()}</div>
  </div>

  <div class="row">
    <div class="label">Price:</div>
    <div>{ticket.flight.price.total} {ticket.flight.price.currency}</div>
  </div>

  <div class="section">
    <div class="label">Passengers:</div>
    <ul>
      {#each ticket.passengers as p}
        <li>
          {p.fullName} — {p.travelerType}
          {p.seatNumber ? `(Seat: ${p.seatNumber})` : ""}
        </li>
      {/each}
    </ul>
  </div>
</div>

<br />

<style>
  #boarding-pass {
    width: 600px;
    padding: 20px;
    border: 2px dashed #000;
    font-family: "Arial", sans-serif;
    background-color: #fff;
    color: #000;
    margin: 0 auto;
  }
  .header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
  }
  .label {
    font-weight: bold;
  }
  .section {
    margin-top: 16px;
  }
</style>
