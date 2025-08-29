<script lang="ts">
  import { UserLogged } from "./Store/login";
  import {
    Current_SearchFilter,
    CurrentAppPage,
    CurrentNav,
    ExtraFiltered_Results,
    FlightSearchResults,
    Links_Social,
    Searched,
  } from "./Store/store";

  interface FooterItem {
    label: string;
    action: () => void;
  }

  interface FooterGroup {
    title: string;
    items: FooterItem[];
  }

  // Simulate navigation actions
  function goTo(label: string) {
    console.log(`Navigating to: ${label}`);
    window.open(label, "_blank");
  }

  const footerGroups: FooterGroup[] = [
    {
      title: "Menu",
      items: [
        {
          label: "Home",
          action: () => {
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
            if (
              !(
                $CurrentAppPage === "STAFF DASHBOARD" ||
                $CurrentAppPage === "ADMIN DASHBOARD"
              )
            ) {
              if ($UserLogged) {
                $CurrentAppPage = "HOME";
              } else {
                $CurrentAppPage = "LOGIN";
              }
            }
            $CurrentNav = "home-link";
          },
        },
        {
          label: "About",
          action: () => {
            $CurrentAppPage = "ABOUT";
            $CurrentNav = "about-link";
          },
        },
        {
          label: "Contact",
          action: () => {
            $CurrentNav = "contact-link";
            scrollToContact();
            navitem.classList.remove("nav-selected");
            const home = document.getElementById("home-link") as HTMLElement;
            navitem = home;
            navitem.className += " nav-selected";
          },
        },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "Support", action: () => goTo("Support") },
        { label: "Partners", action: () => goTo("Partners") },
        { label: "Jobs", action: () => goTo("Jobs") },
      ],
    },
    {
      title: "Services",
      items: [
        { label: "Convenience Options", action: () => goTo("Convenience") },
        { label: "Passes", action: () => goTo("Passes") },
        { label: "Account", action: () => goTo("Account") },
        { label: "Help", action: () => goTo("Help") },
      ],
    },
  ];

  const socialIcons = [
    {
      icon: "src/assets/img/footer/twitter.png",
      action: () => goTo(Links_Social.X),
    },
    {
      icon: "src/assets/img/footer/insta.png",
      action: () => goTo(Links_Social.Insta),
    },
    {
      icon: "src/assets/img/footer/youtube.png",
      action: () => goTo(Links_Social.Youtube),
    },
    {
      icon: "src/assets/img/footer/linkedin.png",
      action: () => goTo(Links_Social.LinkedIn),
    },
  ];

  const bottomLinks = ["TermsOfUse", "FAQ", "Security Policy"];
</script>

<footer class="footer">
  <div class="footer-content">
    <div class="footer-group">
      <h4>Connect With Us</h4>
      <div class="social-icons">
        {#each socialIcons as social}
          <button
            class="icon-btn"
            on:click={social.action}
            aria-label="social-icon"
          >
            <img src={social.icon} alt="social icon" />
          </button>
        {/each}
      </div>
    </div>

    {#each footerGroups as group}
      <div class="footer-group">
        <h4>{group.title}</h4>
        <ul>
          {#each group.items as item}
            <li>
              <button on:click={item.action}>{item.label}</button>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <div class="footer-bottom">
    <span>copyright@hariraghavan</span>
    {#each bottomLinks as link}
      <button on:click={() => goTo(link)}>{link}</button>
    {/each}
  </div>
</footer>

<style>
  .footer {
    background-color: var(--blue);
    color: white;
    font-size: 14px;
    width: 100%;
    margin-top: 100px;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 24px;
    padding: 24px;
  }

  .footer-group h4 {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .footer-group ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-group li {
    margin: 6px 0;
  }

  .footer-group li button {
    background: none;
    border: none;
    color: white;
    font: inherit;
    cursor: pointer;
    padding: 0;
  }

  .footer-group li button:hover {
    text-decoration: underline;
  }

  .social-icons {
    display: flex;
    gap: 10px;
    margin-top: 8px;
    flex-wrap: wrap;
  }
  .icon-btn img {
    width: 16px;
    height: 16px;
    object-fit: contain;
    filter: invert();
  }

  .icon-btn {
    border: none;
    background: transparent;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }

  .footer-bottom {
    background-color: var(--blue);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 10px 24px;
    font-size: 13px;
  }

  .footer-bottom button {
    background: none;
    border: none;
    color: white;
    font: inherit;
    cursor: pointer;
    margin-left: 12px;
  }

  .footer-bottom button:hover {
    text-decoration: underline;
  }
</style>
