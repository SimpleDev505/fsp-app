<script lang="ts">
  import Dpage from "./lib/Dpage.svelte";
</script>

<main>
  <Dpage></Dpage>
</main>

<!-- <div class="duration">
      <p>
        <span
          style="width: 100%; display: flex; flex-direction: row; justify-content: center;align-items:center; column-gap: 5px;"
        >
          <span class="material-symbols-outlined">schedule</span>
          {flight?.itineraries[0]?.duration?.replace("PT", "").toLowerCase()}
        </span>
        <span style="width: 100%;" class="material-symbols-outlined"
          >horizontal_rule</span
        >
        {flight?.itineraries[0]?.segments?.length === 1
          ? "Non-stop"
          : `${flight?.itineraries[0]?.segments?.length - 1} layover`}
      </p>
    </div> -->

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
