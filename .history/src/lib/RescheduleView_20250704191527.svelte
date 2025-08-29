<script lang="ts">
  import { writable } from "svelte/store";
  import DateDropDown from "./DateDropDown.svelte"; // Adjust path as needed
  import Notifier, { type StatusMessage } from "./Notifier.svelte"; // Adjust path as needed
  import type { FlightOffer } from "./Store/search";
  import type { ScheduledFlight } from "./Store/schedule";
  import { SelectedDate } from "./Store/store";

  // Props using Svelte 5 Runes Mode
  const props = $props<{
    type: "DELAY" | "RESCHEDULE" | "CANCEL";
    flight: FlightOffer;
    onClose: () => void;
  }>();

  // Reactive state using runes
  let hours = $state(0);
  let minutes = $state(0);
  let reason = $state("");
  let profile_err: StatusMessage = $state({ message: null, type: "ERROR" });

  // Writable store for scheduled flights
  export const schFlights = writable<ScheduledFlight[]>([]);

  // Handle confirmation and store data
  function handleConfirm() {
    // Reset error message
    profile_err.message = null;

    // Validate reason for all types
    if (!reason.trim()) {
      profile_err.message = "Remarks IS REQUIRED";
      profile_err.type = "ERROR";
      return;
    }

    // Handle each popup type
    if (props.type === "DELAY") {
      if (hours < 1 || hours > 24 || minutes < 1 || minutes > 60) {
        profile_err.message = "Selected Time Conflicts Other Flight"; // Simplified validation
        profile_err.type = "ERROR";
        return;
      }
      const delayTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      schFlights.update((flights) => [
        ...flights,
        { scheduledType: "DELAY", delayTime, flight: props.flight },
      ]);
    } else if (props.type === "RESCHEDULE") {
      const rescheduledTime = $SelectedDate; // Assuming SelectedDate is a string
      if (!rescheduledTime) {
        profile_err.message = "Please select a date";
        profile_err.type = "ERROR";
        return;
      }
      schFlights.update((flights) => [
        ...flights,
        { scheduledType: "RESCHEDULED", rescheduledTime, flight: props.flight },
      ]);
    } else if (props.type === "CANCEL") {
      schFlights.update((flights) => [
        ...flights,
        { scheduledType: "CANCEL", flight: props.flight },
      ]);
    }

    // Close popup on success
    props.onClose();
  }
</script>

<div class="popup-overlay">
  <div class="popup-container">
    <button class="close-button" on:click={props.onClose}>X</button>
    <div class="header">
      <span class="icon">1</span>
      <h2>{props.type} FLIGHT</h2>
    </div>

    {#if props.type === "DELAY"}
      <div class="input-group">
        <label>HRS</label>
        <div class="number-input">
          <button on:click={() => (hours = Math.max(0, hours - 1))}>-</button>
          <input
            type="number"
            bind:value={hours}
            min="0"
            max="24"
            placeholder="Time"
          />
          <button on:click={() => (hours = Math.min(24, hours + 1))}>+</button>
        </div>
        <p>Enter a number between 1 and 24</p>
      </div>
      <div class="input-group">
        <label>MINS</label>
        <div class="number-input">
          <button on:click={() => (minutes = Math.max(0, minutes - 1))}
            >-</button
          >
          <input
            type="number"
            bind:value={minutes}
            min="0"
            max="60"
            placeholder="Time"
          />
          <button on:click={() => (minutes = Math.min(60, minutes + 1))}
            >+</button
          >
        </div>
        <p>Enter a number between 1 and 60</p>
      </div>
    {:else if props.type === "RESCHEDULE"}
      <div class="input-group">
        <label>DATE</label>
        <DateDropDown icon="calendar_month" pickupenddate={false}
        ></DateDropDown>
      </div>
    {/if}

    <div class="input-group">
      <label>REASON</label>
      <textarea bind:value={reason} placeholder="EX Weather issue"></textarea>
    </div>

    {#if profile_err.message}
      <div class="error-message">
        <span>😞</span>
        {profile_err.message}
        <span>ERROR</span>
      </div>
      <Notifier P_error={profile_err.message} Type={profile_err.type}
      ></Notifier>
    {/if}

    <div class="action-buttons">
      <button class="announce-btn" on:click={handleConfirm}
        >ANNOUNCE {props.type}</button
      >
      <button class="back-btn" on:click={props.onClose}>BACK</button>
    </div>
  </div>
</div>

<style>
  /* Full-screen overlay */
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  /* Popup container */
  .popup-container {
    background: #ffe6e6; /* Light pink derived from --red */
    border: 1px solid var(--red);
    border-radius: 10px;
    padding: 20px;
    width: 400px;
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  /* Close button */
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    color: var(--grey-dark);
    cursor: pointer;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .header .icon {
    background: var(--red);
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }
  .header h2 {
    color: var(--red);
    font-size: var(--font-lg);
    text-transform: uppercase;
    margin: 0;
  }

  /* Input groups */
  .input-group {
    margin-bottom: 15px;
  }
  .input-group label {
    display: block;
    margin-bottom: 5px;
    color: var(--grey-dark);
    font-size: var(--font-sm);
    text-transform: uppercase;
  }
  .number-input {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .number-input input {
    width: 60px;
    padding: 5px;
    border: 1px solid var(--grey-dark);
    border-radius: 5px;
    background: var(--grey-light);
    text-align: center;
    font-size: var(--font-sm);
  }
  .number-input button {
    background: var(--grey-light);
    border: 1px solid var(--grey-dark);
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
    font-size: var(--font-sm);
  }
  .input-group p {
    font-size: var(--font-s);
    color: var(--grey-dark);
    margin: 5px 0 0;
  }
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid var(--red);
    border-radius: 5px;
    background: var(--grey-light);
    font-size: var(--font-sm);
    resize: none;
  }

  /* Error message */
  .error-message {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--red);
    font-size: var(--font-s);
    margin-bottom: 15px;
    gap: 5px;
  }

  /* Action buttons */
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .action-buttons button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: var(--font-sm);
    text-transform: uppercase;
    cursor: pointer;
  }
  .announce-btn {
    background: var(--red);
    color: white;
  }
  .back-btn {
    background: var(--grey-light);
    color: var(--grey-dark);
  }
</style>
