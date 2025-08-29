<script lang="ts">
  let nav_sticky = $state(false);
  let navitem: HTMLElement = $state();
  function handlenavscroll(e: Event) {
    if (scrollY > 150) {
      nav_sticky = true;
    } else {
      nav_sticky = false;
    }
  }
  window.addEventListener("scroll", handlenavscroll);

  function navClicked(e: MouseEvent) {
    navitem.className = "";
    navitem = e.currentTarget as HTMLElement;
    if (navitem) {
      switch (navitem.className) {
        case "home-link":
          navitem.classList += ".nav-selected";
          break;
        case "about-link":
          navitem.classList += ".nav-selected";
          break;
        case "contact-link":
          navitem.classList += ".nav-selected";
          break;
        case "signup_login-link":
          navitem.classList += ".nav-selected";
          break;
      }
    }
  }
</script>

<div class="nav-cnt {nav_sticky ? 'nav-sticky' : 'nav-nonsticky'}">
  <ul class="navlinks">
    <li class="navitem">
      <button class="home-link" onclick={navClicked}> Home </button>
    </li>
    <li class="navitem">
      <button class="contact-link" onclick={navClicked}> Contact </button>
    </li>
    <li class="navitem">
      <button class="about-link" onclick={navClicked}> About </button>
    </li>
    <li class="navitem">
      <button class="signup_login-link" onclick={navClicked}>
        SignUp /Login
      </button>
    </li>
  </ul>
</div>

<style>
  .nav-cnt {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 3em;
    color: white;
    z-index: 1000;
  }
  .nav-sticky {
    position: sticky;
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
  .navitem button {
    background: transparent;
    box-shadow: none;
    color: white;
    font-weight: 300;
    border: none;
    cursor: pointer;
    padding: 4px;
  }
  .nav-selected {
    outline: white;
    border-radius: 10px;
  }
</style>
