<script lang="ts">
  import Dropdownmenu from "./dropdownmenu.svelte";
  import { contactEntries, type MenuItem } from "./Store/store";

  let name = $state("");
  let email = $state("");
  let phone = $state("");
  let howFound = $state("");

  function handleSubmit() {
    contactEntries.update((c) => ({
      name: name,
      email: email,
      phone: phone,
      howFound: "Google",
    }));
    console.log("Contact -> ", $contactEntries);
  }
  const contactus_menu: MenuItem[] = [
    {
      label: "Google",
      action: () => {
        contactEntries.update((c) => ({
          ...c,
          howFound: "Google",
        }));
      },
      split: false,
    },
    {
      label: "Youtube",
      action: () => {
        contactEntries.update((c) => ({
          ...c,
          howFound: "Youtube",
        }));
      },
      split: false,
    },
    {
      label: "Ads",
      action: () => {
        contactEntries.update((c) => ({
          ...c,
          howFound: "Ads",
        }));
      },
      split: false,
    },
  ];
</script>

<div class="container">
  <div class="form-section">
    <h2>Contact Us</h2>
    <input type="text" bind:value={name} placeholder="Name *" />
    <input type="email" bind:value={email} placeholder="Email *" />
    <input type="tel" bind:value={phone} placeholder="Phone number" />
    <Dropdownmenu leftpx={0} rightpx={0} items={contactus_menu}></Dropdownmenu>
    <button onclick={handleSubmit}>SEND</button>
    <div class="contact-info">
      <div>
        <strong>Phone</strong>
        1234567890
      </div>
      <div>
        <strong>Email</strong>
        company@gmail.com
      </div>
    </div>
  </div>

  <div class="map-section">
    <img src="src/assets/img/contact/contact.jpg" alt="contact" />
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: auto;
    gap: 2rem;
    margin-top: 100px;
  }

  .form-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  h2 {
    color: var(--blue);
  }

  input {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    background-color: var(--blue);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  .contact-info {
    margin-top: 20px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    max-width: 300px;
  }

  .map-section {
    width: 300px;
    height: 300px;
    background-color: var(--blue-dark);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .map-section img {
    object-fit: cover;
  }
</style>
