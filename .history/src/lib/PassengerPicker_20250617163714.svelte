<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let showPopup = false;

  let adults = 1;
  let children = 0;
  let infants = 0;

  let containerRef: HTMLElement;

  function handleClickOutside(e: MouseEvent) {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      showPopup = false;
    }
  }

  function openPopup() {
    showPopup = true;
  }

  function cancel() {
    showPopup = false;
  }

  function done() {
    showPopup = false;
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  function displayText(): string {
    let text = `${adults} Adult${adults > 1 ? "s" : ""}`;
    if (children > 0) text += `, ${children} Child${children > 1 ? "ren" : ""}`;
    if (infants > 0) text += `, ${infants} Infant${infants > 1 ? "s" : ""}`;
    return text;
  }
</script>

<!-- Trigger Button -->
<div class="selector" tabindex="0" role="button" onclick={openPopup}>
  <div class="label">Travellers</div>
  <div class="value">{displayText()}</div>
</div>

<!-- Popup -->
{#if showPopup}
  <div class="popup" bind:this={containerRef}>
    <div class="section">
      <div class="label-group">
        <span class="label">Adults</span>
        <span class="sub">Aged 12+ yrs</span>
      </div>
      <div class="counter">
        <button onclick={() => (adults = Math.max(1, adults - 1))}>-</button>
        <span>{adults}</span>
        <button onclick={() => adults++}>+</button>
      </div>
    </div>

    <div class="section">
      <div class="label-group">
        <span class="label">Children</span>
        <span class="sub">Aged 2–12 yrs</span>
      </div>
      <div class="counter">
        <button onclick={() => (children = Math.max(0, children - 1))}>-</button
        >
        <span>{children}</span>
        <button onclick={() => children++}>+</button>
      </div>
    </div>

    <div class="section">
      <div class="label-group">
        <span class="label">Infants</span>
        <span class="sub">Below 2 yrs</span>
      </div>
      <div class="counter">
        <button onclick={() => (infants = Math.max(0, infants - 1))}>-</button>
        <span>{infants}</span>
        <button onclick={() => infants++}>+</button>
      </div>
    </div>

    <div class="footer">
      <button class="cancel" onclick={cancel}>Cancel</button>
      <button class="done" onclick={done}>Done</button>
    </div>
  </div>
{/if}

<style>
  .selector {
    border: 1px solid #d0d7de;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    width: 240px;
    user-select: none;
  }

  .label {
    font-size: 13px;
    color: #2563eb;
    font-weight: 600;
  }

  .value {
    margin-top: 4px;
    font-size: 15px;
    font-weight: 600;
    color: #000;
  }

  .popup {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    padding: 20px;
    width: 400px;
  }

  .section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .label-group {
    display: flex;
    flex-direction: column;
  }

  .label-group .label {
    font-weight: 600;
    font-size: 16px;
    color: #111;
  }

  .label-group .sub {
    font-size: 13px;
    color: #666;
  }

  .counter {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .counter button {
    background: #f2f4f7;
    border: none;
    padding: 6px 12px;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
  }

  .counter span {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    gap: 16px;
  }

  .footer .cancel {
    background: transparent;
    border: none;
    font-size: 15px;
    cursor: pointer;
    color: #333;
  }

  .footer .done {
    background: #2563eb;
    color: white;
    padding: 6px 16px;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    cursor: pointer;
  }
</style>
