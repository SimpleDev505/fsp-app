<script lang="ts">
  import gsap from "gsap";
  import { onMount } from "svelte";

  const iconSet = [
    { icon: "flight", msg: "Booking Confirmed" },
    { icon: "check_circle", msg: "Seats Reserved" },
    { icon: "verified_user", msg: "E-Ticket Sent" },
    { icon: "celebration", msg: "Happy Journey!" },
  ];

  export async function animatePayment() {
    const iconEl: HTMLElement = document.querySelector(".payment-icon")!;
    const msgEl: HTMLElement = document.querySelector(".payment-msg")!;
    const dots: HTMLElement = document.querySelectorAll(".dot");

    for (let i = 0; i < iconSet.length; i++) {
      const { icon, msg } = iconSet[i];

      // Setup next icon/message
      iconEl.innerText = icon;
      msgEl.innerText = msg;
      gsap.set(iconEl, { opacity: 0, x: -100, scale: 0.4 });
      gsap.set(msgEl, { opacity: 0, y: 10 });

      // Reset all dot scales
      gsap.set(dots, { scale: 1, background: "#ccc" });

      // Animate dot scale and color
      gsap.to(dots[i], {
        scale: 1.4,
        background: "#04b0d3",
        duration: 0.4,
        ease: "power1.out",
      });

      const tl = gsap.timeline();

      tl.to(iconEl, {
        opacity: 1,
        x: 0,
        scale: 1.05,
        duration: 0.6,
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
        "-=0.3"
      );

      tl.to({}, { duration: 1 }); // Hold

      tl.to([iconEl, msgEl], {
        x: 100,
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });

      await tl.play();
    }
  }

  onMount(() => {
    requestAnimationFrame(() => {
      animatePayment();
    });
  });
</script>

<div id="payment-animation-container">
  <div class="icon-layer">
    <span class="material-symbols-outlined payment-icon">flight</span>
  </div>

  <div class="payment-msg">Booking Confirmed</div>

  <div class="carousel-dots">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</div>

<style>
  #payment-animation-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    position: relative;
    gap: 12px;
  }

  .icon-layer {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .payment-icon {
    position: absolute;
    font-size: 64px;
    opacity: 0;
  }

  .payment-msg {
    font-size: 16px;
    color: #333;
    opacity: 0;
  }

  .carousel-dots {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }

  .dot {
    width: 10px;
    height: 10px;
    background: #ccc;
    border-radius: 50%;
    transform: scale(1);
  }
</style>
