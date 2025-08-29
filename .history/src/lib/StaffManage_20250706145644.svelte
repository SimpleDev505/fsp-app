<!-- StaffManagement.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { getUserByName, type LoginData } from "./Store/login";
  import type { StatusMessage } from "./Notifier.svelte";
  import Notifier from "./Notifier.svelte";
  import e from "express";

  // Activity data interface
  interface ActivityData {
    date: string;
    logins: number;
    announcements: number;
    reschedules: number;
  }

  // State management with runes
  let staffList = $state<LoginData[]>([]);
  let selectedStaff = $state<LoginData | null>(null);
  let searchQuery = $state("");
  let filteredStaff = $state<LoginData[]>([]);
  let activityData = $state<ActivityData[]>([]);
  let announcementsData = $state<any[]>([]);
  let reschedulesData = $state<any[]>([]);

  let staff_err: StatusMessage = { message: null, type: "ERROR" };

  // Modal states
  let showBanModal = $state(false);
  let showAnnouncementsModal = $state(false);
  let showReschedulesModal = $state(false);
  let banReason = $state("");

  // Mock data - replace with your actual data
  let mockStaff: LoginData[] = [
    {
      id: "1",
      username: "john_doe",
      email: "john@example.com",
      phone: "+1234567890",
      photo: "https://via.placeholder.com/150",
      passportno: "A1234567",
      pancardno: "ABCDE1234F",
      user_type: "STAFF",
      login_time: "2024-01-15T09:30:00Z",
      banned: false,
      ticket_booked: 45,
      recent_place: "New York",
      amount_saved: 2500,
    },
    {
      id: "2",
      username: "jane_smith",
      email: "jane@example.com",
      phone: "+1234567891",
      photo: "https://via.placeholder.com/150",
      passportno: "B7654321",
      pancardno: "FGHIJ5678K",
      user_type: "STAFF",
      login_time: "2024-01-14T08:15:00Z",
      banned: false,
      ticket_booked: 32,
      recent_place: "Los Angeles",
      amount_saved: 1800,
    },
  ];

  // Mock activity data for chart
  let mockActivityData: ActivityData[] = [
    { date: "2024-01-01", logins: 5, announcements: 2, reschedules: 1 },
    { date: "2024-01-02", logins: 8, announcements: 3, reschedules: 2 },
    { date: "2024-01-03", logins: 6, announcements: 1, reschedules: 0 },
    { date: "2024-01-04", logins: 12, announcements: 4, reschedules: 3 },
    { date: "2024-01-05", logins: 9, announcements: 2, reschedules: 1 },
    { date: "2024-01-06", logins: 7, announcements: 3, reschedules: 2 },
    { date: "2024-01-07", logins: 11, announcements: 5, reschedules: 1 },
  ];

  // Initialize data
  onMount(() => {
    staffList = mockStaff;
    filteredStaff = mockStaff;
    activityData = mockActivityData;
    if (staffList.length > 0) {
      selectedStaff = staffList[0];
    }
  });

  // Search functionality

  // Staff selection
  function selectStaff(staff: LoginData) {
    selectedStaff = staff;
    // Here you would fetch staff-specific activity data
    // For now, using mock data
  }

  // Ban staff functionality
  function openBanModal() {
    showBanModal = true;
  }

  function closeBanModal() {
    showBanModal = false;
    banReason = "";
  }

  function banStaff() {
    if (selectedStaff && banReason.trim()) {
      // Update staff banned status
      selectedStaff.banned = true;
      selectedStaff.ban_time = new Date();

      // Update in staffList
      const index = staffList.findIndex((s) => s.id === selectedStaff?.id);
      if (index !== -1) {
        staffList[index] = { ...selectedStaff };
      }

      closeBanModal();
    }
  }

  // Modal functions
  function openAnnouncementsModal() {
    showAnnouncementsModal = true;
  }

  function openReschedulesModal() {
    showReschedulesModal = true;
  }

  // Simple chart component
  function getMaxValue(data: ActivityData[]) {
    return Math.max(
      ...data.map((d) => Math.max(d.logins, d.announcements, d.reschedules))
    );
  }

  function getBarHeight(value: number, max: number) {
    return (value / max) * 100;
  }
