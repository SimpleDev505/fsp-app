<script lang="ts">
  import { onMount, tick } from "svelte";
  let showPopup = false;

  let adults = 1;
  let children = 0;
  let infants = 0;

  let buttonRef: HTMLDivElement;
  let popupRef: HTMLDivElement;
  let popupStyle = "";

  function displayText(): string {
    let text = `${adults} Adult${adults > 1 ? "s" : ""}`;
    if (children > 0) text += `, ${children} Child${children > 1 ? "ren" : ""}`;
    if (infants > 0) text += `, ${infants} Infant${infants > 1 ? "s" : ""}`;
    return text;
  }

  async function openPopup() {
    showPopup = true;
    await tick(); // wait for DOM to update

    const rect = buttonRef.getBoundingClientRect();
    popupStyle = `position: absolute; top: ${rect.bottom + 8}px; left: ${rect.left}px; z-index: 9999;`;

    // Defer adding listener to next tick so it doesn't immediately close
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
  }

  function closePopup() {
    showPopup = false;
    document.removeEventListener("click", handleClickOutside);
  }

  function handleClickOutside(e: MouseEvent) {
    if (
      popupRef &&
      !popupRef.contains(e.target as Node) &&
      !buttonRef.contains(e.target as Node)
    ) {
      closePopup();
    }
  }

  function cancel() {
    closePopup();
  }

  function done() {
    closePopup();
  }
</script>

<!-- Trigger Button -->
<div class="selector" bind:this={buttonRef} on:click={openPopup}>
  <div class="label">Travellers</div>
  <div class="value">{displayText()}</div>
</div>

<!-- Popup -->
{#if showPopup}
  <div class="popup" bind:this={popupRef} style={popupStyle}>
    <div class="section">
      <div class="label-group">
        <span class="label">Adults</span>
        <span class="sub">Aged 12+ yrs</span>
      </div>
      <div class="counter">
        <button on:click={() => (adults = Math.max(1, adults - 1))}>-</button>
        <span>{adults}</span>
        <button on:click={() => adults++}>+</button>
      </div>
    </div>

    <div class="section">
      <div class="label-group">
        <span class="label">Children</span>
        <span class="sub">Aged 2–12 yrs</span>
      </div>
      <div class="counter">
        <button on:click={() => (children = Math.max(0, children - 1))}
          >-</button
        >
        <span>{children}</span>
        <button on:click={() => children++}>+</button>
      </div>
    </div>

    <div class="section">
      <div class="label-group">
        <span class="label">Infants</span>
        <span class="sub">Below 2 yrs</span>
      </div>
      <div class="counter">
        <button on:click={() => (infants = Math.max(0, infants - 1))}>-</button>
        <span>{infants}</span>
        <button on:click={() => infants++}>+</button>
      </div>
    </div>

    <div class="footer">
      <button class="cancel" on:click={cancel}>Cancel</button>
      <button class="done" on:click={done}>Done</button>
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
