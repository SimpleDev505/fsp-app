<script lang="ts">
  import Home from "./Home.svelte";
  import LoginForm from "./LoginForm.svelte";
  import SearchResult from "./SearchResult.svelte";
  import { UserLogged } from "./Store/login";
  import { Searched } from "./Store/store";
</script>

{#if $Searched}
  <SearchResult></SearchResult>
{:else if !$UserLogged}
  <LoginForm></LoginForm>
{:else}
  <Home></Home>
{/if}
