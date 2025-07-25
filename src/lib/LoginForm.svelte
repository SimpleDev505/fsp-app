<script lang="ts">
  import { onMount } from "svelte";
  import Nav from "./Nav.svelte";
  import { gsap } from "gsap";

  import {
    LoginData,
    LoginStage,
    LoginType,
    OTPCode,
    ResetCode,
    ResetEmail,
    UserLogged,
  } from "./Store/login";
  import { CurrentAppPage } from "./Store/store";
  import Notifier, { type StatusMessage } from "./Notifier.svelte";

  let login_err: StatusMessage = $state({ message: null, type: "ERROR" });
  let emailOrPhone = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let verificationCode = $state("");
  //Register
  let username = $state("");
  let phone = $state("");
  let email = $state("");
  //Reset Status
  let ResetStatus = $state(false);
  let login_cnt: HTMLElement;
  let ResetMessage = $state(
    "Successfully Password Updated! You can now login."
  );
  let currentItemCount = $state(0);
  onMount(() => {
    if (!$LoginType) {
      LoginType.set({ user_type: "CUSTOMER" });
    }
  });
  $effect(() => {
    if (login_err.message !== null)
      gsap.fromTo(
        login_cnt,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "back.inOut" }
      );
    gsap.fromTo(
      login_cnt.children,
      { opacity: 0, y: 10, stagger: 0.1 },
      { opacity: 1, y: 0, duration: 0.5, ease: "back.inOut", delay: 0.2 }
    );
  });

  // function handleUserTypeSelect(type: "CUSTOMER" | "STAFF" | "ADMIN") {
  //   LoginType.set({ user_type: type });
  // }

  async function handleLogin() {
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: emailOrPhone,
          password,
          user_type: $LoginType?.user_type,
        }),
      });

      const data = await res.json();
      const p_data = data.user as LoginData;
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (p_data.banned) {
        login_err = {
          message: "Contact Admin For Further Procedings! Login terminated",
          type: "ERROR",
        };
        setTimeout(() => {
          login_err = { message: null, type: "ERROR" };
        }, 4500);
        return;
      }
      LoginData.set(data.user as LoginData);
      console.log("Login Success", $LoginData);
      ResetEmail.set("");
      OTPCode.set("");
      ResetCode.set("");
      emailOrPhone = "";
      password = "";
      confirmPassword = "";
      verificationCode = "";
      username = "";
      phone = "";
      email = "";
      login_err = { message: "Login Success!", type: "SUCCESS" };
      setTimeout(() => {
        login_err = { message: null, type: "ERROR" };
        UserLogged.set(true);
        switch ($LoginData?.user_type) {
          case "CUSTOMER":
            CurrentAppPage.set("HOME");
            break;
          case "STAFF":
            CurrentAppPage.set("STAFF DASHBOARD");
            break;
          case "ADMIN":
            CurrentAppPage.set("STAFF DASHBOARD");
            break;
        }
      }, 4500);
      //localStorage.setItem("token", data.token)
    } catch (err: any) {
      console.error("Login Error:", err.message);
      alert(err.message);
      login_err = { message: "Login Error", type: "ERROR" };
      setTimeout(() => {
        login_err = { message: null, type: "ERROR" };
      }, 4500);
    }
  }
  async function requestPasswordReset() {
    try {
      const res = await fetch("http://localhost:8080/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrPhone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset code");

      ResetEmail.set(emailOrPhone);
      LoginStage.set("VERIFY_CODE");
      alert(`Verification code sent to ${$ResetEmail}` + data.code);
    } catch (err: any) {
      console.error("Forgot Password Error:", err.message);
      alert(err.message);
    }
  }
  async function resetPassword() {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: $ResetEmail, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset password failed");

      alert("Password updated successfully");
      LoginStage.set("LOGIN");
      ResetMessage = "Successfully Password Updated!, You can now login.";
      ResetStatus = true;
      setTimeout(() => {
        ResetStatus = false;
      }, 2500);
    } catch (err: any) {
      console.error("Reset Password Error:", err.message);
      alert(err.message);
    }
  }
  async function verifyCode() {
    try {
      const res = await fetch("http://localhost:8080/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: $ResetEmail, code: verificationCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Code verification failed");

      alert("Code verified successfully!");
      LoginStage.set("RESET_PASSWORD");
    } catch (err: any) {
      console.error("Verify Code Error:", err.message);
      alert(err.message);
    }
  }
  async function registerAccount() {
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email: emailOrPhone,
          phone,
          password,
          photo: "",
          user_type: $LoginType?.user_type,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // alert("Registration successful!");
      LoginStage.set("LOGIN");
      ResetMessage = "Successfully Register As New User.Now Login!";
      ResetStatus = true;
      setTimeout(() => {
        ResetStatus = false;
      }, 2500);
    } catch (err: any) {
      alert(err.message);
    }
  }
  $effect(() => {
    if ($LoginType) {
      gsap.fromTo(
        ".role-selection > label:has(input[type='checkbox']:not(:checked))",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          stagger: 0.25,
          duration: 0.25,
          ease: "circ.inOut",
        }
      );
      gsap.fromTo(
        ".login-input",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          stagger: 0.2,
          duration: 0.4,
          ease: "circ.inOut",
        }
      );
    }
  });
