<script lang="ts">
  interface Props {
    type: "DELAY" | "RESCHEDULED" | "CANCELED";
    flight: FlightOffer;
    onclose?: () => void;
  }
  let { type, flight, onclose }: Props = $props();
  let delayHours = $state<number | null>(null);
  let delayMins = $state<number | null>(null);
  let delayReason = $state("");
  let delayError = $state<StatusMessage>({ message: null, type: "ERROR" });

  let cancelReason = $state("");
  let cancelError = $state<StatusMessage>({ message: null, type: "ERROR" });

  import type { FlightOffer } from "./Store/search";
  import type { StatusMessage } from "./Notifier.svelte";
  import DateDropDown from "./DateDropDown.svelte";
  import Notifier from "./Notifier.svelte";
  import { schFlights } from "./Store/schedule";
  import { SelectedDate } from "./Store/store";

  function handleSubmit() {
    if (type === "DELAY") {
      if (!delayHours || !delayMins || !delayReason.trim()) {
        delayError.message = "All fields are required";
        return;
      }
      const delayTime = new Date();
      delayTime.setHours(delayTime.getHours() + delayHours);
      delayTime.setMinutes(delayTime.getMinutes() + delayMins);

      schFlights.update((flights) => [
        ...flights,
        {
          scheduledType: "DELAY",
          delayTime: delayTime.toISOString(),
          flight,
        },
      ]);
    }

    if (type === "RESCHEDULED") {
      if (!SelectedDate) return;
      schFlights.update((flights) => [
        ...flights,
        {
          scheduledType: "RESCHEDULED",
          rescheduledTime: $SelectedDate.toString(),
          flight,
        },
      ]);
    }

    if (type === "CANCELED") {
      if (!cancelReason.trim()) {
        cancelError.message = "Cancellation reason required";
        return;
      }
      schFlights.update((flights) => [
        ...flights,
        {
          scheduledType: "CANCELED",
          flight,
        },
      ]);
    }

    if (onclose) {
      onclose();
    }
  }
</script>

<div class="overlay">
  <h2 class="title">
    {type === "DELAY"
      ? "Delay Flight"
      : type === "RESCHEDULED"
        ? "Reschedule Flight"
        : "Cancel Flight"}
  </h2>

  {#if type === "DELAY"}
    <div class="field-group">
      <label>Hrs</label>
      <input
        type="number"
        min="1"
        max="24"
        bind:value={delayHours}
        placeholder="Time"
      />
      <label>Mins</label>
      <input
        type="number"
        min="1"
        max="60"
        bind:value={delayMins}
        placeholder="Time"
      />
      <textarea bind:value={delayReason} placeholder="Enter reason..."
      ></textarea>
      {#if delayError.message}
        <Notifier P_error={delayError.message} Type={delayError.type} />
      {/if}
    </div>
  {/if}

  {#if type === "RESCHEDULED"}
    <div class="field-group">
      <label>New Date & Time</label>
      <DateDropDown icon="calendar_month" pickupenddate={false} />
    </div>
  {/if}

  {#if type === "CANCELED"}
    <div class="field-group">
      <label>Reason</label>
      <textarea bind:value={cancelReason} placeholder="Enter reason..."
      ></textarea>
      {#if cancelError.message}
        <Notifier P_error={cancelError.message} Type={cancelError.type} />
      {/if}
    </div>
  {/if}

  <div class="actions">
    <button onclick={handleSubmit}
      >{type === "DELAY"
        ? "Announce Delay"
        : type === "RESCHEDULED"
          ? "Announce Reschedule"
          : "Confirm Cancellation"}</button
    >
    <button onclick={onclose}>Back</button>
  </div>
</div>

<style>
  .overlay {
    background: var(--grey-light);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: auto;
    font-size: var(--font-sm);
  }

  .title {
    color: var(--red);
    font-size: var(--font-xg);
    margin-bottom: 1rem;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  input,
  textarea {
    padding: 0.5rem;
    border: 1px solid var(--grey-dark);
    border-radius: 6px;
    font-size: var(--font-sm);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    gap: 1rem;
  }
</style>
