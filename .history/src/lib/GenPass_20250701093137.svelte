<script lang="ts">
  // @ts-ignore
  import { html2pdf } from "html2pdf.js";
  import type { TicketData } from "./Store/ticket";
  let { ticket }: { ticket: TicketData | null } = $props();

  export function downloadPass() {
    if (ticket) {
      const element = document.getElementById("boarding-pass");
      html2pdf().from(element).save(`${ticket.ticketNumber}.pdf`);
    }
  }
</script>

{#if ticket}
  <div id="boarding-pass">
    <div style="width: 100%; height: 100%; grid-column: 1;">
      <div class="header">
        <span class="material-symbols-outlined" style="font-size: 32px;">
          plane_contrails
        </span><span>HR AIRLINE Boarding Pass</span>
      </div>
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
              {p.seatnumber ? `(Seat: ${p.seatnumber})` : ""}
            </li>
          {/each}
        </ul>
      </div>
    </div>
    <div style="width: 100%; height: 100%; grid-column: 2;">
      <div class="header">
        <span class="material-symbols-outlined" style="font-size: 32px;">
          plane_contrails
        </span>
        <span>HR AIRLINE</span>
        <span>Boarding Pass</span>
      </div>
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
              {p.seatnumber ? `(Seat: ${p.seatnumber})` : ""}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
{:else}
  <p>No Ticket Data Found!</p>
{/if}

<br />

<style>
  #boarding-pass {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 850px;
    border-radius: 20px;
    border: 2px dashed var(--grey-dark);
    font-family: "Arial", sans-serif;
    background-color: #fff;
    color: var(--grey-dark);
    margin: 0 auto;
    height: 300px;
    overflow: hidden;
  }
  .header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 500;
    padding: 5px;
    background-color: var(--blue-dark);
    color: white;
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
