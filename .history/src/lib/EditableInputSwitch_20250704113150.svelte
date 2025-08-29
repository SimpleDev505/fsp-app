<script lang="ts">
  import { settingsStore, type SettingsPage } from "./Store/profile";

  interface SwitchProps {
    label: string;
    propertyName: string;
    initialValue?: boolean;
    turnOn?: () => void;
    turnOff?: () => void;
  }

  let {
    label,
    propertyName,
    initialValue = false,
    turnOn,
    turnOff,
  }: SwitchProps = $props();

  let isOn = $state(initialValue);

  // Initialize the store value
  settingsStore.update((settings: SettingsPage) => ({
    ...settings,
    [propertyName]: isOn,
  }));

  function toggle() {
    isOn = !isOn;

    // Update the store
    settingsStore.update((settings: SettingsPage) => ({
      ...settings,
      [propertyName]: isOn,
    }));

    // Call appropriate callback
    if (isOn) {
      turnOn?.();
    } else {
      turnOff?.();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  }
</script>

<div class="switch-container">
  <label class="switch-label" for={propertyName}>
    {label}
  </label>
  <button
    id={propertyName}
    class="switch"
    class:switch--on={isOn}
    onclick={toggle}
    onkeydown={handleKeydown}
    role="switch"
    aria-checked={isOn}
    aria-labelledby={`${propertyName}-label`}
  >
    <span class="switch__slider">
      <span class="switch__thumb"></span>
    </span>
  </button>
</div>

<style>
  :root {
    --blue: #04b0d3;
    --green: #08e200;
    --yellow: #e7c205;
    --grey-light: #ebebeb;
    --grey-dark: #6d6d6d;
    --red: #e8651a;
    --blue-dark: #018daa;
    --font-s: 14px;
    --font-sm: 16px;
    --font-lg: 20px;
    --font-xg: 30px;
  }

  .switch-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .switch-label {
    font-size: var(--font-sm);
    color: var(--grey-dark);
    font-weight: 500;
    cursor: pointer;
    user-select: none;
  }

  .switch {
    position: relative;
    width: 52px;
    height: 28px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    outline: none;
    transition: all 0.2s ease;
  }

  .switch:focus-visible {
    box-shadow: 0 0 0 2px var(--blue);
    border-radius: 16px;
  }

  .switch__slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--grey-light);
    border-radius: 16px;
    transition: background-color 0.2s ease;
    border: 2px solid var(--grey-light);
  }

  .switch--on .switch__slider {
    background-color: var(--blue);
    border-color: var(--blue);
  }

  .switch__thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .switch--on .switch__thumb {
    transform: translateX(24px);
  }

  .switch:hover .switch__slider {
    background-color: var(--grey-dark);
  }

  .switch--on:hover .switch__slider {
    background-color: var(--blue-dark);
    border-color: var(--blue-dark);
  }

  .switch:active .switch__thumb {
    width: 24px;
  }

  .switch--on:active .switch__thumb {
    transform: translateX(20px);
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    .switch,
    .switch__slider,
    .switch__thumb {
      transition: none;
    }
  }

  /* Additional hover states for better UX */
  .switch-container:hover .switch-label {
    color: var(--blue-dark);
  }
</style>
