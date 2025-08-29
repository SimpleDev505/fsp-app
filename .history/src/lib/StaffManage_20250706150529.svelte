<!-- StaffManagement.svelte -->
<script lang="ts">
  import { getUserByName, type LoginData } from "./Store/login";

  // Writable states
  let searchQuery = $state("");
  let selectedUser: LoginData | null = $state(null);
  let profile_err = $state({ message: null, type: "ERROR" });
  let showBanOverlay = $state(false);
  let showAnnouncementsOverlay = $state(false);
  let showScheduleOverlay = $state(false);

  let banReason = $state("");

  async function handleSearch() {
    try {
      const user: LoginData | null = await getUserByName(searchQuery);
      if (user) {
        selectedUser = user;
      } else {
        profile_err = { message: "User not found", type: "ERROR" };
      }
    } catch (err) {
      profile_err = { message: err.message, type: "ERROR" };
    }
  }
</script>

<div class="container">
  <div class="sidebar">
    <input
      type="text"
      placeholder="Search staff by name"
      bind:value={$searchQuery}
      on:keydown={(e) => e.key === "Enter" && handleSearch()}
    />

    {#if $selectedUser}
      <div style="margin-top: 1rem">
        <h3>Details</h3>
        <p><strong>Name:</strong> {$selectedUser.username}</p>
        <p><strong>Email:</strong> {$selectedUser.email}</p>
        <p><strong>Phone:</strong> {$selectedUser.phone}</p>
        <p><strong>Type:</strong> {$selectedUser.user_type}</p>
        <p>
          <strong>Login:</strong>
          {formatDateShort($selectedUser.login_time)}
        </p>
      </div>
    {/if}

    <div style="margin-top: 1rem">
      <h4>Activity Stats</h4>
      <p>Login Time: {formatDateShort($selectedUser?.login_time || "")}</p>
      <p>
        Announcements Made: {allAnnouncements.filter(
          (a) => a.message_author === $selectedUser?.username
        ).length}
      </p>
      <p>
        Schedules Made: {schFlights.filter(
          (f) => f.flight.flightOffer?.createdBy === $selectedUser?.username
        ).length}
      </p>
    </div>

    <button on:click={() => showBanOverlay.set(true)}>Ban Staff</button>
    <button on:click={() => showScheduleOverlay.set(true)}
      >View Scheduled Flights</button
    >
    <button on:click={() => showAnnouncementsOverlay.set(true)}
      >View Announcements</button
    >
  </div>

  <div class="content">
    <h2>Staff Management</h2>
    <p>Select a staff to view details.</p>
  </div>
</div>

<!-- Overlays -->
{#if $showBanOverlay}
  <div class="overlay">
    <div class="popup">
      <h3>Ban Staff</h3>
      <input type="text" placeholder="Reason" bind:value={$banReason} />
      <button
        style="background: var(--red)"
        on:click={() => {
          console.log("Ban reason:", $banReason);
          showBanOverlay.set(false);
        }}>Confirm Ban</button
      >
      <button on:click={() => showBanOverlay.set(false)}>Cancel</button>
    </div>
  </div>
{/if}

{#if $showScheduleOverlay}
  <div class="overlay">
    <div class="popup" style="max-height: 80vh; overflow-y: auto">
      <h3>Scheduled Flights</h3>
      {#each schFlights.filter((f) => f.flight.flightOffer?.createdBy === $selectedUser?.username) as sched}
        <div>
          <p>
            <strong>{sched.scheduledType}</strong> — {sched.flight.flightNumber}
          </p>
          <p>
            {sched.rescheduledTime || sched.delayTime || "No time provided"}
          </p>
        </div>
      {/each}
      <button on:click={() => showScheduleOverlay.set(false)}>Close</button>
    </div>
  </div>
{/if}

{#if $showAnnouncementsOverlay}
  <div class="overlay">
    <div class="popup" style="max-height: 80vh; overflow-y: auto">
      <h3>Announcements</h3>
      {#each allAnnouncements.filter((a) => a.message_author === $selectedUser?.username) as ann}
        <div>
          <p><strong>{formatDateShort(ann.time)}</strong> - {ann.content}</p>
        </div>
      {/each}
      <button on:click={() => showAnnouncementsOverlay.set(false)}>Close</button
      >
    </div>
  </div>
{/if}

<Notifier P_error={$profile_err.message} Type={$profile_err.type} />

<style>
  :root {
    --blue: #04b0d3;
    --green: #08e200;
    --yellow: #e7c205;
    --grey-light: #ebebeb;
    --grey-dark: #6d6d6d;
    --red: #e8651a;
    --blue-dark: #018daa;
  }
  .container {
    display: grid;
    grid-template-columns: 1.3fr 2fr;
    gap: 1rem;
    padding: 1rem;
  }
  .sidebar {
    background: var(--grey-light);
    padding: 1rem;
    border-radius: 8px;
  }
  .content {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  .popup {
    background: #fff;
    padding: 1rem;
    border-radius: 10px;
    width: 400px;
  }
</style>
