<script lang="ts">
  import { gsap } from "gsap";
  import { onMount } from "svelte";
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
  let switchElement: HTMLButtonElement;
  let thumbElement: HTMLSpanElement;
  let sliderElement: HTMLSpanElement;

  settingsStore.update((settings: SettingsPage) => ({
    ...settings,
    [propertyName]: isOn,
  }));

  onMount(() => {
    gsap.set(thumbElement, { x: isOn ? 24 : 0 });
    gsap.set(sliderElement, {
      backgroundColor: isOn ? "#04b0d3" : "#ebebeb",
      borderColor: isOn ? "#04b0d3" : "#ebebeb",
    });
  });

  function toggle() {
    isOn = !isOn;

    const tl = gsap.timeline();

    tl.to(thumbElement, {
      x: isOn ? 24 : 0,
      duration: 0.3,
      ease: "back.out(1.7)",
    });

    tl.to(
      sliderElement,
      {
        backgroundColor: isOn ? "#04b0d3" : "#ebebeb",
        borderColor: isOn ? "#04b0d3" : "#ebebeb",
        duration: 0.25,
        ease: "power2.out",
      },
      "<"
    );

    tl.to(
      thumbElement,
      {
        scale: 1.1,
        duration: 0.1,
        ease: "power2.out",
      },
      "-=0.15"
    ).to(thumbElement, {
      scale: 1,
      duration: 0.15,
      ease: "power2.out",
    });

    settingsStore.update((settings: SettingsPage) => ({
      ...settings,
      [propertyName]: isOn,
    }));

    if (isOn) {
      turnOn?.();
    } else {
      turnOff?.();
    }
  }

  function handleMouseEnter() {
    gsap.to(sliderElement, {
      backgroundColor: isOn ? "#018daa" : "#6d6d6d",
      borderColor: isOn ? "#018daa" : "#6d6d6d",
      duration: 0.2,
      ease: "power2.out",
    });
  }

  function handleMouseLeave() {
    gsap.to(sliderElement, {
      backgroundColor: isOn ? "#04b0d3" : "#ebebeb",
      borderColor: isOn ? "#04b0d3" : "#ebebeb",
      duration: 0.2,
      ease: "power2.out",
    });
  }

  function handleMouseDown() {
    gsap.to(thumbElement, {
      width: 24,
      duration: 0.1,
      ease: "power2.out",
    });
  }

  function handleMouseUp() {
    gsap.to(thumbElement, {
      width: 20,
      duration: 0.2,
      ease: "power2.out",
    });
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
    bind:this={switchElement}
    onclick={toggle}
    onkeydown={handleKeydown}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onmousedown={handleMouseDown}
    onmouseup={handleMouseUp}
    role="switch"
    aria-checked={isOn}
    aria-labelledby={`${propertyName}-label`}
  >
    <span class="switch__slider" bind:this={sliderElement}>
      <span class="switch__thumb" bind:this={thumbElement}></span>
    </span>
  </button>
</div>

<style>
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
    transition: color 0.2s ease;
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
    border: 2px solid var(--grey-light);
    /* Remove CSS transitions - GSAP handles all animations */
  }

  .switch__thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    /* Remove CSS transitions - GSAP handles all animations */
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    /* GSAP animations will be handled in JS for reduced motion */
  }

  /* Label hover effect */
  .switch-container:hover .switch-label {
    color: var(--blue-dark);
  }
</style>
