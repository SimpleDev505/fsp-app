<script lang="ts">
  import { tick } from "svelte";
  import { Current_SearchFilter } from "./Store/store";
  let showPopup = $state(false);

  let adults = $state(1);
  let children = $state(0);
  let infants = $state(0);

  let popupRef: HTMLDivElement | null = $state(null);
  let triggerRef: HTMLDivElement;

  async function togglePopup() {
    showPopup = !showPopup;
    await tick();

    if (showPopup) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  }

  function handleClickOutside(e: MouseEvent) {
    if (
      popupRef &&
      !popupRef.contains(e.target as Node) &&
      !triggerRef.contains(e.target as Node)
    ) {
      showPopup = false;
      document.removeEventListener("click", handleClickOutside);
    }
  }

  function displayText(): string {
    let text = `${adults} Adult${adults > 1 ? "s" : ""}`;
    if (children > 0) text += `, ${children} Child${children > 1 ? "ren" : ""}`;
    if (infants > 0) text += `, ${infants} Infant${infants > 1 ? "s" : ""}`;
    return text;
  }

  function cancel() {
    showPopup = false;
    document.removeEventListener("click", handleClickOutside);
  }

  function done() {
    showPopup = false;
    document.removeEventListener("click", handleClickOutside);
  }
  function UpdateSearchFilter() {
    Current_SearchFilter.update((prev) => ({
      ...prev,
      passengers: {
        adult: adults,
        child: children,
        infant: infants,
      },
    }));
  }
</script>

<div class="relative-wrapper">
  <div class="selector" bind:this={triggerRef} onclick={togglePopup}>
    <div class="label">Travellers</div>
    <div class="value">{displayText()}</div>
  </div>

  {#if showPopup}
    <div class="popup" bind:this={popupRef}>
      <div class="section">
        <div class="label-group">
          <span class="label">Adults</span>
          <span class="sub">Aged 12+ yrs</span>
        </div>
        <div class="counter">
          <button
            onclick={() => {
              adults = Math.max(1, adults - 1);
              UpdateSearchFilter();
            }}>-</button
          >
          <span>{adults}</span>
          <button
            onclick={() => {
              adults++;
              UpdateSearchFilter();
            }}>+</button
          >
        </div>
      </div>

      <div class="section">
        <div class="label-group">
          <span class="label"
            >Children
            <span class="material-symbols-outlined"> boy </span>
          </span>
          <span class="sub">Aged 2–12 yrs</span>
        </div>
        <div class="counter">
          <button
            onclick={() => {
              children = Math.max(0, children - 1);
              UpdateSearchFilter();
            }}>-</button
          >
          <span>{children}</span>
          <button
            onclick={() => {
              children++;
              UpdateSearchFilter();
            }}>+</button
          >
        </div>
      </div>

      <div class="section">
        <div class="label-group">
          <span class="label"
            >Infants <span class="material-symbols-outlined">
              child_care
            </span></span
          >
          <span class="sub">Below 2 yrs</span>
        </div>
        <div class="counter">
          <button
            onclick={() => {
              infants = Math.max(0, infants - 1);
              UpdateSearchFilter();
            }}>-</button
          >
          <span>{infants}</span>
          <button
            onclick={() => {
              infants++;
              UpdateSearchFilter();
            }}>+</button
          >
        </div>
      </div>

      <div class="footer">
        <button class="cancel" onclick={cancel}>Cancel</button>
        <button class="done" onclick={done}>Done</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .relative-wrapper {
    position: relative;
    display: inline-block;
  }

  .selector {
    border: 1px solid #d0d7de;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    width: 240px;
    user-select: none;
    background: #fff;
  }

  .label {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: var(--font-sm);
    color: var(--blue);
    font-weight: 600;
  }

  .value {
    margin-top: 4px;
    font-size: 15px;
    font-weight: 600;
    color: #000;
  }

  .popup {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    padding: 20px;
    width: 400px;
    z-index: 999;
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
    color: black;
  }

  .footer .done {
    background: var(--blue);
    color: white;
    padding: 6px 16px;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    cursor: pointer;
  }
</style>
