<script lang="ts">
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
</script>

<div class="card">
  <h2>Announce</h2>
  <div class="row time-options">
    <label><input type="radio" checked disabled /> Tomorrow</label>
    <label><input type="radio" disabled /> +1 Day</label>
    <label><input type="radio" disabled /> +2 Day</label>
    <label><input type="radio" disabled /> Current Time</label>
    <label><input type="radio" disabled /> Custom Time</label>
  </div>

  <div class="row">
    <label>Announce Type</label>
    <select disabled>
      <option>{type}</option>
    </select>
  </div>

  <div class="row time-inputs">
    <div>
      <label>Hrs</label>
      <input type="number" placeholder="Time" disabled />
    </div>
    <div>
      <label>Mins</label>
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

  select,
  input,
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

  label {
    font-weight: 600;
  }
</style>
