<script lang="ts">
  import Home from "./Home.svelte";
  import SearchResult from "./SearchResult.svelte";
  import { Searched } from "./Store/store";
</script>

{#if $Searched}
  <SearchResult></SearchResult>
{:else}
  <Home></Home>
{/if}
