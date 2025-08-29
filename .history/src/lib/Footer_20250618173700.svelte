<script lang="ts">
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
  }

  const footerGroups: FooterGroup[] = [
    {
      title: "Menu",
      items: [
        { label: "Home", action: () => goTo("Home") },
        { label: "About", action: () => goTo("About") },
        { label: "Contact", action: () => goTo("Contact") },
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
    { icon: "close", action: () => goTo("X") },
    { icon: "instagram", action: () => goTo("Instagram") },
    { icon: "youtube", action: () => goTo("YouTube") },
    { icon: "linkedin", action: () => goTo("LinkedIn") },
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
            class="material-symbols-outlined icon-btn"
            on:click={social.action}
            aria-label={social.icon}
          >
            {social.icon}
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
    background-color: #008cac;
    color: white;
    font-size: 14px;
    width: 100%;
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

  .icon-btn {
    border: none;
    background: transparent;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }

  .footer-bottom {
    background-color: #00a5cf;
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
