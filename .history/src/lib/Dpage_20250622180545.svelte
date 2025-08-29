<script lang="ts">
  import AboutPage from "./AboutPage.svelte";
  import Home from "./Home.svelte";
  import LoginForm from "./LoginForm.svelte";
  import SearchResult from "./SearchResult.svelte";
  import { UserLogged } from "./Store/login";
  import { CurrentAppPage, Searched } from "./Store/store";
</script>

{#if $Searched && $CurrentAppPage === "HOME"}
  <SearchResult></SearchResult>
{:else if !$UserLogged && $CurrentAppPage === "LOGIN"}
  <LoginForm></LoginForm>
{:else if $CurrentAppPage === "ABOUT"}
  <AboutPage></AboutPage>
{:else}
  <Home></Home>
{/if}
