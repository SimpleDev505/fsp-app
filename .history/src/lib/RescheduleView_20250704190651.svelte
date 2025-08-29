<script lang="ts">
  import { type Writable } from "svelte/store";
  import type {
    FlightOffer,
    ScheduledFlight,
    StatusMessage,
  } from "../stores/scheduleStore";
  import { schFlights, SelectedDate } from "../stores/scheduleStore";
  import Notifier from "./Notifier.svelte"; // Your error component
  import DateDropDown from "./DateDropDown.svelte"; // Your date dropdown

  // --- PROPS ---
  const {
    // The type of dialog to show
    scheduledType = $prop<"DELAY" | "RESCHEDULED" | "CANCELED">("DELAY"),
    // The flight offer object
    flight = $prop<FlightOffer>(),
    // A callback to close the dialog
    onClose = $prop<() => void>(),
  } = $props();

  // --- STATE ---
  let delayHrs = $state(0);
  let delayMins = $state(0);
  let rescheduleTime = $state("12:00");
  let reason = $state("");
  let formError: StatusMessage = $state({ message: null, type: "ERROR" });

  // --- DERIVED STATE & HELPERS ---
  const title = $derived(
    scheduledType === "DELAY"
      ? "Delay Flight"
      : scheduledType === "RESCHEDULED"
        ? "Reschedule Flight"
        : "Cancel Flight"
  );

  function setTime(unit: "h" | "m", val: number) {
    if (unit === "h") {
      delayHrs += val;
      if (delayHrs < 0) delayHrs = 23;
      if (delayHrs > 23) delayHrs = 0;
    } else {
      delayMins += val;
      if (delayMins < 0) delayMins = 59;
      if (delayMins > 59) delayMins = 0;
    }
  }

  function validateAndSubmit() {
    // Reset error
    formError.message = null;

    // Validation
    if (!reason.trim()) {
      formError = { message: "Remarks is Required", type: "ERROR" };
      return;
    }

    if (scheduledType === "DELAY") {
      if (delayHrs === 0 && delayMins === 0) {
        formError = {
          message: "Please select a delay duration.",
          type: "ERROR",
        };
        return;
      }
    }

    // Construct the final object
    let newScheduledFlight: ScheduledFlight;

    switch (scheduledType) {
      case "DELAY":
        newScheduledFlight = {
          scheduledType,
          delayHrs,
          delayMins,
          reason,
          flight,
        };
        break;
      case "RESCHEDULED":
        newScheduledFlight = {
          scheduledType,
          rescheduledDate: $SelectedDate,
          rescheduledTime: rescheduleTime,
          reason,
          flight,
        };
        break;
      case "CANCELED":
        newScheduledFlight = {
          scheduledType,
          reason,
          flight,
        };
        break;
    }

    // Update the store
    schFlights.update((currentFlights) => [
      ...currentFlights,
      newScheduledFlight,
    ]);

    // Close the modal
    onClose();
  }
</script>

