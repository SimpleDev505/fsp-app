<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    Current_SearchFilter,
    CurrentAppPage,
    CurrentNav,
    ExtraFiltered_Results,
    FlightSearchResults,
    Searched,
  } from "./Store/store";
  import { LoginData, UserLogged } from "./Store/login";
  import { get } from "svelte/store";
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
    navitem = document.getElementById($CurrentNav.toString());
    if (navitem) {
      navitem.classList.add("nav-selected");
    }
  }
  let logindetail: LoginData | null = $derived($LoginData ?? null);
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
          $CurrentNav = "home-link";
          break;
        case "about-link":
          $CurrentAppPage = "ABOUT";
          $CurrentNav = "about-link";
          break;
        case "contact-link":
          $CurrentAppPage = "CONTACT";
          $CurrentNav = "contact-link";
          break;
        case "signup_login-link":
          LoginData.set(null);
          UserLogged.set(false);
          $CurrentAppPage = "LOGIN";
          $CurrentNav = "signup_login-link";
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
          {#if !$UserLogged}
            SignUp /Login
          {:else}
            <span>Log Out</span><img
              style="object-fit: contain; width: 40px; height: 40px; border-radius: 50%;"
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QCRRXhpZgAASUkqAAgAAAADAA4BAgBHAAAAMgAAABoBBQABAAAAeQAAABsBBQABAAAAgQAAAAAAAABEZWZhdWx0IHByb2ZpbGUgcGljdHVyZSwgYXZhdGFyLCBwaG90byBwbGFjZWhvbGRlci4gVmVjdG9yIGlsbHVzdHJhdGlvbiwBAAABAAAALAEAAAEAAAD/4QXHaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj4KCTxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpJcHRjNHhtcENvcmU9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBDb3JlLzEuMC94bWxucy8iICAgeG1sbnM6R2V0dHlJbWFnZXNHSUZUPSJodHRwOi8veG1wLmdldHR5aW1hZ2VzLmNvbS9naWZ0LzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGx1cz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi94bXAvMS4wLyIgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIHBob3Rvc2hvcDpDcmVkaXQ9IkdldHR5IEltYWdlcy9pU3RvY2twaG90byIgR2V0dHlJbWFnZXNHSUZUOkFzc2V0SUQ9IjEyMjM2NzEzOTIiIHhtcFJpZ2h0czpXZWJTdGF0ZW1lbnQ9Imh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9sZWdhbC9saWNlbnNlLWFncmVlbWVudD91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIgcGx1czpEYXRhTWluaW5nPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3ZvY2FiL0RNSS1QUk9ISUJJVEVELUVYQ0VQVFNFQVJDSEVOR0lORUlOREVYSU5HIiA+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+Y3VtYWNyZWF0aXZlPC9yZGY6bGk+PC9yZGY6U2VxPjwvZGM6Y3JlYXRvcj48ZGM6ZGVzY3JpcHRpb24+PHJkZjpBbHQ+PHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5EZWZhdWx0IHByb2ZpbGUgcGljdHVyZSwgYXZhdGFyLCBwaG90byBwbGFjZWhvbGRlci4gVmVjdG9yIGlsbHVzdHJhdGlvbjwvcmRmOmxpPjwvcmRmOkFsdD48L2RjOmRlc2NyaXB0aW9uPgo8cGx1czpMaWNlbnNvcj48cmRmOlNlcT48cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz48cGx1czpMaWNlbnNvclVSTD5odHRwczovL3d3dy5pc3RvY2twaG90by5jb20vcGhvdG8vbGljZW5zZS1nbTEyMjM2NzEzOTItP3V0bV9tZWRpdW09b3JnYW5pYyZhbXA7dXRtX3NvdXJjZT1nb29nbGUmYW1wO3V0bV9jYW1wYWlnbj1pcHRjdXJsPC9wbHVzOkxpY2Vuc29yVVJMPjwvcmRmOmxpPjwvcmRmOlNlcT48L3BsdXM6TGljZW5zb3I+CgkJPC9yZGY6RGVzY3JpcHRpb24+Cgk8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJ3Ij8+Cv/tAJZQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAehwCUAAMY3VtYWNyZWF0aXZlHAJ4AEdEZWZhdWx0IHByb2ZpbGUgcGljdHVyZSwgYXZhdGFyLCBwaG90byBwbGFjZWhvbGRlci4gVmVjdG9yIGlsbHVzdHJhdGlvbhwCbgAYR2V0dHkgSW1hZ2VzL2lTdG9ja3Bob3Rv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PPPPPPOJD/zMPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPONH//AP8A/wD2/PPPPPPPPPPPPPPPPPPPPPPPPPPPPPNP/wD/AP8A/wD/AP8A9PPPPPPPPPPPPPPPPPPPPPPPPPPPLH//AP8A/wD/AP8A/wD/ADzzzzzzzzzzzzzzzzzzzzzzzzzzyz//AP8A/wD/AP8A/wD+/wA88888888888888888888888888f8A/wD/AP8A/wD/AP8A/wC/zzzzzzzzzzzzzzzzzzzzzzzzzzzf/wD/AP8A/wD/AP8A/wD/ANPPPPPPPPPPPPPPPPPPPPPPPPPPH/8A/wD/AP8A/wD/AP8A/wDc88888888888888888888888888X/AP8A/wD/AP8A/wD/AP8Atzzzzzzzzzzzzzzzzzzzzzzzzzzzj/8A/wD/AP8A/wD/AP8A7888888888888888888888888888s3//AP8A/wD/AP8A/wDs88888888888888888888888888888/8A/wD/AP8A/wD+tzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzf/8A/wD/APJzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwxjDjRzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxS8/wD/AP8A/wD/AP3/ANzzzzzzzzzzzzzzzzzzzzzzzzy//wD/AP8A/wD/AP8A/wD/AP8A/wDv408888888888888888888k//AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AD8PPPPPPPPPPPPPPPPPJ/8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AL1PPPPPPPPPPPPPPPLP/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wC/Tzzzzzzzzzzzzzhf/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AFPPPPPPPPPPPPPPP/8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wDY88888888888888//AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wA88888888888888/8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD+vzzzzzzz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"
              alt=""
            />
            <div class="login-detail">
              <p>
                {logindetail?.username} <span>^</span>
              </p>
              <p><span>Email:</span> {logindetail?.email}</p>
              <p><span>Phone:</span> {logindetail?.phone}</p>
              <p><span>User Type:</span> {logindetail?.user_type}</p>
            </div>
          {/if}
        </button>
      </li>
    {/if}
  </ul>
</div>

<style>
  .login-detail {
    border-radius: 12px;
    outline: 3px solid var(--grey-light);
    padding: 10px;
    top: 55px;
    right: 10px;
    box-shadow: rgba(43, 8, 243, 0.15) 0px 48px 100px 0px;
    color: var(--blue);
    position: absolute;
    z-index: 999999;
    display: grid;
    grid-template-columns: 5fr 1fr;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: fit-content;
    height: fit-content;
    background-color: white;
  }
  .login-detail span {
    grid-column: 1;
  }
  .login-detail p {
    border-bottom: 1px solid var(--grey-light);
    grid-column: 3;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }
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
  .navitem {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .navitem button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
    height: fit-content;
    width: fit-content;
    background: transparent;
    box-shadow: none;
    color: white;
    font-weight: 300;
    border: none;
    cursor: pointer;
    padding: 4px;
    width: fit-content;
    height: fit-content;
    font-size: var(--font--sm);
  }
  :global(.nav-selected) {
    text-decoration: underline 2px white;
  }
</style>
