<script lang="ts">
  import { writable } from "svelte/store";
  import Dropdownmenu from "./dropdownmenu.svelte";
  import DateDropDown from "./DateDropDown.svelte";

  interface LoginData {
    username?: string;
    id?: string;
    email?: string;
    phone?: string;
    photo?: string;
    user_type: "CUSTOMER" | "STAFF" | "ADMIN";
    login_time?: string;
    banned?: boolean;
    ban_time?: Date;
  }

  interface MenuItem {
    label: string;
    action: () => void;
    split: boolean;
    icon?: string;
  }

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

  let showResetPassword = $state(false);
  let fileInput: HTMLInputElement;

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

<div class="profile-page">
  <div class="form-actions">
    <button type="button" class="secondary-btn" onclick={toggleResetPassword}>
      {showResetPassword ? "Cancel Reset" : "Reset Password"}
    </button>
    <button
      type="button"
      class="secondary-btn logout-btn"
      onclick={handleLogout}
    >
      Logout
    </button>
    <button type="button" class="primary-btn" onclick={handleSave}>
      SAVE
    </button>
  </div>
  <div class="profile-card">
    <div class="profile-header">
      <div class="profile-photo-section">
        {#if userProfile.photo}
          <div class="photo-container">
            <img src={userProfile.photo} alt="Profile" class="profile-photo" />
            <button
              type="button"
              class="remove-photo-btn"
              onclick={removePhoto}
            >
              <span class="remove-icon">×</span>
            </button>
          </div>
        {:else}
          <div class="photo-placeholder" onclick={triggerPhotoUpload}>
            <span class="add-photo-icon">📷</span>
            <span class="add-photo-text">Add Photo</span>
          </div>
        {/if}
        <input
          bind:this={fileInput}
          type="file"
          accept="image/*"
          onchange={handlePhotoUpload}
          class="file-input"
        />
      </div>

      <div class="profile-info">
        <h1 class="profile-title">My Profile</h1>
        <div class="profile-completion">
          <div class="completion-badge">30%</div>
          <div class="completion-text">
            <p>Complete your profile</p>
            <p>
              Please fill in your name to help us personalize your experience
            </p>
          </div>
          <button type="button" class="add-name-btn">Add First Name</button>
        </div>
      </div>
    </div>

    <div class="profile-form">
      <section class="form-section">
        <h2 class="section-title">General Information</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="firstName">FIRST & MIDDLE NAME</label>
            <input
              type="text"
              id="firstName"
              bind:value={currentProfile.firstName}
            />
          </div>
          <div class="form-group">
            <label for="lastName">LAST NAME</label>
            <input
              type="text"
              id="lastName"
              bind:value={currentProfile.lastName}
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>GENDER</label>
            <div class="dropdown-wrapper">
              <Dropdownmenu leftpx={0} rightpx={0} items={gender_items}
              ></Dropdownmenu>
            </div>
          </div>
          <div class="form-group">
            <label>DATE OF BIRTH</label>
            <div class="date-wrapper">
              <DateDropDown pickupenddate={false}></DateDropDown>
            </div>
          </div>
          <div class="form-group">
            <label>NATIONALITY</label>
            <div class="dropdown-wrapper">
              <Dropdownmenu leftpx={0} rightpx={0} items={nationality_items}
              ></Dropdownmenu>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>MARITAL STATUS</label>
            <div class="dropdown-wrapper">
              <Dropdownmenu leftpx={0} rightpx={0} items={marital_status_items}
              ></Dropdownmenu>
            </div>
          </div>
          <div class="form-group">
            <label>ANNIVERSARY</label>
            <div class="date-wrapper">
              <DateDropDown pickupenddate={false}></DateDropDown>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>CITY OF RESIDENCE</label>
            <div class="dropdown-wrapper">
              <Dropdownmenu leftpx={0} rightpx={0} items={city_items}
              ></Dropdownmenu>
            </div>
          </div>
          <div class="form-group">
            <label>STATE</label>
            <div class="dropdown-wrapper">
              <Dropdownmenu leftpx={0} rightpx={0} items={state_items}
              ></Dropdownmenu>
            </div>
          </div>
        </div>

        <p class="gst-note">Required for GST purpose on your tax invoice</p>
      </section>

      <section class="form-section">
        <h2 class="section-title">Contact Details</h2>
        <p class="section-subtitle">
          Add contact information to receive booking details & other alerts
        </p>

        <div class="form-row">
          <div class="form-group">
            <label for="phone">MOBILE NUMBER</label>
            <div class="phone-input">
              <input
                type="tel"
                id="phone"
                bind:value={currentProfile.phone}
                readonly
              />
              <button type="button" class="delete-btn">🗑</button>
            </div>
          </div>
          <div class="form-group">
            <label for="email">EMAIL ID</label>
            <div class="email-input">
              <input
                type="email"
                id="email"
                bind:value={currentProfile.email}
                readonly
              />
              <span class="verified-icon">✓</span>
            </div>
          </div>
        </div>
      </section>

      <section class="form-section">
        <h2 class="section-title">Documents Details</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="passportNo">PASSPORT NO.</label>
            <input
              type="text"
              id="passportNo"
              bind:value={currentProfile.passportNo}
            />
          </div>
          <div class="form-group">
            <label>EXPIRY DATE</label>
            <div class="date-wrapper">
              <DateDropDown pickupenddate={false}></DateDropDown>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>ISSUING COUNTRY</label>
            <div class="dropdown-wrapper">
              <Dropdownmenu leftpx={0} rightpx={0} items={country_items}
              ></Dropdownmenu>
            </div>
          </div>
          <div class="form-group">
            <label for="panCardNumber">PAN CARD NUMBER</label>
            <input
              type="text"
              id="panCardNumber"
              bind:value={currentProfile.panCardNumber}
            />
          </div>
        </div>

        <p class="pan-note">
          NOTE: Your PAN No. will only be used for international bookings as per
          RBI Guidelines
        </p>
      </section>

      {#if showResetPassword}
        <section class="form-section reset-password-section">
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
  </div>
</div>

<style>
  :root {
    --blue: #04b0d3;
    --green: #08e200;
    --yellow: #e7c205;
    --grey-light: #ebebeb;
    --grey-dark: #6d6d6d;
    --red: #e8651a;
    --blue-dark: #018daa;
    --font-s: 14px;
    --font-sm: 16px;
    --font-lg: 20px;
    --font-xg: 30px;
  }

  .profile-page {
    min-height: 100vh;
    background-color: var(--grey-light);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .profile-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    width: 100%;
    overflow: hidden;
  }

  .profile-header {
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
    padding: 30px;
    color: white;
    display: flex;
    align-items: flex-start;
    gap: 30px;
  }

  .profile-photo-section {
    flex-shrink: 0;
  }

  .photo-container {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .profile-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
  }

  .remove-photo-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    background: var(--red);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-sm);
    line-height: 1;
  }

  .photo-placeholder {
    width: 80px;
    height: 80px;
    border: 2px dashed white;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
  }

  .add-photo-icon {
    font-size: var(--font-lg);
    margin-bottom: 4px;
  }

  .add-photo-text {
    font-size: var(--font-s);
    text-align: center;
  }

  .file-input {
    display: none;
  }

  .profile-info {
    flex: 1;
  }

  .profile-title {
    font-size: var(--font-xg);
    margin: 0 0 20px 0;
    font-weight: bold;
  }

  .profile-completion {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .completion-badge {
    background: var(--yellow);
    color: #333;
    padding: 8px 12px;
    border-radius: 4px;
    font-weight: bold;
    font-size: var(--font-sm);
  }

  .completion-text {
    flex: 1;
  }

  .completion-text p {
    margin: 0;
    font-size: var(--font-s);
    line-height: 1.4;
  }

  .completion-text p:first-child {
    font-weight: bold;
    margin-bottom: 2px;
  }

  .add-name-btn {
    background: transparent;
    color: white;
    border: 1px solid white;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: var(--font-s);
  }

  .add-name-btn:hover {
    background: white;
    color: var(--blue);
  }

  .profile-form {
    padding: 30px;
  }

  .form-section {
    margin-bottom: 30px;
  }

  .section-title {
    font-size: var(--font-lg);
    margin: 0 0 15px 0;
    color: #333;
    font-weight: bold;
  }

  .section-subtitle {
    color: var(--grey-dark);
    font-size: var(--font-s);
    margin: 0 0 20px 0;
  }

  .form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .form-group {
    flex: 1;
  }

  .form-group label {
    display: block;
    font-size: var(--font-s);
    color: var(--grey-dark);
    margin-bottom: 6px;
    font-weight: bold;
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

  .form-group input:read-only {
    background-color: #f9f9f9;
  }

  .dropdown-wrapper,
  .date-wrapper {
    width: 100%;
    min-height: 44px;
  }

  .phone-input,
  .email-input {
    position: relative;
    display: flex;
    align-items: center;
  }

  .phone-input input,
  .email-input input {
    flex: 1;
    padding-right: 40px;
  }

  .delete-btn {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--font-sm);
  }

  .verified-icon {
    position: absolute;
    right: 10px;
    color: var(--green);
    font-weight: bold;
  }

  .gst-note,
  .pan-note {
    color: var(--grey-dark);
    font-size: var(--font-s);
    margin: 10px 0 0 0;
    font-style: italic;
  }

  .reset-password-section {
    border: 1px solid var(--grey-light);
    padding: 20px;
    border-radius: 6px;
    background: #fafafa;
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid var(--grey-light);
    height: 100%;
  }

  .primary-btn,
  .secondary-btn {
    padding: 12px 24px;
    border-radius: 4px;
    font-size: var(--font-sm);
    font-weight: bold;
    cursor: pointer;
    border: none;
  }

  .primary-btn {
    background: var(--blue);
    color: white;
  }

  .primary-btn:hover {
    background: var(--blue-dark);
  }

  .secondary-btn {
    background: transparent;
    color: var(--grey-dark);
    border: 1px solid var(--grey-dark);
  }

  .secondary-btn:hover {
    background: var(--grey-light);
  }

  .logout-btn {
    color: var(--red);
    border-color: var(--red);
  }

  .logout-btn:hover {
    background: var(--red);
    color: white;
  }

  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      text-align: center;
    }

    .form-row {
      flex-direction: column;
    }

    .form-actions {
      flex-direction: column;
    }
  }
</style>
