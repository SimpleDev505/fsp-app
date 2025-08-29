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
</script>

<div class="nav-cnt {nav_sticky ? 'nav-sticky' : 'nav-nonsticky'}">
  <ul class="navlinks">
    <li class="navitem">Home</li>
    <li class="navitem">Contact</li>
    <li class="navitem">About</li>
    <li class="navitem">SignUp/Login</li>
  </ul>
</div>

<style>
  .nav-cnt {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    width: 100%;
    height: 3em;
    color: white;
  }
  .nav-sticky {
    position: sticky;
  }
  .nav-nonsticky {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
