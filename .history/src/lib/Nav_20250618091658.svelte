<script lang="ts">
  let nav_sticky = $state(false);
  let navitem: HTMLElement | null = $state(null);
  function handlenavscroll(e: Event) {
    if (scrollY > 10) {
      nav_sticky = true;
    } else {
      nav_sticky = false;
    }
  }
  window.addEventListener("scroll", handlenavscroll);
  window.addEventListener("DOMContentLoaded", () => {
    navitem = document.getElementById("home-link");
    if (navitem) {
      navitem.classList.add("nav-selected");
    }
  });
  function navClicked(e: MouseEvent) {
    if (navitem) {
      navitem.classList.remove("nav-selected");
      navitem = e.currentTarget as HTMLElement;
      switch (navitem.id) {
        case "home-link":
          navitem.className += " nav-selected";
          break;
        case "about-link":
          navitem.classList += " nav-selected";
          break;
        case "contact-link":
          navitem.classList += " nav-selected";
          break;
        case "signup_login-link":
          navitem.classList += " nav-selected";
          break;
      }
    } else {
      navitem = e.currentTarget as HTMLElement;
    }
  }
</script>

<div class="nav-cnt {nav_sticky ? 'nav-sticky' : 'nav-nonsticky'}">
  <ul class="navlinks">
    <li class="navitem">
      <button id="home-link" onclick={navClicked}> Home </button>
    </li>
    <li class="navitem">
      <button id="contact-link" onclick={navClicked}> Contact </button>
    </li>
    <li class="navitem">
      <button id="about-link" onclick={navClicked}> About </button>
    </li>
    <li class="navitem">
      <button id="signup_login-link" onclick={navClicked}>
        SignUp /Login
      </button>
    </li>
  </ul>
  <span class="nav-title">AIRLINE COMPANY</span>
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
    justify-content: center;
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
  }
  .navlinks {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    list-style-type: none;
    text-decoration: none;
    width: 100%;
  }
  .navitem {
    transition: text-decoration-color 300ms;
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
    text-decoration: underline 3px white;
  }
</style>
