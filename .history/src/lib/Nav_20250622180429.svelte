<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    Current_SearchFilter,
    CurrentAppPage,
    ExtraFiltered_Results,
    FlightSearchResults,
    Searched,
  } from "./Store/store";
  let { LoggedInVisible = true }: { LoggedInVisible?: boolean } = $props();
  let nav_sticky = $state(false);
  let navitem: HTMLElement | null = $state(null);
  function handlenavscroll(e: Event) {
    if (scrollY > 10) {
      nav_sticky = true;
    } else {
      nav_sticky = false;
    }
  }
  function Navigate() {
    navitem = document.getElementById("home-link");
    if (navitem) {
      navitem.classList.add("nav-selected");
    }
  }
  onMount(() => {
    window.addEventListener("scroll", handlenavscroll);
    Navigate();
    return () => window.removeEventListener("scroll", handlenavscroll);
  });

  onDestroy(() => {
    window.removeEventListener("scroll", handlenavscroll);
  });
  function navClicked(e: MouseEvent) {
    if (navitem) {
      navitem.classList.remove("nav-selected");
      navitem = e.currentTarget as HTMLElement;
      navitem.className += " nav-selected";
      switch (navitem.id) {
        case "home-link":
          Searched.set(false);
          FlightSearchResults.set(null);
          ExtraFiltered_Results.set(null);
          Current_SearchFilter.set({
            triptype: "One Way",
            class: "Economy",
            timings: [
              {
                from: "none",
                to: "none",
                dep: "none",
                return: "none",
              },
            ],
            passengers: {
              adult: 1,
              child: 0,
              infant: 0,
            },
            currency: "INR",
            extra: {
              airlines: "Air India",
              departime: "12Pm to 6Pm",
              duration_hrs: 4,
              popularfilters: "Air India",
              pricerange: 5000,
              stops: "1",
            },
          });
          $CurrentAppPage = "HOME";
          break;
        case "about-link":
          break;
        case "contact-link":
          break;
        case "signup_login-link":
          break;
      }
    } else {
      navitem = e.currentTarget as HTMLElement;
    }
  }
</script>

<div class="nav-cnt {nav_sticky ? 'nav-sticky' : 'nav-nonsticky'}">
  <span class="nav-title">AIRLINE COMPANY</span>
  <ul class="navlinks">
    <li class="navitem">
      <button id="home-link" onclick={navClicked}> Home </button>
    </li>
    <li class="navitem">
      <button id="about-link" onclick={navClicked}> About </button>
    </li>
    <li class="navitem">
      <button id="contact-link" onclick={navClicked}> Contact </button>
    </li>
    {#if LoggedInVisible}
      <li class="navitem">
        <button id="signup_login-link" onclick={navClicked}>
          SignUp /Login
        </button>
      </li>
    {/if}
  </ul>
</div>

<style>
  .nav-title {
    white-space: nowrap;
    font-weight: bolder;
    font-size: var(--font-lg);
  }
  .nav-cnt {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 3em;
    color: white;
    z-index: 1000;
    padding: 10px;
    transition: 0.2s ease-in;
  }
  .nav-sticky {
    position: fixed;
    z-index: 10001;
    top: 0;
    left: 0;
    padding: 10px;
    background-color: var(--blue-dark);
    box-shadow: 1px 2px 0px 0px var(--grey-light);
    -webkit-box-shadow: 1px 2px 0px 0px var(--grey-light);
    -moz-box-shadow: 1px 2px 0px 05px var(--grey-light);
  }
  .nav-nonsticky {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    z-index: 10001;
    background-color: var(--blue-dark);
  }
  .navlinks {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    list-style-type: none;
    text-decoration: none;
    width: fit-content;
  }
  .navitem button {
    background: transparent;
    box-shadow: none;
    color: white;
    font-weight: 300;
    border: none;
    cursor: pointer;
    padding: 4px;
    font-size: var(--font--sm);
  }
  :global(.nav-selected) {
    text-decoration: underline 2px white;
  }
</style>
