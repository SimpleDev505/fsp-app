<script lang="ts">
  import gsap from "gsap";
  import { onMount } from "svelte";
  let { action }: { action: (...args: any[]) => void } = $props();
  const iconSet = [
    { icon: "flight", msg: "Booking Confirmed" },
    { icon: "check_circle", msg: "Tickets Registered" },
    { icon: "verified_user", msg: "Email Sent!" },
    { icon: "celebration", msg: "Happy Journey!" },
  ];

  export async function animatePaymentSequence() {
    const iconEl = document.querySelector(".payment-icon") as HTMLElement;
    const msgEl = document.querySelector(".payment-msg") as HTMLElement;
    const dotEls = document.querySelectorAll(".dot") as NodeListOf<HTMLElement>;
    const activeDot = document.querySelector(".active-dot") as HTMLElement;

    const iconStartScale = 0.4;
    const iconPeakScale = 1.05;
    const iconEndScale = 0;

    const iconInX = 0;
    const iconOutX = 100;
    const iconStartX = -100;

    const durationPerStep = 1.3;
    const stretchWidth = 26;

    for (let i = 0; i < iconSet.length; i++) {
      const { icon, msg } = iconSet[i];

      iconEl.innerText = icon;
      msgEl.innerText = msg;

      gsap.set(iconEl, { x: iconStartX, scale: iconStartScale, opacity: 0 });
      gsap.set(msgEl, { opacity: 0 });

      const dotX = dotEls[i].offsetLeft;

      const tl = gsap.timeline();

      if (i < iconSet.length - 1) {
        tl.to(activeDot, {
          x: dotX,
          width: stretchWidth,
          duration: 0.3,
          ease: "power1.out",
        });
        tl.to(activeDot, {
          width: 10,
          duration: 0.2,
          ease: "power1.inOut",
        });
      } else {
        tl.to(activeDot, {
          x: dotX,
          width: 10,
          duration: 0.4,
          ease: "power1.inOut",
        });
      }

      tl.to(
        iconEl,
        {
          opacity: 1,
          x: iconInX,
          scale: iconPeakScale,
          duration: 0.5,
          ease: "back.out(1.6)",
        },
        "-=0.3"
      );

      tl.to(
        msgEl,
        {
          opacity: 1,
          duration: 0.3,
          ease: "power1.out",
        },
        "-=0.2"
      );

      tl.to({}, { duration: durationPerStep });

      tl.to(iconEl, {
        x: iconOutX,
        scale: iconEndScale,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });

      tl.to(
        msgEl,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power1.in",
        },
        "-=0.4"
      );

      await tl.play();
    }

    gsap.to([iconEl, msgEl, activeDot], {
      opacity: 1,
      duration: 2,
      onComplete: () => {
        action();
      },
    });
  }

  onMount(() => {
    requestAnimationFrame(() => {
      animatePaymentSequence();
    });
  });
</script>

<div id="payment-animation-container">
  <h3>Payment Complete</h3>
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
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    position: relative;
    gap: 14px;
    color: var(--blue);
    width: 100%;
    outline: 3px solid var(--grey-light);
    border-radius: 10px;
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
    color: var(--grey-dark);
    transition: 0.3s ease;
    font-weight: bold;
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
    background-color: var(--blue);
    border-radius: 50px;
    transform: scale(1);
    z-index: 1;
  }
</style>
