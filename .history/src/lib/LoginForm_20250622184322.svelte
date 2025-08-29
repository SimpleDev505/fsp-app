<script lang="ts">
  import Nav from "./Nav.svelte";
  import { LoginStage, LoginType, ResetEmail } from "./Store/login";
  let emailOrPhone = "";
  let password = "";
  let confirmPassword = "";

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
            on:change={() => LoginType.set({ user_type: "CUSTOMER" })}
          />
          Customer
        </label>
        <label>
          <input
            type="checkbox"
            checked={$LoginType?.user_type === "STAFF"}
            on:change={() => LoginType.set({ user_type: "STAFF" })}
          />
          Staff
        </label>
        <label>
          <input
            type="checkbox"
            checked={$LoginType?.user_type === "ADMIN"}
            on:change={() => LoginType.set({ user_type: "ADMIN" })}
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
            <a on:click={() => LoginStage.set("FORGOT_PASSWORD")}
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
        <button class="login-btn" on:click={handleLogin}>Login</button>
      {:else if $LoginStage === "FORGOT_PASSWORD"}
        <input
          class="login-input"
          placeholder="Enter your email"
          bind:value={emailOrPhone}
        />
        <button class="login-btn" on:click={requestPasswordReset}
          >Send Reset Code</button
        >
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
        <button class="login-btn" on:click={resetPassword}
          >Update Password</button
        >
      {/if}
    </div>
  </div>
</div>

<style>
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
