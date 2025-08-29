<script lang="ts">
  import { saveContact } from "./Store/store";

  let name = $state("");
  let email = $state("");
  let phone = $state("");
  let howFound = $state("");

  function handleSubmit() {
    const formData = { name, email, phone, howFound };
    saveContact(formData);
  }
</script>

<div class="container">
  <div class="form-section">
    <h2>Contact Us</h2>
    <input type="text" bind:value={name} placeholder="Name *" />
    <input type="email" bind:value={email} placeholder="Email" />
    <input type="tel" bind:value={phone} placeholder="Phone number *" />
    <select bind:value={howFound}>
      <option disabled selected value="">How did you find us?</option>
      <option value="Google">Google</option>
      <option value="Friend">Friend</option>
      <option value="Advertisement">Advertisement</option>
    </select>
    <button on:click={handleSubmit}>SEND</button>

    <div class="contact-info">
      <div>
        📞 <strong>Phone</strong><br />
        1234567890
      </div>
      <div>
        📧 <strong>Email</strong><br />
        company@gmail.com
      </div>
    </div>
  </div>

  <div class="map-section">
    <div class="map-placeholder">[Map Image Placeholder]</div>
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
    max-width: 900px;
    margin: auto;
    gap: 2rem;
  }

  .form-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  h2 {
    color: #00a9ce;
  }

  input,
  select {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    background-color: #00a9ce;
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
    background-color: #08313f;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .map-placeholder {
    width: 220px;
    height: 220px;
    background-color: #eee;
    border: 2px solid #ccc;
    border-radius: 8px;
    text-align: center;
    line-height: 220px;
    color: #666;
    font-size: 14px;
  }
</style>
