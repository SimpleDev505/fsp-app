<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  export type StatusMessage = {
    message: string | null;
    type: "WARN" | "ERROR" | "SUCCESS";
  };
  let {
    P_error,
    Type = "SUCCESS",
  }: { P_error: string | null; Type?: "WARN" | "ERROR" | "SUCCESS" } = $props();
  onMount(() => {
    gsap.fromTo(
      "#perror",
      {
        opacity: 0,
        scaleX: 0,
        scaleY: 1,
      },
      {
        duration: 1,
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        ease: "back.inOut",
      }
    );
  });
</script>

<p
  id="perror"
  style="font-size: var(--font-s); font-weight: 500; color: {Type === 'ERROR'
    ? 'var(--red);'
    : Type === 'SUCCESS'
      ? 'var(--green);'
      : 'var(--yellow);'} width: 100%; height: fit-content; padding: 5px; background-color: {Type ===
  'ERROR'
    ? 'rgba(255,0,0,.2);'
    : Type === 'SUCCESS'
      ? 'rgba(0,255,0,.2);'
      : 'rgba(255,255,0,.2);'};
            border-radius: 3px; white-space: nowrap;
            border-left: 3px solid {Type === 'ERROR'
    ? 'var(--red);'
    : Type === 'SUCCESS'
      ? 'var(--green);'
      : 'var(--yellow);'};"
>
  {#if P_error}
    {P_error}
  {:else}
    {"Could Not Determine Cause Of Error!"}
  {/if}
</p>
