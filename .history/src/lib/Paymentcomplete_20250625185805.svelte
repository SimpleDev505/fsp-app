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
    const iconEl = document.querySelector(".payment-icon") as HTMLElement;
    const msgEl = document.querySelector(".payment-msg") as HTMLElement;
    const dotEls = document.querySelectorAll(".dot") as NodeListOf<HTMLElement>;
    const activeDot = document.querySelector(".active-dot") as HTMLElement;

    const dotSpacing = 20; // gap between dots

    for (let i = 0; i < iconSet.length; i++) {
      const { icon, msg } = iconSet[i];

      // Setup content
      iconEl.innerText = icon;
      msgEl.innerText = msg;

      // Reset icon and msg
      gsap.set(iconEl, { x: -100, scale: 0.4, opacity: 0 });
      gsap.set(msgEl, { opacity: 0 });

      // Animate dot movement with stretch
      const targetDot = dotEls[i];
      const dotX = targetDot.offsetLeft;

      const tl = gsap.timeline();

      // Animate active dot with stretch (Android style)
      tl.to(activeDot, {
        x: dotX,
        width: 26,
        duration: 0.3,
        ease: "power1.out",
      });

      tl.to(activeDot, {
        width: 10,
        duration: 0.2,
        ease: "power1.inOut",
      });

      // Animate icon in
      tl.to(
        iconEl,
        {
          opacity: 1,
          x: 0,
          scale: 1.05,
          duration: 0.5,
          ease: "back.out(1.6)",
        },
        "-=0.4"
      );

      // Animate message in
      tl.to(
        msgEl,
        {
          opacity: 1,
          duration: 0.3,
        },
        "-=0.2"
      );

      // Wait for a while
      tl.to({}, { duration: 1.3 });

      // Animate icon out (right)
      tl.to([iconEl, msgEl], {
        opacity: 0,
        x: 100,
        scale: 0,
        duration: 0.5,
        ease: "power2.in",
      });

      await tl.play();
    }

    // Optionally fade everything out at the end
    gsap.to([iconEl, msgEl, activeDot], { opacity: 0, duration: 0.5 });
  }

  onMount(() => {
    requestAnimationFrame(() => {
      animatePaymentSequence();
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
    <div class="active-dot"></div>
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
    gap: 14px;
    color: var(--blue);
  }

  .icon-layer {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .payment-icon {
    font-size: 60px;
    position: absolute;
    opacity: 0;
  }

  .payment-msg {
    font-size: 18px;
    opacity: 0;
    color: #333;
    transition: 0.3s ease;
    width: fit-content;
    height: fit-content;
  }

  .carousel-dots {
    position: relative;
    display: flex;
    gap: 20px;
    margin-top: 16px;
  }

  .dot {
    width: 10px;
    height: 10px;
    background-color: #ccc;
    border-radius: 50%;
    position: relative;
  }

  .active-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    background-color: #04b0d3;
    border-radius: 50px;
    transform: scale(1);
    z-index: 1;
  }
</style>
