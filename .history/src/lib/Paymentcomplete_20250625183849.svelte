<script lang="ts">
  import gsap from "gsap";
  import { onMount } from "svelte";

  export async function animatePaymentSuccessScoped() {
    const units = document.querySelectorAll(".animation-unit");

    for (const unit of units) {
      const icon = unit.querySelector(".payment-icon");
      const msg = unit.querySelector(".payment-msg");
      const trailLeft = unit.querySelector(".trail-left");
      const trailRight = unit.querySelector(".trail-right");

      const tl = gsap.timeline();

      // Reveal unit container
      tl.to(unit, { opacity: 1, duration: 0.1 });

      // Animate trail from left
      tl.to(trailLeft, {
        width: "50px",
        duration: 0.4,
        ease: "power2.out",
      });

      // Animate icon
      tl.to(icon, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      });

      // Animate message
      tl.to(msg, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Hold for viewing
      tl.to({}, { duration: 1.2 });

      // Animate out icon and msg
      tl.to([icon, msg], {
        opacity: 0,
        x: 60,
        duration: 0.4,
        ease: "power2.in",
      });

      // Animate trail to right
      tl.to(trailRight, {
        width: "50px",
        duration: 0.4,
        ease: "power2.out",
      });

      // Hide container again
      tl.to(unit, { opacity: 0, duration: 0.1 });

      await tl.play(); // Wait for current unit to finish before next
    }
  }

  onMount(() => {
    requestAnimationFrame(() => {
      animatePaymentSuccess();
    });
  });
</script>

<div id="payment-animation-container">
  <div class="animation-unit">
    <div class="air-trail trail-left"></div>
    <span class="material-symbols-outlined payment-icon">flight</span>
    <div class="payment-msg">Booking Confirmed</div>
    <div class="air-trail trail-right"></div>
  </div>

  <div class="animation-unit">
    <div class="air-trail trail-left"></div>
    <span class="material-symbols-outlined payment-icon">check_circle</span>
    <div class="payment-msg">Seats Reserved</div>
    <div class="air-trail trail-right"></div>
  </div>

  <div class="animation-unit">
    <div class="air-trail trail-left"></div>
    <span class="material-symbols-outlined payment-icon">verified_user</span>
    <div class="payment-msg">E-Ticket Sent</div>
    <div class="air-trail trail-right"></div>
  </div>

  <div class="animation-unit">
    <div class="air-trail trail-left"></div>
    <span class="material-symbols-outlined payment-icon">celebration</span>
    <div class="payment-msg">Happy Journey!</div>
    <div class="air-trail trail-right"></div>
  </div>
</div>

<style>
  #payment-animation-container {
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    overflow: hidden;
    padding: 20px;
    background: white;
  }

  .animation-unit {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
  }

  .payment-icon {
    font-size: 48px;
    transform: scale(0.5) translateX(-100px);
    opacity: 0;
  }

  .payment-msg {
    font-size: 16px;
    color: #333;
    opacity: 0;
    transform: translateX(-20px);
  }

  .air-trail {
    height: 4px;
    background: #04b0d3;
    width: 0;
    border-radius: 2px;
  }

  .trail-left {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .trail-right {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
