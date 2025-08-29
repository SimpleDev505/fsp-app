<script lang="ts">
  let {
    P_error,
    Type = "SUCCESS",
  }: { P_error: string; Type?: "WARN" | "ERROR" | "SUCCESS" } = $props();
</script>

<p
  id="perror"
  style="font-size: var(--font-s); color: {Type === 'ERROR'
    ? 'var(--red);'
    : Type === 'SUCCESS'
      ? 'var(--green);'
      : 'var(--yellow);'}; width: 100%; height: fit-content; padding: 5px; background-color: rgba(255, 0, 0, 0.1);
            border-radius: 3px; white-space: nowrap;
            border-left: 3px solid var(--red);"
>
  {P_error}
</p>
