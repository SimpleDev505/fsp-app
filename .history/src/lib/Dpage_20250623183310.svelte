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
{:else if $CurrentAppPage === "HOME"}
  <Home></Home>
{/if}
<button class="nav-top-btn">Top</button>

<style>
  .nav-top-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 99999999;
  }
</style>
