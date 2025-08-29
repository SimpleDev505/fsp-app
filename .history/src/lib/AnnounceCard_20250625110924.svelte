<script lang="ts">
  import Dropdownmenu from "./dropdownmenu.svelte";
  import type { MenuItem } from "./Store/store";

  let message_author: string = $state("");
  let message: string = $state("");
  let timestamp: string = $state("");

  let type: MenuItem[] = [
    {
      label: "Info",
      action: () => {},
      split: false,
    },
    {
      label: "Warning",
      action: () => {},
      split: false,
    },
    {
      label: "Important",
      action: () => {},
      split: false,
    },
  ];
  const options = [
    "Tomorrow",
    "+1 Day",
    "+2 Day",
    "Current Time",
    "Custom Time",
  ];
  let selectedTime = $state("Tomorrow");
  function handleSelect(option: string) {
    selectedTime = option;
  }
</script>

<div class="card">
  <h2>Announce</h2>
  <div class="row time-options">
    {#each options as option}
      <label>
        <input
          type="checkbox"
          checked={selectedTime === option}
          onchange={() => handleSelect(option)}
        />
        {option}
      </label>
    {/each}
  </div>
  <div class="row">
    <span>Announce Type</span>
    <Dropdownmenu leftpx={0} rightpx={0} items={type}></Dropdownmenu>
  </div>

  <div class="row time-inputs">
    <div>
      <span>Hrs</span>
      <input type="number" placeholder="Time" disabled />
    </div>
    <div>
      <span>Mins</span>
      <input type="number" placeholder="Time" disabled />
    </div>
  </div>

  <textarea readonly>{message}</textarea>

  <div class="meta">
    By: {message_author} | {new Date(timestamp).toLocaleString()}
  </div>
</div>

<style>
  .card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    margin: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-family: "Segoe UI", sans-serif;
  }

  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .row {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1rem;
    font-size: var(--font-sm);
  }

  .time-inputs div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  input[type="checkbox"] {
    accent-color: var(--blue);
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  input[type="number"],
  textarea {
    border: 1px solid var(--blue);
    border-radius: 6px;
    padding: 0.5rem;
    font-size: var(--font-sm);
  }

  textarea {
    width: 100%;
    height: 100px;
    resize: none;
    margin-bottom: 1rem;
  }

  .meta {
    text-align: right;
    font-size: var(--font-s);
    color: var(--grey-dark);
  }

  span {
    font-weight: 600;
  }
</style>
