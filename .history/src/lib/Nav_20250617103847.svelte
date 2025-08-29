<script lang="ts">
  let nav_sticky = $state(false);
  function handlenavscroll(e: Event) {
    if (scrollY > 150) {
      nav_sticky = true;
    } else {
      nav_sticky = false;
    }
  }
  window.addEventListener("scroll", handlenavscroll);

  function navClicked() {}
</script>

<div class="nav-cnt {nav_sticky ? 'nav-sticky' : 'nav-nonsticky'}">
  <ul class="navlinks">
    <li class="navitem"><button> Home </button></li>
    <li class="navitem">
      <button> Contact </button>
    </li>
    <li class="navitem">
      <button> About </button>
    </li>
    <li class="navitem">
      <button> SignUp /Login </button>
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
    cursor: pointer;
    width: 100%;
  }
  .navitem button {
    background: transparent;
    box-shadow: none;
    color: white;
    font-weight: medium;
  }
</style>
