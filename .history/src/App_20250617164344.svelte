<script lang="ts">
  import Home from "./lib/Home.svelte";
</script>

<main>
  <Home></Home>
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
    --font--lg: 20px;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
