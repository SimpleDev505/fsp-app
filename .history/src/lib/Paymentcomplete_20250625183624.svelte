<script lang="ts">
  import gsap from "gsap";
  import { onMount } from "svelte";

  export function animatePaymentSuccess() {
    const tl = gsap.timeline();

    // 1. Animate trail from left to center
    tl.to(".trail-left", {
      width: "50%",
      duration: 0.6,
      ease: "power2.out",
    });

    // 2. Animate icons one-by-one with stagger
    tl.to(".icon", {
      opacity: 1,
      scale: 1,
      x: 0,
      stagger: 0.25,
      duration: 0.6,
      ease: "back.out(1.7)",
    });

    // 3. Animate messages one-by-one after icons
    tl.to(
      ".msg",
      {
        opacity: 1,
        x: 0,
        stagger: 0.25,
        duration: 0.5,
        ease: "power2.out",
      },
      "+=0.2"
    ); // slight delay

    // 4. Pause before exit
    tl.to({}, { duration: 1 });

    // 5. Icons scale up and fly to right one-by-one
    tl.to(".icon", {
      scale: 1.4,
      x: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 0.6,
      ease: "power2.in",
    });

    // 6. Trail from center to right
    tl.to(
      ".trail-right",
      {
        width: "50%",
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4"
    ); // overlap with exit

    // 7. Messages fade out
    tl.to(
      ".msg",
      {
        opacity: 0,
        x: 20,
        stagger: 0.2,
        duration: 0.4,
        ease: "power2.in",
      },
      "-=0.5"
    );
  }

  onMount(() => {
    requestAnimationFrame(() => {
      animatePaymentSuccess();
    });
  });
</script>

<div id="payment-animation-container">
  <div class="icon-wrapper">
    <span class="material-symbols-outlined icon">flight</span>
    <span class="material-symbols-outlined icon">check_circle</span>
    <span class="material-symbols-outlined icon">verified_user</span>
    <span class="material-symbols-outlined icon">celebration</span>
  </div>

  <div class="air-trails">
    <div class="trail trail-left"></div>
    <div class="trail trail-right"></div>
  </div>

  <div class="messages">
    <div class="msg">Booking Confirmed</div>
    <div class="msg">Seats Reserved</div>
    <div class="msg">E-Ticket Sent</div>
    <div class="msg">Happy Journey!</div>
  </div>
</div>

<style>
  #payment-animation-container {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
  }

  .icon-wrapper {
    display: flex;
    gap: 40px;
    z-index: 2;
  }

  .icon {
    font-size: 48px;
    opacity: 0;
    transform: scale(0.5) translateX(-100px);
  }

  .air-trails {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    pointer-events: none;
    z-index: 1;
  }

  .trail {
    height: 4px;
    background: #04b0d3;
    width: 0;
    position: absolute;
    top: 0;
    border-radius: 2px;
  }

  .trail-left {
    left: 0;
  }

  .trail-right {
    right: 0;
  }

  .messages {
    display: flex;
    gap: 24px;
    z-index: 2;
  }

  .msg {
    opacity: 0;
    font-size: 18px;
    color: #333;
    transform: translateX(-20px);
  }
</style>
