<script lang="ts">
  import Card from "./Card.svelte";
</script>

<div class="home-descrp">
  <Card descp="None"></Card>
</div>

<style>
  .home-descrp {
    position: absolute;
    top: 300px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: fit-content;
    grid-column: 1;
    grid-row: 3;
  }
</style>
