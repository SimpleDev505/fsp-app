<script lang="ts">
  import type { TicketData } from "./Store/ticket";
  let { ticket }: { ticket: TicketData | null } = $props();

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function getAirportName(iataCode: string): string {
    const airports: Record<string, string> = {
      MAA: "Chennai",
      DEL: "New Delhi",
      LAX: "Los Angeles",
      JFK: "New York",
      LHR: "London",
      DXB: "Dubai",
      BOM: "Mumbai",
      PNY: "Puducherry",
    };
    return airports[iataCode] || iataCode;
  }

  // Generate barcode
  function generateBarcode(): string[] {
    const patterns = [
      "|||",
      "||",
      "|||",
      "|",
      "||",
      "|||",
      "|",
      "||",
      "|||",
      "||",
    ];
    return patterns;
  }
</script>

{#if ticket}
  <div id="gen-pass-boarding-pdf" class="boarding-pass-container">
    {#each ticket.passengers as passenger, index}
      <div class="boarding-pass">
        <!-- Left section -->
        <div class="boarding-pass-left">
          <div class="header">
            <div class="airline-logo">
              <span class="material-symbols-outlined">flight</span>
              <span class="airline-name">HR Airline Company</span>
            </div>
            <div class="boarding-pass-title">BOARDING PASS</div>
          </div>

          <div class="barcode-section">
            <div class="barcode">
              {#each generateBarcode() as pattern}
                <div class="barcode-line">{pattern}</div>
              {/each}
            </div>
          </div>

          <div class="passenger-info">
            <div class="info-row">
              <div class="info-item">
                <div class="label">Name of passenger:</div>
                <div class="value name">{passenger.fullName}</div>
              </div>
            </div>

            <div class="info-row">
              <div class="info-item">
                <div class="label">From:</div>
                <div class="value">
                  {getAirportName(ticket.flight.from.iataCode)}
                  {ticket.flight.from.iataCode}
                </div>
              </div>
              <div class="info-item">
                <div class="label">Carrier:</div>
                <div class="value">{ticket.flight.airlineCode}</div>
              </div>
              <div class="info-item">
                <div class="label">Flight N°:</div>
                <div class="value">{ticket.flight.flightNumber}</div>
              </div>
              <div class="info-item">
                <div class="label">Class:</div>
                <div class="value">B</div>
              </div>
            </div>

            <div class="info-row">
              <div class="info-item">
                <div class="label">To:</div>
                <div class="value">
                  {getAirportName(ticket.flight.to.iataCode)}
                  {ticket.flight.to.iataCode}
                </div>
              </div>
              <div class="info-item">
                <div class="label">Date:</div>
                <div class="value">
                  {formatDate(ticket.flight.from.dateTime)}
                </div>
              </div>
              <div class="info-item">
                <div class="label">Luggage:</div>
                <div class="value">Y</div>
              </div>
              <div class="info-item">
                <div class="label">Seat:</div>
                <div class="value">{passenger.seatnumber || "N/A"}</div>
              </div>
            </div>
          </div>

          <div class="bottom-section">
            <div class="gate-section">
              <div class="label">GATE</div>
              <div class="gate">H22</div>
            </div>
            <div class="boarding-time-section">
              <div class="label">BOARDING TIME</div>
              <div class="boarding-time">
                {formatTime(ticket.flight.from.dateTime)}
              </div>
            </div>
            <div class="ticket-number">
              <div class="ticket-number-text">
                ETKT SSS {ticket.ticketNumber}
              </div>
            </div>
          </div>
        </div>

        <!-- Perforated line -->
        <div class="paper-cut"></div>

        <!-- Right section -->
        <div class="boarding-pass-right">
          <div class="header-right">
            <div class="boarding-pass-title">BOARDING PASS</div>
          </div>

          <div class="passenger-info-right">
            <div class="info-item">
              <div class="label">Name of passenger:</div>
              <div class="value name">{passenger.fullName}</div>
            </div>

            <div class="route-info">
              <div class="info-item">
                <div class="label">From:</div>
                <div class="value">
                  {getAirportName(ticket.flight.from.iataCode)}
                  {ticket.flight.from.iataCode}
                </div>
              </div>
              <div class="info-item">
                <div class="label">To:</div>
                <div class="value">
                  {getAirportName(ticket.flight.to.iataCode)}
                  {ticket.flight.to.iataCode}
                </div>
              </div>
            </div>

            <div class="flight-details">
              <div class="info-item">
                <div class="label">Seat:</div>
                <div class="value">{passenger.seatnumber || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="label">Date:</div>
                <div class="value">
                  {formatDate(ticket.flight.from.dateTime)}
                </div>
              </div>
            </div>

            <div class="gate-boarding">
              <div class="info-item">
                <div class="label">GATE</div>
                <div class="value gate">H22</div>
              </div>
              <div class="info-item">
                <div class="label">BOARDING TIME</div>
                <div class="value boarding-time">
                  {formatTime(ticket.flight.from.dateTime)}
                </div>
              </div>
            </div>
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
  .boarding-pass-container {
    font-family: Arial, sans-serif;
    background: white;
    padding: 20px;
  }

  .boarding-pass {
    display: flex;
    width: 100%;
    max-width: 800px;
    margin: 20px auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    background: white;
  }

  .boarding-pass-left {
    flex: 2;
    background: linear-gradient(135deg, var(--blue-dark) 0%, #02b0d4 100%);
    color: white;
    padding: 20px;
    position: relative;
  }

  .boarding-pass-right {
    flex: 1;
    background: white;
    color: var(--grey-dark);
    padding: 20px;
    border-left: 2px dashed var(--grey-light);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .airline-logo {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .airline-logo .material-symbols-outlined {
    font-size: 24px;
    color: white;
  }

  .airline-name {
    font-size: var(--font-lg);
    font-weight: bold;
    font-style: italic;
  }

  .boarding-pass-title {
    font-size: var(--font-sm);
    font-weight: bold;
    letter-spacing: 1px;
  }

  .header-right .boarding-pass-title {
    color: var(--blue-dark);
    text-align: center;
    margin-bottom: 20px;
  }

  .barcode-section {
    margin: 20px 0;
  }

  .barcode {
    display: flex;
    gap: 2px;
    height: fit-content;
    align-items: end;
  }

  .barcode-line {
    background: white;
    width: 3px;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 8px;
    font-family: monospace;
    color: transparent;
    min-height: 20px;
    user-select: none;
  }

  .passenger-info {
    margin: 20px 0;
  }

  .info-row {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
    flex-wrap: wrap;
  }

  .info-item {
    min-width: 120px;
  }

  .label {
    font-size: var(--font-s);
    margin-bottom: 2px;
    opacity: 0.9;
  }

  .value {
    font-size: var(--font-sm);
    font-weight: bold;
  }

  .value.name {
    font-size: var(--font-lg);
    font-weight: bold;
  }

  .bottom-section {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin-top: 30px;
  }

  .gate-section,
  .boarding-time-section {
    text-align: center;
  }

  .gate {
    font-size: var(--font-xg);
    font-weight: bold;
    color: white;
  }

  .boarding-time {
    font-size: var(--font-lg);
    font-weight: bold;
    color: var(--grey-light);
  }

  .ticket-number {
    font-size: var(--font-s);
    opacity: 0.8;
  }

  .paper-cut {
    width: 2px;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 8px,
      var(--grey-dark) 8px,
      var(--grey-dark) 12px
    );
    position: relative;
  }

  .paper-cut::before,
  .paper-cut::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    left: -9px;
  }

  .paper-cut::before {
    top: -10px;
  }

  .paper-cut::after {
    bottom: -10px;
  }

  .passenger-info-right {
    color: var(--grey-dark);
  }

  .passenger-info-right .label {
    color: var(--grey-dark);
  }

  .passenger-info-right .value {
    color: var(--grey-dark);
  }

  .route-info,
  .flight-details,
  .gate-boarding {
    margin: 15px 0;
  }

  .passenger-info-right .value.gate {
    font-size: var(--font-lg);
    color: var(--blue-dark);
  }

  .passenger-info-right .value.boarding-time {
    font-size: var(--font-sm);
    color: var(--blue-dark);
  }

  @media (max-width: 768px) {
    .boarding-pass {
      flex-direction: column;
    }

    .boarding-pass-right {
      border-left: none;
      border-top: 2px dashed var(--grey-light);
    }

    .paper-cut {
      width: 100%;
      height: 2px;
      background: repeating-linear-gradient(
        to right,
        transparent 0px,
        transparent 8px,
        var(--grey-dark) 8px,
        var(--grey-dark) 12px
      );
    }

    .paper-cut::before,
    .paper-cut::after {
      width: 20px;
      height: 20px;
      top: -9px;
    }

    .paper-cut::before {
      left: -10px;
    }

    .paper-cut::after {
      right: -10px;
      left: auto;
    }
  }
</style>
