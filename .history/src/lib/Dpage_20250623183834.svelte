<script lang="ts">
  import AboutPage from "./AboutPage.svelte";
  import Home from "./Home.svelte";
  import LoginForm from "./LoginForm.svelte";
  import SearchResult from "./SearchResult.svelte";
  import { UserLogged } from "./Store/login";
  import { CurrentAppPage, Searched } from "./Store/store";

  function navToTop() {
    
  }
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
<button onclick= class="nav-top-btn">Top</button>

<style>
  .nav-top-btn {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 99999999;
    background-color: var(--blue);
    color: white;
    padding: 10px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-weight: bold;
    outline: 3px solid var(--grey-light);
  }
  .nav-top-btn:hover {
    background-color: var(--blue-dark);
  }
</style>
