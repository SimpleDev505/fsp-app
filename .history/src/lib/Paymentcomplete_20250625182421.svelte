<script>
  const icons = document.querySelectorAll(".icon");
  const texts = document.querySelectorAll(".text");
  const trails = document.querySelectorAll(".trail");

  function startAnimation() {
    // Reset all elements
    gsap.set([icons, texts, trails], {
      opacity: 0,
      scale: 0,
      x: 0,
      rotation: 0,
    });

    // Main timeline
    const tl = gsap.timeline();

    // Animate each icon sequence
    icons.forEach((icon, index) => {
      const text = texts[index];

      // Icon animation sequence
      tl.fromTo(
        icon,
        {
          opacity: 0,
          scale: 0,
          x: -150,
          rotation: -180,
        },
        {
          opacity: 1,
          scale: 1.2,
          x: 0,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        index * 0.8
      )
        // Stay and pulse
        .to(icon, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        // Exit to right
        .to(
          icon,
          {
            opacity: 0,
            scale: 0,
            x: 150,
            rotation: 180,
            duration: 0.4,
            ease: "back.in(1.7)",
          },
          `+=${index === icons.length - 1 ? 1 : 0.3}`
        );

      // Text animation
      tl.fromTo(
        text,
        {
          opacity: 0,
          x: -30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        index * 0.8 + 0.2
      ).to(
        text,
        {
          opacity: 0,
          x: 30,
          duration: 0.3,
          ease: "power2.in",
        },
        `+=${index === icons.length - 1 ? 1.2 : 0.5}`
      );

      // Trail animations (for first 3 icons)
      if (index < 3) {
        trails.forEach((trail, trailIndex) => {
          // Left to center trail
          tl.fromTo(
            trail,
            {
              opacity: 0,
              x: -100 - trailIndex * 20,
              scaleY: 0,
            },
            {
              opacity: 0.6,
              x: -20,
              scaleY: 1,
              duration: 0.3,
              ease: "power2.out",
            },
            index * 0.8 + 0.1 + trailIndex * 0.05
          )
            // Fade at center
            .to(trail, {
              opacity: 0,
              duration: 0.2,
            })
            // Reappear and fly right
            .to(trail, {
              opacity: 0.4,
              x: 20,
              duration: 0.1,
            })
            .to(trail, {
              opacity: 0,
              x: 100 + trailIndex * 20,
              scaleY: 0,
              duration: 0.3,
              ease: "power2.in",
            });
        });
      }
    });

    return tl;
  }

  // Auto start animation when page loads
  window.addEventListener("load", () => {
    setTimeout(startAnimation, 500);
  });
</script>

<div class="animation-container">
  <div class="icon-stage">
    <!-- Icons -->
    <span class="material-icons icon processing">sync</span>
    <span class="material-icons icon verified">verified</span>
    <span class="material-icons icon security">security</span>
    <span class="material-icons icon success">check_circle</span>

    <!-- Trail lines -->
    <div class="trail trail-1"></div>
    <div class="trail trail-2"></div>
    <div class="trail trail-3"></div>
  </div>

  <div class="text-stage">
    <!-- Text messages -->
    <div class="text processing">Processing Payment...</div>
    <div class="text verified">Verifying Details...</div>
    <div class="text security">Securing Transaction...</div>
    <div class="text success">Payment Successful!</div>
  </div>

  <button class="restart-btn" onclick={() => startAnimation()}>Restart</button>
</div>

<style>
  .animation-container {
    position: relative;
    width: 400px;
    height: 200px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .icon-stage {
    position: relative;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon {
    position: absolute;
    font-size: 48px;
    opacity: 0;
    transform: scale(0);
  }

  .icon.processing {
    color: var(--blue);
  }

  .icon.verified {
    color: var(--yellow);
  }

  .icon.security {
    color: var(--red);
  }

  .icon.success {
    color: var(--green);
  }

  .trail {
    position: absolute;
    width: 2px;
    height: 20px;
    background: linear-gradient(45deg, var(--blue), transparent);
    opacity: 0;
    border-radius: 2px;
  }

  .trail-1 {
    transform: rotate(15deg);
    top: 20px;
  }

  .trail-2 {
    transform: rotate(-15deg);
    top: 40px;
  }

  .trail-3 {
    transform: rotate(30deg);
    top: 30px;
  }

  .text-stage {
    position: relative;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .text {
    position: absolute;
    font-size: var(--font-sm);
    font-weight: 500;
    opacity: 0;
    transform: translateX(-20px);
  }

  .text.processing {
    color: var(--blue);
  }

  .text.verified {
    color: var(--yellow);
  }

  .text.security {
    color: var(--red);
  }

  .text.success {
    color: var(--green);
  }

  .restart-btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: var(--blue);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--font-s);
  }

  .restart-btn:hover {
    background: var(--blue-dark);
  }
</style>
