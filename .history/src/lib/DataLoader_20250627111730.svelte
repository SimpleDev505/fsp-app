<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  interface Props {
    width?: number;
    height?: number;
    duration: number; // in milliseconds
    onFinish?: () => void;
    icon?: string; // Material symbol icon name
    iconStayTime?: number; // in milliseconds
    strokeWidth?: number;
    color?: string;
    infinite?: boolean; // New prop for infinite animation
  }

  let {
    width = 40,
    height = 40,
    duration,
    onFinish,
    icon,
    iconStayTime = 1000,
    strokeWidth = 3,
    color = "#04b0d3",
    infinite = false, // Default to false (finite animation)
  }: Props = $props();

  let progress = $state(0);
  let isComplete = $state(false); // Only relevant for finite animation
  let showIcon = $state(false); // Only relevant for finite animation

  let circleRef: SVGCircleElement;
  let iconRef: HTMLDivElement;
  let containerRef: HTMLDivElement; // Reference to the loader-container

  const radius = Math.min(width, height) / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  onMount(() => {
    // Reset component state
    progress = 0;
    isComplete = false;
    showIcon = false;

    // Reset circle stroke (important for finite animations if component is reused)
    if (circleRef) {
      circleRef.style.strokeDashoffset = circumference.toString();
    }

    const tl = gsap.timeline();

    if (infinite) {
      // --- Infinite Continuous Rotation ---
      // Animate the rotation of the main container
      tl.to(
        containerRef, // Target the container for rotation
        {
          duration: duration / 1000, // Duration for one full rotation
          rotation: 360,
          ease: "none", // Critical for continuous smooth rotation
          repeat: -1, // Repeat infinitely
          transformOrigin: "center center", // Ensure it rotates around its center
        }
      );

      // Optionally, you might want a small progress animation within the infinite loop
      // to make it look like it's "doing something" more than just spinning.
      // This part animates the stroke-dashoffset from 0 to circumference and back,
      // creating a "loading segment" that travels around the circle while the whole
      // thing rotates.
      tl.to(
        circleRef,
        {
          duration: duration / 1000, // Match the rotation duration
          strokeDashoffset: 0, // Go from full to empty
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true, // Go back and forth for the segment animation
        },
        "<" // Start this animation at the same time as the rotation
      );
    } else {
      // --- Finite animation (original logic) ---
      tl.to(
        {}, // No specific target, just a generic object for progress tracking
        {
          duration: duration / 1000,
          ease: "power2.inOut",
          onUpdate: function () {
            progress = this.progress() * 100;
          },
          onComplete: () => {
            isComplete = true;

            // Show icon if provided
            if (icon) {
              showIcon = true;

              // Animate icon scale from 0 to 1
              gsap.fromTo(
                iconRef,
                { scale: 0, rotation: -180 },
                {
                  scale: 1,
                  rotation: 0,
                  duration: 0.5,
                  ease: "back.out(1.7)",
                  onComplete: () => {
                    // Keep icon visible and trigger callback after iconStayTime
                    setTimeout(() => {
                      onFinish?.();
                    }, iconStayTime);
                  },
                }
              );
            } else {
              // No icon, just trigger callback after a short delay
              setTimeout(() => {
                onFinish?.();
              }, 200);
            }
          },
        }
      );
    }

    return () => {
      tl.kill();
    };
  });

  // Calculate stroke dash offset based on progress (only relevant for finite animation now)
  // For infinite, we're directly animating strokeDashoffset or relying on its initial state
  $effect(() => {
    if (circleRef && !infinite) {
      // Only apply this effect if not in infinite mode
      const offset = circumference - (progress / 100) * circumference;
      circleRef.style.strokeDashoffset = offset.toString();
    }
    // If in infinite mode, the strokeDashoffset is handled by the GSAP animation directly
  });
</script>

<div
  bind:this={containerRef}
  class="loader-container"
  style="width: {width}px; height: {height}px;"
>
  <svg
    class="progress-circle"
    {width}
    {height}
    class:complete={isComplete && !infinite}
  >
    <circle
      cx={width / 2}
      cy={height / 2}
      r={radius}
      fill="none"
      stroke="#e5e5e5"
      stroke-width={strokeWidth}
    />

    <circle
      bind:this={circleRef}
      cx={width / 2}
      cy={height / 2}
      r={radius}
      fill="none"
      stroke={color}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={circumference}
      transform="rotate(-90 {width / 2} {height / 2})"
      class="progress-stroke"
    />
  </svg>

  {#if showIcon && icon && !infinite}
    <div
      bind:this={iconRef}
      class="icon-container"
      style="font-size: {Math.min(width, height) * 0.4}px;"
    >
      <span class="material-symbols-outlined">{icon}</span>
    </div>
  {/if}
</div>

<style>
  .loader-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .progress-circle {
    position: absolute;
    top: 0;
    left: 0;
  }

  .progress-stroke {
    /* Keep transition for smooth updates, even in infinite mode if progress changes */
    transition: stroke-dashoffset 0.1s ease-out;
  }

  /* Only apply 'complete' styles if not in infinite mode */
  .progress-circle.complete .progress-stroke {
    stroke: #08e200;
  }

  .icon-container {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .icon-container .material-symbols-outlined {
    color: #08e200;
    font-variation-settings:
      "FILL" 1,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
  }
</style>
