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
  <div class="ticket-wrapper">
    {#each ticket.passengers as passenger}
      <div class="boarding-pass">
        <div class="left">
          <div class="airline-logo">
            <span class="material-symbols-outlined">flight</span>
            <span class="airline-name">Air Company</span>
          </div>

          <div class="details">
            <div><b>Name:</b> <span>{passenger.fullName}</span></div>
            <div><b>Carrier:</b> {ticket.flight.airlineCode}</div>
            <div>
              <b>Flight Nº:</b> <span>{ticket.flight.flightNumber}</span>
            </div>
            <div><b>From:</b> {ticket.flight.from.iataCode}</div>
            <div><b>To:</b> {ticket.flight.to.iataCode}</div>
            <div><b>Date:</b> {ticket.flight.from.dateTime.slice(0, 10)}</div>
            <div><b>Seat:</b> {passenger.seatnumber ?? "—"}</div>
            <div><b>Gate:</b> H22</div>
            <div><b>Boarding Time:</b> 07:45</div>
          </div>
        </div>

        <div class="right">
          <div class="tag">BOARDING PASS</div>
          <div class="code-area">
            <div><b>Passenger:</b> {passenger.fullName}</div>
            <div><b>Seat:</b> {passenger.seatnumber ?? "—"}</div>
            <div><b>Date:</b> {ticket.flight.from.dateTime.slice(0, 10)}</div>
            <div><b>From:</b> {ticket.flight.from.iataCode}</div>
            <div><b>To:</b> {ticket.flight.to.iataCode}</div>
            <div><b>Gate:</b> H22</div>
            <div><b>Boarding:</b> 07:45</div>
          </div>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <p>No Ticket Data Found!</p>
{/if}

<br />

<style>
  .ticket-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-family: "Segoe UI", sans-serif;
    padding: 1rem;
  }

  .boarding-pass {
    display: flex;
    border: 4px solid var(--grey-light);
    border-radius: 10px;
    overflow: hidden;
    background: white;
    width: 800px;
  }

  .left {
    flex: 2;
    background: var(--blue-dark);
    color: white;
    padding: 1rem;
  }

  .airline-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--font-lg);
    margin-bottom: 1rem;
  }

  .airline-name {
    font-weight: bold;
  }

  .details {
    background: white;
    color: black;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: var(--font-sm);
  }

  .right {
    flex: 1;
    border-left: 2px dashed var(--grey-dark);
    padding: 1rem;
    background: var(--grey-light);
  }

  .tag {
    text-align: center;
    font-size: var(--font-sm);
    color: var(--red);
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .code-area {
    font-size: var(--font-s);
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
</style>
