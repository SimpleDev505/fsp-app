<script lang="ts">
  import gsap from "gsap";
  import { onMount } from "svelte";

  const iconSet = [
    { icon: "flight", msg: "Booking Confirmed" },
    { icon: "check_circle", msg: "Seats Reserved" },
    { icon: "verified_user", msg: "E-Ticket Sent" },
    { icon: "celebration", msg: "Happy Journey!" },
  ];

  export async function animatePaymentSequence() {
    const iconEl: HTMLElement = document.querySelector(".payment-icon")!;
    const msgEl: HTMLElement = document.querySelector(".payment-msg")!;
    const trailFill: HTMLElement = document.querySelector(".trail-fill")!;

    for (const { icon, msg } of iconSet) {
      // Reset visual state
      iconEl.innerText = icon;
      msgEl.innerText = msg;
      iconEl.style.opacity = "0";
      msgEl.style.opacity = "0";
      iconEl.style.transform = "scale(0.5)";
      msgEl.style.transform = "translateY(10px)";
      trailFill.style.width = "0%";

      // Animate trail fill first
      gsap.to(trailFill, {
        width: "100%",
        duration: 1.2,
        ease: "power2.out",
      });

      // Wait half fill (0.6s), then icon and message
      await new Promise((r) => setTimeout(r, 600));

      const tl = gsap.timeline();

      tl.to(iconEl, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      });

      tl.to(
        msgEl,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      );

      // Hold the whole step before next
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Optionally: end with a zoom-out or confetti
  }

  onMount(() => {
    requestAnimationFrame(() => {
      animatePaymentSuccessScoped();
    });
  });
</script>

<div id="payment-animation-container">
  <div class="animation-unit">
    <div class="material-symbols-outlined payment-icon">flight</div>
    <div class="trail-bar">
      <div class="trail-fill"></div>
    </div>
    <div class="payment-msg">Booking Confirmed</div>
  </div>
</div>

<style>
  #payment-animation-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    background: white;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;
  }

  .animation-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
  }

  .payment-icon {
    font-size: 60px;
    opacity: 0;
    transform: scale(0.5);
    color: #04b0d3;
  }

  .payment-msg {
    font-size: 18px;
    color: #333;
    opacity: 0;
    transform: translateY(10px);
  }

  .trail-bar {
    width: 120px;
    height: 4px;
    background: #ccc;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .trail-fill {
    height: 100%;
    width: 0%;
    background: #04b0d3;
    transition: width 0.6s ease-out;
  }
</style>
