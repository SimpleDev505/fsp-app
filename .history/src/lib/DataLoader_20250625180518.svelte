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
  }: Props = $props();

  let progress = $state(0);
  let isComplete = $state(false);
  let showIcon = $state(false);

  let circleRef: SVGCircleElement;
  let iconRef: HTMLDivElement;
  let containerRef: HTMLDivElement;

  const radius = Math.min(width, height) / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  onMount(() => {
    // Reset component state
    progress = 0;
    isComplete = false;
    showIcon = false;

    // Reset circle stroke
    if (circleRef) {
      circleRef.style.strokeDashoffset = circumference.toString();
    }

    // Start the progress animation
    const tl = gsap.timeline();

    // Animate progress from 0 to 100
    tl.to(
      {},
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
                  // Keep icon visible for iconStayTime, then trigger callback
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

    return () => {
      tl.kill();
    };
  });

  // Calculate stroke dash offset based on progress
  $effect(() => {
    if (circleRef) {
      const offset = circumference - (progress / 100) * circumference;
      circleRef.style.strokeDashoffset = offset.toString();
    }
  });
</script>

<div
  bind:this={containerRef}
  class="loader-container"
  style="width: {width}px; height: {height}px;"
>
  <!-- Progress Circle -->
  <svg class="progress-circle" {width} {height} class:complete={isComplete}>
    <!-- Background circle -->
    <circle
      cx={width / 2}
      cy={height / 2}
      r={radius}
      fill="none"
      stroke="#e5e5e5"
      stroke-width={strokeWidth}
    />

    <!-- Progress circle -->
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

  <!-- Icon (if provided) -->
  {#if showIcon && icon}
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
    transition: stroke-dashoffset 0.1s ease-out;
  }

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
