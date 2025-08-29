<script lang="ts">
  import { get, writable } from "svelte/store";
  import Dropdownmenu from "./dropdownmenu.svelte";
  import DateDropDown from "./DateDropDown.svelte";
  import { LoginData } from "./Store/login";
  import type { MenuItem } from "./Store/store";

  interface ProfileSave {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    nationality: string;
    maritalStatus: string;
    anniversary: string;
    cityOfResidence: string;
    state: string;
    email: string;
    phone: string;
    photo: string;
    passportNo: string;
    expiryDate: string;
    issuingCountry: string;
    panCardNumber: string;
    resetCode: string;
  }

  // Reactive state using Svelte 5 runes
  let userProfile = $state<LoginData>({
    username: "",
    id: "",
    email: "hariraghavan2005@gmail.com",
    phone: "+91-9840847640",
    photo: "",
    user_type: "CUSTOMER",
    login_time: "",
    banned: false,
    ban_time: undefined,
  });

  // Profile save writable store
  const profile_save = writable<ProfileSave>({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    maritalStatus: "",
    anniversary: "",
    cityOfResidence: "",
    state: "",
    email: "hariraghavan2005@gmail.com",
    phone: "+91-9840847640",
    photo: "",
    passportNo: "",
    expiryDate: "",
    issuingCountry: "",
    panCardNumber: "",
    resetCode: "",
  });

  let currentProfile = $state<ProfileSave>({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    maritalStatus: "",
    anniversary: "",
    cityOfResidence: "",
    state: "",
    email: "hariraghavan2005@gmail.com",
    phone: "+91-9840847640",
    photo: "",
    passportNo: "",
    expiryDate: "",
    issuingCountry: "",
    panCardNumber: "",
    resetCode: "",
  });

  let login_detail = $derived(get(LoginData));
  let showResetPassword = $state(false);
  let fileInput: HTMLInputElement | null = $state(null);
  let activeSection = $state("account");

  // Dropdown menu items
  const gender_items: MenuItem[] = [
    {
      label: "Male",
      action: () => {
        currentProfile.gender = "Male";
      },
      split: false,
    },
    {
      label: "Female",
      action: () => {
        currentProfile.gender = "Female";
      },
      split: false,
    },
    {
      label: "Other",
      action: () => {
        currentProfile.gender = "Other";
      },
      split: false,
    },
  ];

  const nationality_items: MenuItem[] = [
    {
      label: "Indian",
      action: () => {
        currentProfile.nationality = "Indian";
      },
      split: false,
    },
    {
      label: "American",
      action: () => {
        currentProfile.nationality = "American";
      },
      split: false,
    },
    {
      label: "British",
      action: () => {
        currentProfile.nationality = "British";
      },
      split: false,
    },
    {
      label: "Canadian",
      action: () => {
        currentProfile.nationality = "Canadian";
      },
      split: false,
    },
    {
      label: "Australian",
      action: () => {
        currentProfile.nationality = "Australian";
      },
      split: false,
    },
  ];

  const marital_status_items: MenuItem[] = [
    {
      label: "Single",
      action: () => {
        currentProfile.maritalStatus = "Single";
      },
      split: false,
    },
    {
      label: "Married",
      action: () => {
        currentProfile.maritalStatus = "Married";
      },
      split: false,
    },
    {
      label: "Divorced",
      action: () => {
        currentProfile.maritalStatus = "Divorced";
      },
      split: false,
    },
    {
      label: "Widowed",
      action: () => {
        currentProfile.maritalStatus = "Widowed";
      },
      split: false,
    },
  ];

  const city_items: MenuItem[] = [
    {
      label: "Chennai",
      action: () => {
        currentProfile.cityOfResidence = "Chennai";
      },
      split: false,
    },
    {
      label: "Mumbai",
      action: () => {
        currentProfile.cityOfResidence = "Mumbai";
      },
      split: false,
    },
    {
      label: "Delhi",
      action: () => {
        currentProfile.cityOfResidence = "Delhi";
      },
      split: false,
    },
    {
      label: "Bangalore",
      action: () => {
        currentProfile.cityOfResidence = "Bangalore";
      },
      split: false,
    },
    {
      label: "Hyderabad",
      action: () => {
        currentProfile.cityOfResidence = "Hyderabad";
      },
      split: false,
    },
    {
      label: "Kolkata",
      action: () => {
        currentProfile.cityOfResidence = "Kolkata";
      },
      split: false,
    },
  ];

  const state_items: MenuItem[] = [
    {
      label: "Tamil Nadu",
      action: () => {
        currentProfile.state = "Tamil Nadu";
      },
      split: false,
    },
    {
      label: "Maharashtra",
      action: () => {
        currentProfile.state = "Maharashtra";
      },
      split: false,
    },
    {
      label: "Delhi",
      action: () => {
        currentProfile.state = "Delhi";
      },
      split: false,
    },
    {
      label: "Karnataka",
      action: () => {
        currentProfile.state = "Karnataka";
      },
      split: false,
    },
    {
      label: "Telangana",
      action: () => {
        currentProfile.state = "Telangana";
      },
      split: false,
    },
    {
      label: "West Bengal",
      action: () => {
        currentProfile.state = "West Bengal";
      },
      split: false,
    },
  ];

  const country_items: MenuItem[] = [
    {
      label: "India",
      action: () => {
        currentProfile.issuingCountry = "India";
      },
      split: false,
    },
    {
      label: "United States",
      action: () => {
        currentProfile.issuingCountry = "United States";
      },
      split: false,
    },
    {
      label: "United Kingdom",
      action: () => {
        currentProfile.issuingCountry = "United Kingdom";
      },
      split: false,
    },
    {
      label: "Canada",
      action: () => {
        currentProfile.issuingCountry = "Canada";
      },
      split: false,
    },
    {
      label: "Australia",
      action: () => {
        currentProfile.issuingCountry = "Australia";
      },
      split: false,
    },
  ];

  function handlePhotoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const base64String = e.target.result as string;
          userProfile.photo = base64String;
          currentProfile.photo = base64String;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function removePhoto() {
    userProfile.photo = "";
    currentProfile.photo = "";
    if (fileInput) {
      fileInput.value = "";
    }
  }

  function triggerPhotoUpload() {
    fileInput?.click();
  }

  function toggleResetPassword() {
    showResetPassword = !showResetPassword;
  }

  function handleSave() {
    // Update the profile save store with current values
    profile_save.set(currentProfile);
    console.log("Profile saved:", currentProfile);
  }

  function handleLogout() {
    // This will be handled by parent component
    console.log("Logout requested");
  }
