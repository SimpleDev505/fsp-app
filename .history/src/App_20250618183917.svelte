<script lang="ts">
  import Dpage from "./lib/Dpage.svelte";
</script>

<main>
  <Dpage></Dpage>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
  }
  :root {
    --blue: #04b0d3;
    --green: #08e200;
    --yellow: #e7c205;
    --grey-light: #ebebeb;
    --grey-dark: #6d6d6d;
    --red: #e8651a;
    --blue-dark: #018daa;

    /* Fonts */
    --font-s: 14px;
    --font-sm: 16px;
    --font-lg: 20px;
    --font-xg: 30px;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