</script>

<div class="staff-management-container">
  <!-- Main Layout -->
  <div class="layout">
    <!-- Left Column -->
    <div class="left-column">
      <!-- Search Bar -->
      {#if staff_err.message}
        <Notifier P_error={staff_err.message} Type={staff_err.type}></Notifier>
      {/if}
      <div class="search-section">
        <input
          type="text"
          placeholder="Search staff by Username"
          bind:value={searchQuery}
          class="search-input"
          onkeydown={(e: KeyboardEvent) => {
            if (e.key === "Enter") {
              let res = getUserByName(searchQuery);
              if (res) {
                // selectedStaff = res;
              } else {
                staff_err.message = "No Staff Found By This Staff Username";
                staff_err.type = "ERROR";
                setTimeout(() => {
                  staff_err.message = null;
                }, 4500);
              }
            }
          }}
        />
      </div>

      <!-- Activity Chart -->
      <div class="chart-section">
        <h3>Recent Activity (Last 30 Days)</h3>
        <div class="chart-container">
          <div class="chart">
            {#each activityData as day}
              <div class="chart-day">
                <div class="bars">
                  <div
                    class="bar login-bar"
                    style="height: {getBarHeight(
                      day.logins,
                      getMaxValue(activityData)
                    )}%"
                    title="Logins: {day.logins}"
                  ></div>
                  <div
                    class="bar announcement-bar"
                    style="height: {getBarHeight(
                      day.announcements,
                      getMaxValue(activityData)
                    )}%"
                    title="Announcements: {day.announcements}"
                  ></div>
                  <div
                    class="bar reschedule-bar"
                    style="height: {getBarHeight(
                      day.reschedules,
                      getMaxValue(activityData)
                    )}%"
                    title="Reschedules: {day.reschedules}"
                  ></div>
                </div>
                <div class="date-label">{new Date(day.date).getDate()}</div>
              </div>
            {/each}
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color login-color"></div>
              <span>Logins</span>
            </div>
            <div class="legend-item">
              <div class="legend-color announcement-color"></div>
              <span>Announcements</span>
            </div>
            <div class="legend-item">
              <div class="legend-color reschedule-color"></div>
              <span>Reschedules</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
          class="btn btn-danger"
          onclick={openBanModal}
          disabled={!selectedStaff || selectedStaff.banned}
        >
          {selectedStaff?.banned ? "Already Banned" : "Ban Staff"}
        </button>
        <button class="btn btn-info" onclick={openAnnouncementsModal}>
          View Announcements
        </button>
        <button class="btn btn-warning" onclick={openReschedulesModal}>
          View Reschedules
        </button>
      </div>

      <!-- Staff List -->
      <div class="staff-list">
        <h3>Staff Members</h3>
        <div class="staff-items">
          {#each filteredStaff as staff}
            <div
              class="staff-item {selectedStaff?.id === staff.id
                ? 'selected'
                : ''}"
              onclick={() => selectStaff(staff)}
            >
              <img
                src={staff.photo || "https://via.placeholder.com/40"}
                alt={staff.username}
                class="staff-avatar"
              />
              <div class="staff-info">
                <div class="staff-name">{staff.username}</div>
                <div class="staff-email">{staff.email}</div>
                {#if staff.banned}
                  <div class="banned-badge">BANNED</div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right Column - Staff Details -->
    <div class="right-column">
      {#if selectedStaff}
        <div class="staff-details">
          <div class="staff-header">
            <img
              src={selectedStaff.photo || "https://via.placeholder.com/100"}
              alt={selectedStaff.username}
              class="staff-profile-pic"
            />
            <div class="staff-title">
              <h2>{selectedStaff.username}</h2>
              <p class="staff-type">{selectedStaff.user_type}</p>
              {#if selectedStaff.banned}
                <span class="status-badge banned">BANNED</span>
              {:else}
                <span class="status-badge active">ACTIVE</span>
              {/if}
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <label>Email</label>
              <span>{selectedStaff.email || "N/A"}</span>
            </div>
            <div class="detail-item">
              <label>Phone</label>
              <span>{selectedStaff.phone || "N/A"}</span>
            </div>
            <div class="detail-item">
              <label>Staff ID</label>
              <span>{selectedStaff.id || "N/A"}</span>
            </div>
            <div class="detail-item">
              <label>Passport No.</label>
              <span>{selectedStaff.passportno || "N/A"}</span>
            </div>
            <div class="detail-item">
              <label>PAN Card No.</label>
              <span>{selectedStaff.pancardno || "N/A"}</span>
            </div>
            <div class="detail-item">
              <label>Last Login</label>
              <span
                >{selectedStaff.login_time
                  ? new Date(selectedStaff.login_time).toLocaleDateString()
                  : "N/A"}</span
              >
            </div>
            <div class="detail-item">
              <label>Tickets Booked</label>
              <span>{selectedStaff.ticket_booked || 0}</span>
            </div>
            <div class="detail-item">
              <label>Recent Place</label>
              <span>{selectedStaff.recent_place || "N/A"}</span>
            </div>
            <div class="detail-item">
              <label>Amount Saved</label>
              <span>${selectedStaff.amount_saved || 0}</span>
            </div>
            {#if selectedStaff.banned && selectedStaff.ban_time}
              <div class="detail-item">
                <label>Ban Time</label>
                <span>{new Date(selectedStaff.ban_time).toLocaleString()}</span>
              </div>
            {/if}
          </div>
        </div>
      {:else}
        <div class="no-selection">
          <p>Select a staff member to view details</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Ban Modal -->
{#if showBanModal}
  <div class="modal-overlay" onclick={closeBanModal}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <h3>Ban Staff Member</h3>
      <p>
        Are you sure you want to ban <strong>{selectedStaff?.username}</strong>?
      </p>
      <div class="form-group">
        <label for="banReason">Reason for ban:</label>
        <textarea
          id="banReason"
          bind:value={banReason}
          placeholder="Enter reason for banning this staff member..."
          class="ban-reason-input"
        ></textarea>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick={closeBanModal}>Cancel</button
        >
        <button
          class="btn btn-danger"
          onclick={banStaff}
          disabled={!banReason.trim()}
        >
          Ban Staff
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Announcements Modal -->
{#if showAnnouncementsModal}
  <div class="modal-overlay" onclick={() => (showAnnouncementsModal = false)}>
    <div class="modal-content scrollable" onclick={(e) => e.stopPropagation()}>
      <h3>Staff Announcements</h3>
      <div class="announcements-list">
        <!-- Placeholder for announcements data -->
        <div class="announcement-item">
          <div class="announcement-header">
            <span class="announcement-date">2024-01-15</span>
            <span class="announcement-staff">By: {selectedStaff?.username}</span
            >
          </div>
          <div class="announcement-content">
            [Announcement content will be populated here]
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button
          class="btn btn-secondary"
          onclick={() => (showAnnouncementsModal = false)}>Close</button
        >
      </div>
    </div>
  </div>
{/if}

<!-- Reschedules Modal -->
{#if showReschedulesModal}
  <div class="modal-overlay" onclick={() => (showReschedulesModal = false)}>
    <div class="modal-content scrollable" onclick={(e) => e.stopPropagation()}>
      <h3>Flight Reschedules</h3>
      <div class="reschedules-list">
        <!-- Placeholder for reschedules data -->
        <div class="reschedule-item">
          <div class="reschedule-header">
            <span class="reschedule-date">2024-01-15</span>
            <span class="reschedule-staff">By: {selectedStaff?.username}</span>
          </div>
          <div class="reschedule-content">
            [Flight reschedule data will be populated here]
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button
          class="btn btn-secondary"
          onclick={() => (showReschedulesModal = false)}>Close</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .staff-management-container {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    min-height: 80vh;
  }

  .left-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .search-section {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .search-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
  }

  .chart-section {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .chart-section h3 {
    margin-top: 0;
    color: #333;
  }

  .chart-container {
    margin-top: 20px;
  }

  .chart {
    display: flex;
    gap: 4px;
    height: 200px;
    align-items: flex-end;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  .chart-day {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .bars {
    display: flex;
    gap: 2px;
    align-items: flex-end;
    height: 150px;
  }

  .bar {
    width: 8px;
    min-height: 2px;
    border-radius: 2px;
  }

  .login-bar {
    background: var(--blue);
  }

  .announcement-bar {
    background: var(--green);
  }

  .reschedule-bar {
    background: var(--yellow);
  }

  .date-label {
    font-size: 12px;
    color: var(--greydark);
  }

  .chart-legend {
    display: flex;
    gap: 20px;
    margin-top: 10px;
    justify-content: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .login-color {
    background: var(--blue);
  }

  .announcement-color {
    background: var(--green);
  }

  .reschedule-color {
    background: var(--yellow);
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-danger {
    background: var(--blue-dark);
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background: var(--blue);
  }

  .btn-info {
    background: var(--blue);
    color: white;
  }

  .btn-info:hover {
    background: var(--blue-dark);
  }

  .btn-warning {
    background: var(--yellow);
    color: white;
  }

  .btn-warning:hover {
    background: var(-red);
  }

  .btn-secondary {
    background: var(--grey-dark);
    color: white;
  }

  .btn-secondary:hover {
    background: #4b5563;
  }

  .staff-list {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1;
  }

  .staff-list h3 {
    margin-top: 0;
    color: #333;
  }

  .staff-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 400px;
    overflow-y: auto;
  }

  .staff-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .staff-item:hover {
    background: #f8fafc;
    border-color: var(--blue);
  }

  .staff-item.selected {
    background: #eff6ff;
    border-color: var(--blue);
  }

  .staff-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .staff-info {
    flex: 1;
  }

  .staff-name {
    font-weight: 600;
    color: #333;
  }

  .staff-email {
    font-size: 14px;
    color: var(--greydark);
  }

  .banned-badge {
    background: #ef4444;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
  }

  .right-column {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .staff-details {
    height: 100%;
  }

  .staff-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }

  .staff-profile-pic {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  .staff-title h2 {
    margin: 0;
    color: #333;
  }

  .staff-type {
    margin: 5px 0;
    color: var(--greydark);
    font-size: 16px;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.active {
    background: var(--green);
    color: white;
  }

  .status-badge.banned {
    background: #ef4444;
    color: white;
  }

  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .detail-item label {
    font-weight: 600;
    color: var(--grey-dark);
    font-size: 14px;
  }

  .detail-item span {
    color: var(--grey-dark);
    font-size: 16px;
  }

  .no-selection {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--grey-dark);
    font-size: 18px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
  }

  .modal-content.scrollable {
    overflow-y: auto;
    max-width: 700px;
  }

  .modal-content h3 {
    margin-top: 0;
    color: #333;
  }

  .form-group {
    margin: 20px 0;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: var(--grey-dark);
  }

  .ban-reason-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    min-height: 100px;
    resize: vertical;
    font-family: inherit;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .announcements-list,
  .reschedules-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: 400px;
    overflow-y: auto;
  }

  .announcement-item,
  .reschedule-item {
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 6px;
    background: #f8fafc;
  }

  .announcement-header,
  .reschedule-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
    color: var(--greydark);
  }

  .announcement-content,
  .reschedule-content {
    color: #333;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .layout {
      grid-template-columns: 1fr;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }

    .action-buttons {
      flex-direction: column;
    }
  }
</style>