</script>

<div class="profile-container">
  <!-- Left Sidebar -->
  <div class="sidebar">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-avatar">
        {#if userProfile.photo}
          <img src={userProfile.photo} alt="Profile" class="avatar-img" />
        {:else}
          <div class="avatar-placeholder"></div>
        {/if}
      </div>
      <div class="profile-info">
        <h2 class="profile-name">
          {login_detail?.username}
        </h2>
        <p class="join-date">{login_detail?.login_time?.split("T")[0]}</p>
        <div class="completion-bar">
          <div class="completion-text">20% Profile Completed</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 20%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="nav-menu">
      <button
        class="nav-item {activeSection === 'account' ? 'active' : ''}"
        onclick={() => (activeSection = "account")}
      >
        <span class="nav-icon"
          ><span class="material-symbols-outlined"> account_circle </span></span
        >
        <div class="nav-content">
          <div class="nav-title">Account Information</div>
          <div class="nav-subtitle">Manage your profile, bookings and more</div>
        </div>
      </button>

      <button
        class="nav-item {activeSection === 'bookings' ? 'active' : ''}"
        onclick={() => (activeSection = "bookings")}
      >
        <span class="nav-icon"
          ><span class="material-symbols-outlined">
            airplane_ticket
          </span></span
        >
        <div class="nav-content">
          <div class="nav-title">Your Bookings</div>
          <div class="nav-subtitle">
            Check your latest/cancelled/pending bookings
          </div>
        </div>
      </button>

      <!-- <button
        class="nav-item {activeSection === 'travellers' ? 'active' : ''}"
        onclick={() => (activeSection = "travellers")}
      >
        <span class="nav-icon">👥</span>
        <div class="nav-content">
          <div class="nav-title">Co-Travellers</div>
          <div class="nav-subtitle">
            Add or delete the respective traveler details
          </div>
        </div>
      </button> -->

      <!-- <button
        class="nav-item {activeSection === 'promo' ? 'active' : ''}"
        onclick={() => (activeSection = "promo")}
      >
        <span class="nav-icon">🎟️</span>
        <div class="nav-content">
          <div class="nav-title">Promo Codes</div>
          <div class="nav-subtitle">Refer a Friend and Earn</div>
        </div>
      </button> -->

      <!-- <button
        class="nav-item {activeSection === 'gift' ? 'active' : ''}"
        onclick={() => (activeSection = "gift")}
      >
        <span class="nav-icon">🎁</span>
        <div class="nav-content">
          <div class="nav-title">Gift Cards/ Coupons</div>
          <div class="nav-subtitle">Check savings on your booking</div>
        </div>
      </button> -->

      <button
        class="nav-item {activeSection === 'wallet' ? 'active' : ''}"
        onclick={() => (activeSection = "wallet")}
      >
        <span class="nav-icon"
          ><span class="material-symbols-outlined"> contact_page </span></span
        >
        <div class="nav-content">
          <div class="nav-title">Documents</div>
          <div class="nav-subtitle">Check & Manage your Documents</div>
        </div>
      </button>

      <button
        class="nav-item {activeSection === 'settings' ? 'active' : ''}"
        onclick={() => (activeSection = "settings")}
      >
        <span class="nav-icon"
          ><span class="material-symbols-outlined">
            manage_accounts
          </span></span
        >
        <div class="nav-content">
          <div class="nav-title">Settings</div>
          <div class="nav-subtitle">
            Manage Notification, Fare Alert and more
          </div>
        </div>
      </button>

      <button class="nav-item logout" onclick={handleLogout}>
        <span class="nav-icon"
          ><span class="material-symbols-outlined"> logout </span></span
        >
        <div class="nav-content">
          <div class="nav-title">Log Out</div>
        </div>
      </button>
    </nav>
  </div>

  <!-- Main Content -->
  <div class="main-content">
    {#if activeSection === "account"}
      <!-- Statistics Cards -->
      <div class="stats-cards">
        <div class="stat-card cities">
          <div class="stat-bg"></div>
          <div class="stat-content">
            <div class="stat-number">0</div>
            <div class="stat-labels">
              <div class="stat-label">Cities</div>
              <div class="stat-label">Visited</div>
            </div>
          </div>
        </div>

        <div class="stat-card countries">
          <div class="stat-bg"></div>
          <div class="stat-content">
            <div class="stat-number">0</div>
            <div class="stat-labels">
              <div class="stat-label">Countries</div>
              <div class="stat-label">Visited</div>
            </div>
          </div>
        </div>

        <div class="stat-card flights">
          <div class="stat-bg"></div>
          <div class="stat-content">
            <div class="stat-number">0</div>
            <div class="stat-labels">
              <div class="stat-label">Flight</div>
              <div class="stat-label">Bookings</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="form-container">
        <div class="form-header">
          <h1 class="form-title">General Details</h1>
          <button type="button" class="update-btn" onclick={handleSave}>
            Update
          </button>
        </div>

        <div class="form-content">
          <!-- Passenger Type Row -->
          <div class="form-row">
            <div class="form-group">
              <label>Passenger Type <span class="required">*</span></label>
              <div class="dropdown-wrapper">
                <Dropdownmenu leftpx={0} rightpx={0} items={gender_items}
                ></Dropdownmenu>
              </div>
            </div>
            <div class="form-group">
              <label for="firstName"
                >First Name <span class="required">*</span></label
              >
              <input
                type="text"
                id="firstName"
                value={login_detail?.username}
                placeholder="First Name"
                disabled
              />
            </div>
            <div class="form-group">
              <label for="lastName">Email</label>
              <input
                type="text"
                id="lastName"
                value={login_detail?.email}
                placeholder="Last Name"
                disabled
              />
            </div>
          </div>

          <!-- Date of Birth Row -->
          <div class="form-row">
            <div class="form-group">
              <label>Date of Birth <span class="required">*</span></label>
              <div class="date-wrapper">
                <DateDropDown pickupenddate={false}></DateDropDown>
              </div>
            </div>
            <div class="form-group empty"></div>
            <div class="form-group empty"></div>
          </div>

          <!-- Address Row -->
          <div class="form-row">
            <div class="form-group">
              <label for="address">Address</label>
              <input type="text" id="address" placeholder="Address" />
            </div>
            <div class="form-group">
              <label>City</label>
              <div class="dropdown-wrapper">
                <Dropdownmenu leftpx={0} rightpx={0} items={city_items}
                ></Dropdownmenu>
              </div>
            </div>
            <div class="form-group">
              <label>State</label>
              <div class="dropdown-wrapper">
                <Dropdownmenu leftpx={0} rightpx={0} items={state_items}
                ></Dropdownmenu>
              </div>
            </div>
          </div>

          <!-- PinCode Row -->
          <div class="form-row">
            <div class="form-group">
              <label for="pincode">PinCode</label>
              <input type="text" id="pincode" placeholder="Pincode" />
            </div>
            <div class="form-group empty"></div>
            <div class="form-group empty"></div>
          </div>
        </div>

        <!-- Hidden file input for photo upload -->
        <input
          bind:this={fileInput}
          type="file"
          accept="image/*"
          onchange={handlePhotoUpload}
          class="file-input"
        />

        {#if showResetPassword}
          <section class="reset-password-section">
            <h2 class="section-title">Reset Password</h2>
            <div class="form-group">
              <label for="resetCode">Enter Reset Code</label>
              <input
                type="text"
                id="resetCode"
                bind:value={currentProfile.resetCode}
                placeholder="Enter the reset code"
              />
            </div>
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
              />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
              />
            </div>
          </section>
        {/if}
      </div>
    {/if}

    {#if activeSection === "bookings"}
      <div class="content-placeholder">
        <h2>Your Bookings</h2>
        <p>Bookings content will be displayed here</p>
      </div>
    {/if}

    <!-- {#if activeSection === "travellers"}
      <div class="content-placeholder">
        <h2>Co-Travellers</h2>
        <p>Co-travellers content will be displayed here</p>
      </div>
    {/if} -->

    {#if activeSection === "promo"}
      <div class="content-placeholder">
        <h2>Promo Codes</h2>
        <p>Promo codes content will be displayed here</p>
      </div>
    {/if}

    {#if activeSection === "gift"}
      <div class="content-placeholder">
        <h2>Gift Cards/ Coupons</h2>
        <p>Gift cards content will be displayed here</p>
      </div>
    {/if}

    {#if activeSection === "wallet"}
      <div class="content-placeholder">
        <h2>EMT Wallet</h2>
        <p>Wallet content will be displayed here</p>
      </div>
    {/if}

    {#if activeSection === "settings"}
      <div class="content-placeholder">
        <h2>Settings</h2>
        <p>Settings content will be displayed here</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .profile-container {
    display: flex;
    min-height: 100vh;
    background-color: var(--grey-light);
  }

  /* Sidebar Styles */
  .sidebar {
    width: 300px;
    background: white;
    border-right: 1px solid var(--grey-light);
    display: flex;
    flex-direction: column;
  }

  .profile-header {
    padding: 20px;
    border-bottom: 1px solid var(--grey-light);
  }

  .profile-avatar {
    width: 60px;
    height: 60px;
    margin-bottom: 15px;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--grey-light);
  }

  .profile-name {
    font-size: var(--font-lg);
    font-weight: bold;
    margin: 0 0 5px 0;
    color: #333;
  }

  .join-date {
    font-size: var(--font-s);
    color: var(--grey-dark);
    margin: 0 0 15px 0;
  }

  .completion-text {
    font-size: var(--font-s);
    color: #333;
    margin-bottom: 8px;
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background-color: var(--grey-light);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: var(--blue);
    transition: width 0.3s ease;
  }

  /* Navigation Menu */
  .nav-menu {
    flex: 1;
    padding: 0;
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: flex-start;
    padding: 15px 20px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    border-bottom: 1px solid var(--grey-light);
    gap: 12px;
  }

  .nav-item:hover {
    background-color: #f8f9fa;
  }

  .nav-item.active {
    background-color: #e3f2fd;
    border-right: 3px solid var(--blue);
  }

  .nav-item.logout {
    margin-top: auto;
    border-top: 1px solid var(--grey-light);
    color: var(--red);
  }

  .nav-icon {
    font-size: var(--font-lg);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .nav-content {
    flex: 1;
  }

  .nav-title {
    font-size: var(--font-sm);
    font-weight: 600;
    color: #333;
    margin-bottom: 2px;
  }

  .nav-subtitle {
    font-size: var(--font-s);
    color: var(--grey-dark);
    line-height: 1.3;
  }

  /* Main Content */
  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  /* Statistics Cards */
  .stats-cards {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card {
    flex: 1;
    height: 120px;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    color: white;
    display: flex;
    align-items: center;
    padding: 20px;
  }

  .stat-card.cities {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  }

  .stat-card.countries {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .stat-card.flights {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  .stat-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
  }

  .stat-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 15px;
    width: 100%;
  }

  .stat-number {
    font-size: var(--font-xg);
    font-weight: bold;
  }

  .stat-labels {
    display: flex;
    flex-direction: column;
  }

  .stat-label {
    font-size: var(--font-sm);
    line-height: 1.2;
  }

  /* Form Container */
  .form-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    border-bottom: 1px solid var(--grey-light);
  }

  .form-title {
    font-size: var(--font-lg);
    font-weight: bold;
    margin: 0;
    color: #333;
  }

  .update-btn {
    background: var(--blue);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: var(--font-sm);
    font-weight: 600;
    cursor: pointer;
  }

  .update-btn:hover {
    background: var(--blue-dark);
  }

  .form-content {
    padding: 30px;
  }

  .form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 25px;
  }

  .form-group {
    flex: 1;
  }

  .form-group.empty {
    visibility: hidden;
  }

  .form-group label {
    display: block;
    font-size: var(--font-s);
    color: var(--grey-dark);
    margin-bottom: 8px;
    font-weight: 600;
  }

  .required {
    color: var(--red);
  }

  .form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--grey-light);
    border-radius: 4px;
    font-size: var(--font-sm);
    background: white;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--blue);
  }

  .form-group input::placeholder {
    color: var(--grey-dark);
  }

  .dropdown-wrapper,
  .date-wrapper {
    width: 100%;
    min-height: 44px;
  }

  .file-input {
    display: none;
  }

  .reset-password-section {
    border: 1px solid var(--grey-light);
    padding: 20px;
    border-radius: 6px;
    background: #fafafa;
    margin-top: 20px;
  }

  .section-title {
    font-size: var(--font-lg);
    margin: 0 0 15px 0;
    color: #333;
    font-weight: bold;
  }

  .content-placeholder {
    background: white;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .content-placeholder h2 {
    font-size: var(--font-lg);
    margin-bottom: 10px;
    color: #333;
  }

  .content-placeholder p {
    color: var(--grey-dark);
    font-size: var(--font-sm);
  }

  @media (max-width: 768px) {
    .profile-container {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
    }

    .stats-cards {
      flex-direction: column;
    }

    .form-row {
      flex-direction: column;
    }
  }
</style>