<div class="modal-backdrop">
  <div class="modal-dialog">
    <header class="modal-header">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#e8651a"
        ><path d="M0 0h24v24H0V0z" fill="none" /><path
          d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        /></svg
      >
      <h1>{title}</h1>
    </header>

    <div class="modal-body">
      {#if scheduledType === "DELAY"}
        <div class="time-inputs">
          <div class="input-group">
            <label for="hrs">Hrs</label>
            <div class="number-input">
              <button onclick={() => setTime("h", -1)}>-</button>
              <input
                id="hrs"
                type="number"
                min="0"
                max="23"
                bind:value={delayHrs}
                placeholder="Time"
              />
              <button onclick={() => setTime("h", 1)}>+</button>
            </div>
            <small>Enter a number between 0 and 23</small>
          </div>
          <div class="input-group">
            <label for="mins">Mins</label>
            <div class="number-input">
              <button onclick={() => setTime("m", -1)}>-</button>
              <input
                id="mins"
                type="number"
                min="0"
                max="59"
                bind:value={delayMins}
                placeholder="Time"
              />
              <button onclick={() => setTime("m", 1)}>+</button>
            </div>
            <small>Enter a number between 0 and 59</small>
          </div>
        </div>
      {/if}

      {#if scheduledType === "RESCHEDULED"}
        <div class="reschedule-inputs">
          <div class="input-group">
            <label>New Departure Date</label>
            <DateDropDown icon="calendar_month" pickupenddate={false} />
          </div>
          <div class="input-group">
            <label for="reschedule-time">New Departure Time</label>
            <input
              type="time"
              id="reschedule-time"
              bind:value={rescheduleTime}
              class="time-picker"
            />
          </div>
        </div>
      {/if}

      {#if scheduledType === "CANCELED"}
        <p class="cancel-warning">
          Are you sure you want to cancel this flight? This action cannot be
          undone. Please provide a reason below.
        </p>
      {/if}

      <div class="input-group">
        <label for="reason">Reason</label>
        <textarea
          id="reason"
          rows="4"
          placeholder="Ex: Weather issue"
          bind:value={reason}
        ></textarea>
      </div>

      {#if formError.message}
        <div class="error-container">
          <Notifier P_error={formError.message} Type={formError.type}
          ></Notifier>
        </div>
      {/if}
    </div>

    <footer class="modal-footer">
      <button class="btn btn-primary" onclick={validateAndSubmit}>
        {#if scheduledType === "DELAY"}Announce Delay{/if}
        {#if scheduledType === "RESCHEDULED"}Reschedule{/if}
        {#if scheduledType === "CANCELED"}Confirm Cancellation{/if}
      </button>
      <button class="btn btn-secondary" onclick={onClose}>Back</button>
    </footer>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-dialog {
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 500px;
    border-top: 5px solid var(--red);
  }

  .modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    color: var(--red);
  }

  .modal-header h1 {
    font-size: var(--font-lg);
    font-weight: 600;
    margin: 0;
  }

  .modal-body {
    padding: 0 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-group label {
    font-weight: 500;
    font-size: var(--font-s);
    color: var(--grey-dark);
  }

  .input-group small {
    font-size: 12px;
    color: var(--grey-dark);
  }

  .time-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .number-input {
    display: flex;
    align-items: center;
    border: 1px solid var(--grey-light);
    border-radius: 8px;
  }

  .number-input input {
    width: 100%;
    border: none;
    outline: none;
    text-align: center;
    font-size: var(--font-sm);
    padding: 10px 0;
    -moz-appearance: textfield; /* Firefox */
  }

  .number-input input::-webkit-outer-spin-button,
  .number-input input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .number-input button {
    border: none;
    background-color: var(--grey-light);
    color: var(--grey-dark);
    font-size: var(--font-lg);
    padding: 8px 16px;
    cursor: pointer;
  }

  .number-input button:first-child {
    border-right: 1px solid #ccc;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
  }

  .number-input button:last-child {
    border-left: 1px solid #ccc;
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
  }

  textarea,
  .time-picker {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--grey-light);
    font-size: var(--font-sm);
    resize: vertical;
    box-sizing: border-box;
  }

  .cancel-warning {
    font-size: var(--font-sm);
    color: var(--grey-dark);
    line-height: 1.5;
    background-color: #fffbe6;
    border: 1px solid var(--yellow);
    border-radius: 8px;
    padding: 12px;
  }

  .error-container {
    margin-top: -10px;
    margin-bottom: 10px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid var(--grey-light);
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: var(--font-sm);
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-primary {
    background-color: var(--red);
    color: white;
  }
  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-secondary {
    background-color: var(--grey-light);
    color: var(--grey-dark);
    border: 1px solid #ddd;
  }
  .btn-secondary:hover {
    background-color: #e0e0e0;
  }
</style>