</script>

<div class="home-cnt">
  <Nav LoggedInVisible={false}></Nav>
  <div class="home-header">
    <div class="home-img-cnt">
      <div class="home-img-filter"></div>
      <img class="home-img" src="src/assets/img/home.webp" alt="hrairline" />
    </div>
    <div class="home-title">
      <span class="home-title-1">Your Journey Begins Here</span>
    </div>
    <div class="login-container" bind:this={login_cnt}>
      <h1>AIRLINE COMPANY</h1>
      <h2>LOGIN</h2>
      <!-- Role Selection -->
      {#if !login_err.message}
        <div class="role-selection">
          <label>
            <input
              type="checkbox"
              checked={$LoginType?.user_type === "CUSTOMER"}
              onchange={() => LoginType.set({ user_type: "CUSTOMER" })}
            />
            <span class="material-symbols-outlined"> travel </span>
            Customer
          </label>
          <label>
            <input
              type="checkbox"
              checked={$LoginType?.user_type === "STAFF"}
              onchange={() => LoginType.set({ user_type: "STAFF" })}
            />
            <span class="material-symbols-outlined"> badge </span>
            Staff
          </label>
          <label>
            <input
              type="checkbox"
              checked={$LoginType?.user_type === "ADMIN"}
              onchange={() => LoginType.set({ user_type: "ADMIN" })}
            />
            <span class="material-symbols-outlined">
              admin_panel_settings
            </span>
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
            {#if ResetStatus}
              <span class="login-actions"
                ><a
                  style="color: var(--blue-dark); font-weight: bolder;"
                  href="#">{ResetMessage}</a
                ></span
              >
            {/if}
            <span
              style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center;"
            >
              <div class="login-actions">
                <a onclick={() => LoginStage.set("FORGOT_PASSWORD")}
                  >forgot password?</a
                >
              </div>
              <div class="login-actions">
                <a onclick={() => LoginStage.set("REGISTER USER")}
                  >Don't have an account? Create one</a
                >
              </div>
            </span>
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
          <button class="login-btn" onclick={handleLogin}>
            <span class="material-symbols-outlined"> login </span>
            Login
          </button>
        {:else if $LoginStage === "FORGOT_PASSWORD"}
          <input
            class="login-input"
            placeholder="Enter your email"
            bind:value={emailOrPhone}
          />
          <div
            style="display: flex; justify-content: flex-start; align-items: center; column-gap: 12px;"
          >
            <button class="login-btn" onclick={requestPasswordReset}>
              <span class="material-symbols-outlined"> send </span>
              Send Reset Code
            </button>
            <div class="login-actions">
              <a onclick={() => LoginStage.set("LOGIN")}> Back to Login? </a>
            </div>
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
        {:else if $LoginStage === "VERIFY_CODE"}
          <input
            class="login-input"
            placeholder="Enter Verification Code"
            bind:value={verificationCode}
          />
          <button class="login-btn" onclick={verifyCode}>Verify Code</button>
          <button
            class="login-btn back-btn"
            onclick={() => LoginStage.set("LOGIN")}
          >
            Back to Login
          </button>
        {:else if $LoginStage === "REGISTER USER"}
          {#if !($LoginType?.user_type === "STAFF" || $LoginType?.user_type === "ADMIN")}
            <input
              placeholder="Username"
              bind:value={username}
              class="login-input"
            />
            <input
              placeholder="Email"
              type="email"
              bind:value={email}
              class="login-input"
            />
            <input
              placeholder="Phone"
              type="tel"
              bind:value={phone}
              class="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              bind:value={password}
              class="login-input"
            />
            <button class="login-btn" onclick={registerAccount}
              >Create Account</button
            >
            <button
              class="login-btn back-btn"
              onclick={() => LoginStage.set("LOGIN")}>Back to Login</button
            >
          {:else}
            <div class="info-note">
              Customer Can Only Be Added As New User.Contact supervisor for
              further issues!<a href="mailto:admin@company.com"
                >admin@company.com</a
              >.
            </div>
          {/if}
        {/if}
      {/if}
      {#if login_err.message}
        <Notifier P_error={login_err.message} Type={login_err.type}></Notifier>
      {/if}
    </div>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: -50px;
    max-width: 400px;
    margin: 4rem auto;
    background: white;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 1em;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    font-family: "Segoe UI", sans-serif;
    text-align: center;
    transition: 0.2s ease-in-out;
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
  .login-input:focus {
    border: 3px solid var(--blue-dark);
    outline: none;
  }

  .login-actions {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    margin: 0.1rem 0.1rem;
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
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
    background: var(--blue);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s ease-in;
    outline: 2px solid var(--grey-light);
    margin-top: 10px;
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
    bottom: 400px;
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
