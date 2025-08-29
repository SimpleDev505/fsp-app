<script lang="ts">
  import { onMount } from "svelte";
  import Nav from "./Nav.svelte";
  import { LoginStage, LoginType, ResetEmail } from "./Store/login";
  let emailOrPhone = "";
  let password = "";
  let confirmPassword = "";
  onMount(() => {
    if (!$LoginType) {
      LoginType.set({ user_type: "CUSTOMER" });
    }
  });
  function handleUserTypeSelect(type: "CUSTOMER" | "STAFF" | "ADMIN") {
    LoginType.set({ user_type: type });
  }

  function handleLogin() {
    // POST /api/login with {emailOrPhone/id, password, LoginType}
  }

  function requestPasswordReset() {
    // POST /api/forgot-password with {email}
    ResetEmail.set(emailOrPhone);
    LoginStage.set("RESET_PASSWORD");
  }

  function resetPassword() {
    // POST /api/reset-password with {email, newPassword}
    // then set stage back to "LOGIN"
    LoginStage.set("LOGIN");
  }
</script>

<div class="home-cnt">
  <Nav LoggedInVisible={false}></Nav>
  <div class="home-header">
    <div class="home-img-cnt">
      <div class="home-img-filter"></div>
      <img class="home-img" src="src/assets/img/home.png" alt="" />
    </div>
    <div class="home-title">
      <span class="home-title-1">Your Journey Begins Here</span>
    </div>
    <div class="login-container">
      <h1>AIRLINE COMPANY</h1>
      <h2>LOGIN</h2>

      <!-- Role Selection -->
      <div class="role-selection">
        <label>
          <input
            type="checkbox"
            checked={$LoginType?.user_type === "CUSTOMER"}
            onchange={() => LoginType.set({ user_type: "CUSTOMER" })}
          />
          Customer
        </label>
        <label>
          <input
            type="checkbox"
            checked={$LoginType?.user_type === "STAFF"}
            onchange={() => LoginType.set({ user_type: "STAFF" })}
          />
          Staff
        </label>
        <label>
          <input
            type="checkbox"
            checked={$LoginType?.user_type === "ADMIN"}
            onchange={() => LoginType.set({ user_type: "ADMIN" })}
          />
          Admin
        </label>
      </div>

      <!-- LOGIN STAGE HANDLING -->
      {#if $LoginStage === "LOGIN"}
        {#if $LoginType?.user_type === "CUSTOMER"}
          <input
            class="login-input"
            placeholder="Email or Phone"
            bind:value={emailOrPhone}
          />
          <input
            class="login-input"
            type="password"
            placeholder="Password"
            bind:value={password}
          />
          <div class="login-actions">
            <a onclick={() => LoginStage.set("FORGOT_PASSWORD")}
              >forgot password?</a
            >
          </div>
        {:else if $LoginType?.user_type === "STAFF" || $LoginType?.user_type === "ADMIN"}
          <input
            class="login-input"
            placeholder="Staff/Admin ID"
            bind:value={emailOrPhone}
          />
          <input
            class="login-input"
            type="password"
            placeholder="Password"
            bind:value={password}
          />
          <div class="info-note">
            Forgot password? Contact supervisor at <a
              href="mailto:admin@company.com">admin@company.com</a
            >.
          </div>
        {/if}
        <button class="login-btn" onclick={handleLogin}>Login</button>
      {:else if $LoginStage === "FORGOT_PASSWORD"}
        <input
          class="login-input"
          placeholder="Enter your email"
          bind:value={emailOrPhone}
        />
        <div
          style="display: flex; justify-content: flex-start; align-items: center;"
        >
          <button class="login-btn" onclick={requestPasswordReset}
            >Send Reset Code</button
          >
          <button
            class="login-btn back-btn"
            onclick={() => LoginStage.set("LOGIN")}
          >
            Back to Login
          </button>
        </div>
      {:else if $LoginStage === "RESET_PASSWORD"}
        <input
          class="login-input"
          placeholder="New Password"
          bind:value={password}
        />
        <input
          class="login-input"
          placeholder="Confirm Password"
          bind:value={confirmPassword}
        />
        <button class="login-btn" onclick={resetPassword}
          >Update Password</button
        >
        <button
          class="login-btn back-btn"
          onclick={() => LoginStage.set("LOGIN")}
        >
          Back to Login
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .login-container {
    position: absolute;
    bottom: 0;
    max-width: 400px;
    margin: 4rem auto;
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    font-family: "Segoe UI", sans-serif;
    text-align: center;
  }

  .login-container h1 {
    color: var(--blue);
    margin-bottom: 0.25rem;
  }

  .login-container h2 {
    color: var(--blue);
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .role-selection {
    display: flex;
    justify-content: center;
    gap: 1.2rem;
    margin-bottom: 1rem;
  }

  .role-selection label {
    font-size: 0.9rem;
    color: var(--grey-dark);
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .login-input {
    width: 100%;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 0.95rem;
  }

  .login-actions {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    margin: 0.5rem 0 1rem;
  }

  .login-actions a {
    color: var(--blue);
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
  }

  .login-actions a:hover {
    text-decoration: underline;
  }

  .login-btn {
    background: var(--blue);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s ease-in;
  }

  .login-btn:hover {
    background: var(--blue-dark);
  }

  .info-note {
    font-size: 0.8rem;
    color: var(--grey-dark);
    margin-top: 1rem;
  }

  .info-note a {
    color: var(--blue);
    text-decoration: underline;
  }
  .role-selection input[type="checkbox"] {
    accent-color: var(--blue);
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .role-selection label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
  }
  .home-title {
    grid-column: 1;
    grid-row: 2;
    z-index: 2;
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 200px;
    left: 0;
    pointer-events: none;
  }
  .home-title-1 {
    font-size: 60px;
    margin-bottom: 150px;
    color: white;
    font-weight: bolder;
    -webkit-text-stroke: 5px rgba(255, 255, 255, 0.8);
    letter-spacing: 2px;
  }
  .home-cnt {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .home-header {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .home-img-cnt {
    width: 100%;
    height: 545px;
    position: relative;
    overflow-y: hidden;
  }
  .home-img-filter {
    background: var(--blue);
    filter: opacity(25%);
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .home-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
</style>
