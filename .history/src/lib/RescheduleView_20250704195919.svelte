<script lang="ts">
  import { writable } from "svelte/store";
  import DateDropDown from "./DateDropDown.svelte";
  import Notifier, { type StatusMessage } from "./Notifier.svelte";
  import type { FlightOffer } from "./Store/search";
  import { gsap } from "gsap";
  import { SelectedDate } from "./Store/store";
  import { schFlights, type ScheduledFlight } from "./Store/schedule";
  import { onMount } from "svelte";

  interface Props {
    type: "DELAY" | "RESCHEDULED" | "CANCELED";
    flight: FlightOffer;
    onClose?: () => void;
  }
  onMount(() => {
    gsap.fromTo(
      ".modal-container > * > * > *",
      {
        opacity: 0,
        y: 20,
        stagger: 0.1,
      },
      {
        outline: "",
        opacity: 1,
        stagger: 0.05,
        y: 0,
        duration: 0.3,
        ease: "back.inOut",
        delay: 0.2,
      }
    );
  });
  $effect(() => {
    if (profile_err.message !== null) {
      gsap.fromTo(
        ".modal-container > *",
        { opacity: 0, y: 10, stagger: 0.1 },
        { opacity: 1, y: 0, duration: 0.5, ease: "back.inOut", delay: 0.2 }
      );
    }
  });

  let { type, flight, onClose }: Props = $props();

  // Local state
  let delayHours = $state("");
  let delayMinutes = $state("");
  let reason = $state("");
  let profile_err: StatusMessage = $state({ message: null, type: "ERROR" });

  // Modal state
  let isOpen = $state(true);

  const closeModal = () => {
    isOpen = false;
    onClose?.();
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const validateDelay = (): boolean => {
    if (!delayHours && !delayMinutes) {
      profile_err = { message: "Please enter delay time", type: "ERROR" };
      setTimeout(() => {
        profile_err.message = null;
      }, 4000);
      return false;
    }

    const hours = parseInt(delayHours) || 0;
    const minutes = parseInt(delayMinutes) || 0;

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      profile_err = { message: "Invalid time format", type: "ERROR" };
      setTimeout(() => {
        profile_err.message = null;
      }, 4000);
      return false;
    }

    if (hours === 0 && minutes === 0) {
      profile_err = {
        message: "Delay time must be greater than 0",
        type: "ERROR",
      };
      setTimeout(() => {
        profile_err.message = null;
      }, 4000);
      return false;
    }

    return true;
  };

  const validateReschedule = (): boolean => {
    const selectedDate = $SelectedDate;
    if (!selectedDate || !reason.trim()) {
      profile_err = { message: "Please select a new date", type: "ERROR" };
      setTimeout(() => {
        profile_err.message = null;
      }, 4000);
      return false;
    }

    const newDate = new Date(selectedDate);
    const currentDate = new Date();

    if (newDate <= currentDate) {
      profile_err = {
        message: "Rescheduled date must be in the future",
        type: "ERROR",
      };
      setTimeout(() => {
        profile_err.message = null;
      }, 4000);
      return false;
    }

    return true;
  };

  const validateCancel = (): boolean => {
    if (!reason.trim()) {
      profile_err = {
        message: "Please provide a reason for cancellation",
        type: "ERROR",
      };
      setTimeout(() => {
        profile_err.message = null;
      }, 4000);
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    profile_err = { message: null, type: "ERROR" };

    let isValid = false;
    let scheduledFlight: ScheduledFlight;

    switch (type) {
      case "DELAY":
        isValid = validateDelay();
        if (isValid) {
          const hours = parseInt(delayHours) || 0;
          const minutes = parseInt(delayMinutes) || 0;

          // Calculate delayed time by adding delay to original flight time
          const originalTime = new Date(flight.lastTicketingDate); // Assuming flight has departureTime
          const delayedTime = new Date(
            originalTime.getTime() + (hours * 60 + minutes) * 60000
          );

          scheduledFlight = {
            scheduledType: "DELAY",
            delayTime: delayedTime.toISOString(),
            flight,
          };
        }
        break;

      case "RESCHEDULED":
        isValid = validateReschedule();
        if (isValid) {
          scheduledFlight = {
            scheduledType: "RESCHEDULED",
            rescheduledTime: new Date($SelectedDate).toISOString(),
            flight,
          };
        }
        break;

      case "CANCELED":
        isValid = validateCancel();
        if (isValid) {
          scheduledFlight = {
            scheduledType: "CANCELED",
            flight,
          };
        }
        break;
    }

    if (isValid) {
      schFlights.update((flights) => [...flights, scheduledFlight]);
      profile_err = {
        message: `Flight ${type.toLowerCase()} scheduled successfully`,
        type: "SUCCESS",
      };
      setTimeout(() => {
        closeModal();
      }, 1500);
    }
  };

  const incrementTime = (timeType: "hours" | "minutes") => {
    if (timeType === "hours") {
      const current = parseInt(delayHours) || 0;
      if (current < 23) delayHours = (current + 1).toString();
    } else {
      const current = parseInt(delayMinutes) || 0;
      if (current < 59) delayMinutes = (current + 1).toString();
    }
  };

  const decrementTime = (timeType: "hours" | "minutes") => {
    if (timeType === "hours") {
      const current = parseInt(delayHours) || 0;
      if (current > 0) delayHours = (current - 1).toString();
    } else {
      const current = parseInt(delayMinutes) || 0;
      if (current > 0) delayMinutes = (current - 1).toString();
    }
  };
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={handleOutsideClick}>
    <div class="modal-container">
      <div class="modal-header">
        <h2>
          {type === "DELAY"
            ? "Delay Flight"
            : type === "RESCHEDULED"
              ? "Reschedule Flight"
              : "Cancel Flight"}
        </h2>
        <button class="close-btn" on:click={closeModal}>×</button>
      </div>

      <div class="modal-body">
        {#if profile_err.message}
          <Notifier P_error={profile_err.message} Type={profile_err.type}
          ></Notifier>
        {/if}

        {#if type === "DELAY"}
          <div class="delay-container">
            <div class="time-inputs">
              <div class="time-group">
                <label>Hrs</label>
                <div class="time-control">
                  <input
                    type="number"
                    bind:value={delayHours}
                    placeholder="0"
                    min="0"
                    max="23"
                    class="time-input"
                  />
                  <div class="time-buttons">
                    <button
                      class="time-btn"
                      on:click={() => incrementTime("hours")}>+</button
                    >
                    <button
                      class="time-btn"
                      on:click={() => decrementTime("hours")}>−</button
                    >
                  </div>
                </div>
                <span class="time-hint">Enter a number between 0 and 23</span>
              </div>

              <div class="time-group">
                <label>Mins</label>
                <div class="time-control">
                  <input
                    type="number"
                    bind:value={delayMinutes}
                    placeholder="0"
                    min="0"
                    max="59"
                    class="time-input"
                  />
                  <div class="time-buttons">
                    <button
                      class="time-btn"
                      on:click={() => incrementTime("minutes")}>+</button
                    >
                    <button
                      class="time-btn"
                      on:click={() => decrementTime("minutes")}>−</button
                    >
                  </div>
                </div>
                <span class="time-hint">Enter a number between 0 and 59</span>
              </div>
            </div>

            <div class="reason-group">
              <label>Reason</label>
              <textarea
                bind:value={reason}
                placeholder="Ex Weather issue"
                class="reason-input"
              ></textarea>
            </div>
          </div>
        {/if}

        {#if type === "RESCHEDULED"}
          <div class="reschedule-container">
            <div class="date-group">
              <label>New Date</label>
              <DateDropDown icon="calendar_month" pickupenddate={false}
              ></DateDropDown>
            </div>

            <div class="reason-group">
              <label>Reason</label>
              <textarea
                bind:value={reason}
                placeholder="Reason for rescheduling"
                class="reason-input"
              ></textarea>
            </div>
          </div>
        {/if}

        {#if type === "CANCELED"}
          <div class="cancel-container">
            <div class="reason-group">
              <label>Reason for Cancellation</label>
              <textarea
                bind:value={reason}
                placeholder="Please provide reason for cancellation"
                class="reason-input"
                required
              ></textarea>
              <span class="required-hint">* Reason is required</span>
            </div>
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" on:click={closeModal}>Cancel</button>
        <button class="confirm-btn" on:click={handleConfirm}>
          {type === "DELAY"
            ? "Announce Delay"
            : type === "RESCHEDULED"
              ? "Reschedule"
              : "Cancel Flight"}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(1px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-container {
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    /* overflow-y: auto; */
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--grey-light);
    background-color: var(--blue-dark);
  }

  .modal-header h2 {
    margin: 0;
    font-size: var(--font-lg);
    color: white;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--grey-dark);
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  }

  .close-btn:hover {
    background-color: var(--grey-light);
  }

  .modal-body {
    padding: 20px;
  }

  .delay-container,
  .reschedule-container,
  .cancel-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .time-inputs {
    display: flex;
    gap: 20px;
  }

  .time-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .time-control {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .time-input {
    flex: 1;
    padding: 12px;
    border: 2px solid var(--grey-light);
    border-radius: 8px;
    font-size: var(--font-sm);
    transition: border-color 0.2s;
  }

  .time-input:focus {
    outline: none;
    border-color: var(--blue);
  }

  .time-buttons {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .time-btn {
    width: 30px;
    height: 25px;
    background-color: transparent;
    outline: 2px solid var(--blue);
    color: var(--blue-dark);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: var(--font-s);
    font-weight: bold;
    transition: background-color 0.2s;
  }

  .time-btn:hover {
    background: var(--blue-dark);
    color: white;
  }

  .time-hint {
    font-size: var(--font-s);
    color: var(--grey-dark);
  }

  .reason-group,
  .date-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .reason-input {
    padding: 12px;
    border: 2px solid var(--grey-light);
    border-radius: 8px;
    font-size: var(--font-sm);
    min-height: 80px;
    resize: vertical;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  .reason-input:focus {
    outline: none;
    border-color: var(--blue);
  }

  .required-hint {
    font-size: var(--font-s);
    color: var(--red);
  }

  label {
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--grey-dark);
  }

  .modal-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 20px;
    border-top: 1px solid var(--grey-light);
  }

  .cancel-btn {
    padding: 12px 24px;
    border: 2px solid var(--grey-light);
    background: white;
    color: var(--grey-dark);
    border-radius: 8px;
    cursor: pointer;
    font-size: var(--font-sm);
    font-weight: 600;
    transition: all 0.2s;
  }

  .cancel-btn:hover {
    background: var(--grey-light);
  }

  .confirm-btn {
    padding: 12px 24px;
    border: none;
    background: var(--blue);
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: var(--font-sm);
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .confirm-btn:hover {
    background: var(--blue-dark);
  }
</style>
