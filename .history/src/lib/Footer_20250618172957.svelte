<script lang="ts">
  interface FooterItem {
    label: string;
    action: () => void;
  }

  interface FooterGroup {
    title: string;
    items: FooterItem[];
  }

  export let footerGroups: FooterGroup[] = [];

  export let socialIcons: { icon: string; action: () => void }[] = [];
</script>

<footer class="footer">
  <div class="footer-content">
    <div class="footer-group">
      <h4>Connect With Us</h4>
      <div class="social-icons">
        {#each socialIcons as social}
          <span
            role="button"
            class="material-symbols-outlined"
            onclick={social.action}
            tabindex="0"
          >
            {social.icon}
          </span>
        {/each}
      </div>
    </div>

    {#each footerGroups as group}
      <div class="footer-group">
        <h4>{group.title}</h4>
        <ul>
          {#each group.items as item}
            <li role="button" onclick={item.action} tabindex="0">
              {item.label}
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <div class="footer-bottom">
    <span>copyright@hariraghavan</span>
    <span role="button" tabindex="0">TermsOfUse</span>
    <span role="button" tabindex="0">FAQ</span>
    <span role="button" tabindex="0">Security Policy</span>
  </div>
</footer>

<style>
  .footer {
    background-color: #008cac;
    color: white;
    font-size: 14px;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
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
    cursor: pointer;
    margin: 6px 0;
  }

  .footer-group li:hover {
    text-decoration: underline;
  }

  .social-icons {
    display: flex;
    gap: 10px;
    margin-top: 8px;
  }

  .social-icons span {
    cursor: pointer;
  }

  .footer-bottom {
    background-color: #00a5cf;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 24px;
    font-size: 13px;
  }

  .footer-bottom span {
    cursor: pointer;
  }
</style>
