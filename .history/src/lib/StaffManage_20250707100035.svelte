<!-- StaffManagement.svelte -->
<script lang="ts">
  import { writable, derived } from "svelte/store";
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import {
    getAnnouncementsByAuthor,
    getUserByName,
    type LoginData,
  } from "./Store/login";
  import type { GlobalAnnouncement } from "./Store/announce";
  import {
    fetchScheduledFlightsByUsername,
    type ScheduledFlight,
  } from "./Store/schedule";

  // State
  let searchQuery = $state("");
  let currentStaff = $state<LoginData | null>(null);
  let announcements = $state<GlobalAnnouncement[]>([]);
  let scheduledFlights = $state<ScheduledFlight[]>([]);
  let loading = $state(false);
  let showBanModal = $state(false);
  let showFlightSchedules = $state(false);
  let showAnnouncements = $state(false);
  let banReason = $state("");
  const announcementChartData = $derived.by(() => {
    const dateGroups = announcements.reduce(
      (acc, ann) => {
        const date = new Date(ann.timestamp).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(dateGroups).map(([date, count]) => ({
      date,
      count,
    }));
  });

  const flightScheduleChartData = $derived.by(() => {
    const timeGroups = scheduledFlights.reduce(
      (acc, flight) => {
        let time: Date;
        if (flight.scheduledType === "RESCHEDULED" && flight.rescheduledTime) {
          time = new Date(flight.rescheduledTime);
        } else if (flight.scheduledType === "DELAY" && flight.delayTime) {
          time = new Date(flight.delayTime);
        } else {
          time = new Date(
            flight.flight.itineraries[0].segments[0].departure.at
          );
        }
        const hour = time.getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    return Object.entries(timeGroups).map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
    }));
  });

  async function searchStaff() {
    if (!searchQuery.trim()) return;

    loading = true;
    try {
      const staff = await getUserByName(searchQuery);
      if (staff) {
        currentStaff = staff;
        //Announcements
        if (staff.username) {
          const ann = await getAnnouncementsByAuthor(staff.username);
          if (ann) {
            announcements = ann;
          } else {
            announcements = [];
          }

          const sch = await fetchScheduledFlightsByUsername(staff.username);
          if (sch) {
            scheduledFlights = sch;
          } else {
            scheduledFlights = [];
          }
        }
        //Schedulings
      } else {
        currentStaff = null;
      }
    } catch (error) {
      console.error("Error searching staff:", error);
    } finally {
      loading = false;
    }
  }

  function toggleBanStaff() {
    if (!currentStaff) return;

    if (currentStaff.banned) {
      currentStaff = {
        ...currentStaff,
        banned: false,
        ban_time: undefined,
      };
    } else {
      showBanModal = true;
    }
  }

  function confirmBan() {
    if (!currentStaff || !banReason.trim()) return;

    currentStaff = {
      ...currentStaff,
      banned: true,
      ban_time: new Date(),
    };

    showBanModal = false;
    banReason = "";
  }

  function createSimpleChart(
    data: any[],
    color: string,
    type: "announcements" | "flights"
  ) {
    if (data.length === 0) return [];

    const maxValue = Math.max(...data.map((d) => d.count));
    const width = 300;
    const height = 150;
    const padding = 20;

    return data.map((d, i) => {
      const x =
        data.length === 1
          ? width / 2
          : padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y =
        height - padding - (d.count / maxValue) * (height - 2 * padding);
      return { x, y, ...d };
    });
  }

  function getRelativeTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  function getHourLabel(hour: number) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  function animateChart(chartId: string, color: string) {
    const circles = document.querySelectorAll(`#${chartId} .chart-point`);
    const lines = document.querySelectorAll(`#${chartId} .chart-line`);
    const gradient = document.querySelector(`#${chartId} .chart-gradient`);

    // Reset elements
    gsap.set(circles, { scale: 0, opacity: 0 });
    gsap.set(lines, { strokeDasharray: "1000", strokeDashoffset: "1000" });
    gsap.set(gradient, { opacity: 0 });

    const tl = gsap.timeline();

    // Gradient
    tl.to(gradient, { opacity: 0.3, duration: 0.5, ease: "elastic.inOut" });

    // Animate lines
    tl.to(
      lines,
      {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "circ.inOut",
        stagger: 0.25,
      },
      "-=0.3"
    );

    // Animate points
    tl.to(
      circles,
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "bounce.inOut",
        stagger: 0.25,
      },
      "-=1"
    );
  }

  $effect(() => {
    if (announcementChartData.length > 0) {
      setTimeout(() => animateChart("announcement-chart", "#3b82f6"), 100);
    }
  });

  $effect(() => {
    if (flightScheduleChartData.length > 0) {
      setTimeout(() => animateChart("flight-chart", "#ef4444"), 100);
    }
  });
</script>

<div class="staff-management-container">
  <!-- Search Section -->
  <div class="search-section">
    <div class="search-box">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search staff by username..."
        class="search-input"
        onkeydown={async (e) => e.key === "Enter" && (await searchStaff())}
      />
      <button onclick={searchStaff} disabled={loading} class="search-button">
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="main-grid">
    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-container">
        <h3>Announcements by Date</h3>
        <div class="chart-wrapper">
          {#if announcementChartData.length > 0}
            {@const chartPoints = createSimpleChart(
              announcementChartData,
              "#3b82f6",
              "announcements"
            )}
            <svg
              viewBox="0 0 300 150"
              class="chart-svg"
              id="announcement-chart"
            >
              <!-- Grid lines -->
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="1"
                    opacity="0.5"
                  />
                </pattern>
                <linearGradient
                  id="blueGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style="stop-color:#3b82f6;stop-opacity:0.3"
                  />
                  <stop
                    offset="100%"
                    style="stop-color:#3b82f6;stop-opacity:0"
                  />
                </linearGradient>
              </defs>

              <!-- Grid background -->
              <rect width="300" height="150" fill="url(#grid)" />

              <!-- Gradient area -->
              <polygon
                points="20,130 {chartPoints
                  .map((p) => `${p.x},${p.y}`)
                  .join(' ')} 280,130"
                fill="url(#blueGradient)"
                class="chart-gradient"
              />

              <!-- Lines -->
              {#each chartPoints as point, i}
                {#if i < chartPoints.length - 1}
                  <line
                    x1={point.x}
                    y1={point.y}
                    x2={chartPoints[i + 1].x}
                    y2={chartPoints[i + 1].y}
                    stroke="#3b82f6"
                    stroke-width="2"
                    class="chart-line"
                  />
                {/if}
              {/each}

              <!-- Points -->
              {#each chartPoints as point, i}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#3b82f6"
                  class="chart-point hover-point"
                >
                  <title
                    >{getHourLabel(point.hour)} - {point.count} flight{point.count !==
                    1
                      ? "s"
                      : ""}</title
                  >
                </circle>
              {/each}
            </svg>
          {:else}
            <div class="no-data">No announcement data</div>
          {/if}
        </div>
      </div>

      <div class="chart-container">
        <h3>Flight Schedules by Time</h3>
        <div class="chart-wrapper">
          {#if flightScheduleChartData.length > 0}
            {@const chartPoints = createSimpleChart(
              flightScheduleChartData,
              "#ef4444",
              "flights"
            )}
            <svg viewBox="0 0 300 150" class="chart-svg" id="flight-chart">
              <!-- Grid lines -->
              <defs>
                <pattern
                  id="grid2"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="1"
                    opacity="0.5"
                  />
                </pattern>
                <linearGradient
                  id="redGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style="stop-color:#ef4444;stop-opacity:0.3"
                  />
                  <stop
                    offset="100%"
                    style="stop-color:#ef4444;stop-opacity:0"
                  />
                </linearGradient>
              </defs>

              <!-- Grid background -->
              <rect width="300" height="150" fill="url(#grid2)" />

              <!-- Gradient area -->
              <polygon
                points="20,130 {chartPoints
                  .map((p) => `${p.x},${p.y}`)
                  .join(' ')} 280,130"
                fill="url(#redGradient)"
                class="chart-gradient"
              />

              <!-- Lines -->
              {#each chartPoints as point, i}
                {#if i < chartPoints.length - 1}
                  <line
                    x1={point.x}
                    y1={point.y}
                    x2={chartPoints[i + 1].x}
                    y2={chartPoints[i + 1].y}
                    stroke="#ef4444"
                    stroke-width="2"
                    class="chart-line"
                  />
                {/if}
              {/each}

              <!-- Points -->
              {#each chartPoints as point, i}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#ef4444"
                  class="chart-point hover-point"
                >
                  <title
                    >{getRelativeTime(point.date)} - {point.count} announcement{point.count !==
                    1
                      ? "s"
                      : ""}</title
                  >
                </circle>
              {/each}
            </svg>
          {:else}
            <div class="no-data">No flight schedule data</div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Staff Details Section -->
    <div class="staff-details-section">
      {#if currentStaff}
        <div class="staff-card">
          <div class="staff-header">
            <img
              src={currentStaff.photo || "https://via.placeholder.com/80"}
              alt="Staff"
              class="staff-photo"
            />
            <div class="staff-info">
              <h3>{currentStaff.username}</h3>
              <p class="staff-id">ID: {currentStaff.id}</p>
              <span class="staff-type {currentStaff.user_type.toLowerCase()}"
                >{currentStaff.user_type}</span
              >
            </div>
          </div>

          <div class="staff-details">
            <div class="detail-item">
              <span class="label">Email:</span>
              <span class="value">{currentStaff.email ?? "-"}</span>
            </div>
            <div class="detail-item">
              <span class="label">Phone:</span>
              <span class="value">{currentStaff.phone ?? "-"}</span>
            </div>
            <div class="detail-item">
              <span class="label">Passport:</span>
              <span class="value">{currentStaff.passportno ?? "-"}</span>
            </div>
            <div class="detail-item">
              <span class="label">PAN Card:</span>
              <span class="value">{currentStaff.pancardno ?? "-"}</span>
            </div>
            <div class="detail-item">
              <span class="label">Tickets Booked:</span>
              <span class="value">{currentStaff.ticket_booked ?? "-"}</span>
            </div>
          </div>

          {#if currentStaff.banned}
            <div class="ban-notice">
              <span class="ban-icon"></span>
              <span
                >Staff is banned since {currentStaff.ban_time?.toLocaleDateString()}</span
              >
            </div>
          {/if}

          <div class="action-buttons">
            <button
              onclick={toggleBanStaff}
              class="ban-button {currentStaff.banned ? 'unban' : 'ban'}"
            >
              {currentStaff.banned ? "Remove Ban" : "Ban Staff"}
            </button>

            <button
              onclick={() => (showFlightSchedules = true)}
              class="action-button"
            >
              View Flight Schedules
            </button>

            <button
              onclick={() => (showAnnouncements = true)}
              class="action-button"
            >
              View Announcements
            </button>
          </div>
        </div>
      {:else}
        <div class="no-staff">
          <p>Search for a staff member to view details</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Ban Modal -->
  {#if showBanModal}
    <div
      class="modal-overlay"
      onclick={(e) => e.target === e.currentTarget && (showBanModal = false)}
    >
      <div class="modal">
        <h3>Ban Staff Member</h3>
        <p>Provide a reason for banning {currentStaff?.username}:</p>
        <textarea
          bind:value={banReason}
          placeholder="Enter ban reason..."
          class="ban-reason-input"
        ></textarea>
        <div class="modal-actions">
          <button onclick={() => (showBanModal = false)} class="cancel-button"
            >Cancel</button
          >
          <button
            onclick={confirmBan}
            disabled={!banReason.trim()}
            class="confirm-button">Confirm Ban</button
          >
        </div>
      </div>
    </div>
  {/if}

  <!-- Flight Schedules Modal -->
  {#if showFlightSchedules}
    <div
      class="modal-overlay"
      onclick={(e) =>
        e.target === e.currentTarget && (showFlightSchedules = false)}
    >
      <div class="modal large">
        <h3>Flight Schedules</h3>
        <div class="schedules-list">
          {#each scheduledFlights as flight}
            <div class="schedule-item">
              <div class="schedule-header">
                <span class="flight-id">{flight.flight.id}</span>
                <span class="schedule-type {flight.scheduledType.toLowerCase()}"
                  >{flight.scheduledType}</span
                >
              </div>
              <div class="schedule-details">
                <p>
                  <strong>From:</strong>
                  {flight.flight.itineraries[0].segments[0].departure.iataCode}
                </p>
                <p>
                  <strong>To:</strong>
                  {flight.flight.itineraries[0].segments[0].arrival.iataCode}
                </p>
                <p>
                  <strong>Departure:</strong>
                  {new Date(
                    flight.flight.itineraries[0].segments[0].departure.at
                  ).toLocaleString()}
                </p>
                <p><strong>Scheduled by:</strong> {flight.scheduledBy}</p>
                {#if flight.delayTime}
                  <p><strong>Delay:</strong> {flight.delayTime}</p>
                {/if}
                {#if flight.rescheduledTime}
                  <p>
                    <strong>Rescheduled to:</strong>
                    {flight.rescheduledTime}
                  </p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        <button
          onclick={() => (showFlightSchedules = false)}
          class="close-button">Close</button
        >
      </div>
    </div>
  {/if}

  <!-- Announcements Modal -->
  {#if showAnnouncements}
    <div
      class="modal-overlay"
      onclick={(e) =>
        e.target === e.currentTarget && (showAnnouncements = false)}
    >
      <div class="modal large">
        <h3>Announcements</h3>
        <div class="announcements-list">
          {#each announcements as announcement}
            <div class="announcement-item">
              <div class="announcement-header">
                <span class="announcement-author"
                  >{announcement.message_author}</span
                >
                <span class="announcement-time"
                  >{new Date(announcement.timestamp).toLocaleString()}</span
                >
              </div>
              <div class="announcement-message">{announcement.message}</div>
              <div class="announcement-type">{announcement.type}</div>
            </div>
          {/each}
        </div>
        <button onclick={() => (showAnnouncements = false)} class="close-button"
          >Close</button
        >
      </div>
    </div>
  {/if}
</div>

<style>
  .chart-svg {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .chart-svg .hover-point {
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .chart-svg .hover-point:hover {
    r: 6;
    filter: brightness(1.2);
  }

  .chart-svg .hover-point title {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .chart-gradient {
    opacity: 0;
  }

  .chart-line {
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .chart-point {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
  .staff-management-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  .search-section {
    margin-bottom: 30px;
  }

  .search-box {
    display: flex;
    gap: 10px;
    max-width: 500px;
  }

  .search-input {
    flex: 1;
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .search-button {
    padding: 12px 24px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .search-button:hover {
    background: #2563eb;
  }

  .search-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .main-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
  }

  .charts-section {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 20px;
  }

  .chart-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .chart-container h3 {
    margin: 0 0 15px 0;
    color: #374151;
  }

  .chart-wrapper {
    position: relative;
    height: 150px;
  }

  .chart-svg {
    width: 100%;
    height: 100%;
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6b7280;
    font-style: italic;
  }

  .staff-details-section {
    display: flex;
    flex-direction: column;
  }

  .staff-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .staff-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
  }

  .staff-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  .staff-info h3 {
    margin: 0 0 5px 0;
    color: #374151;
  }

  .staff-id {
    margin: 0 0 5px 0;
    color: #6b7280;
    font-size: 14px;
  }

  .staff-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .staff-type.staff {
    background: #dbeafe;
    color: #1e40af;
  }

  .staff-type.admin {
    background: #fef3c7;
    color: #92400e;
  }

  .staff-details {
    margin-bottom: 20px;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .label {
    font-weight: 500;
    color: #6b7280;
  }

  .value {
    color: #374151;
  }

  .ban-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #fef2f2;
    border-left: 4px solid #ef4444;
    border-radius: 4px;
    margin-bottom: 20px;
    color: #dc2626;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ban-button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .ban-button.ban {
    background: #ef4444;
    color: white;
  }

  .ban-button.ban:hover {
    background: #dc2626;
  }

  .ban-button.unban {
    background: #10b981;
    color: white;
  }

  .ban-button.unban:hover {
    background: #059669;
  }

  .action-button {
    padding: 10px 20px;
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .action-button:hover {
    background: #4b5563;
  }

  .no-staff {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #6b7280;
    font-style: italic;
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

  .modal {
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal.large {
    max-width: 800px;
  }

  .modal h3 {
    margin: 0 0 20px 0;
    color: #374151;
  }

  .ban-reason-input {
    width: 100%;
    height: 100px;
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
    margin-bottom: 20px;
  }

  .ban-reason-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .cancel-button {
    padding: 10px 20px;
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .confirm-button {
    padding: 10px 20px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .confirm-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .close-button {
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
  }

  .schedules-list,
  .announcements-list {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
  }

  .schedule-item {
    background: #f9fafb;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
  }

  .schedule-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .flight-id {
    font-weight: bold;
    color: #374151;
  }

  .schedule-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .schedule-type.delay {
    background: #fef3c7;
    color: #92400e;
  }

  .schedule-type.rescheduled {
    background: #dbeafe;
    color: #1e40af;
  }

  .schedule-type.canceled {
    background: #fef2f2;
    color: #dc2626;
  }

  .schedule-details p {
    margin: 5px 0;
    color: #6b7280;
    font-size: 14px;
  }

  .announcement-item {
    background: #f9fafb;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
  }

  .announcement-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .announcement-author {
    font-weight: bold;
    color: #374151;
  }

  .announcement-time {
    font-size: 12px;
    color: #6b7280;
  }

  .announcement-message {
    color: #374151;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .announcement-type {
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 500;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .main-grid {
      grid-template-columns: 1fr;
    }

    .charts-section {
      grid-template-rows: auto auto;
    }

    .search-box {
      flex-direction: column;
    }

    .modal {
      width: 95%;
      padding: 20px;
    }

    .staff-header {
      flex-direction: column;
      text-align: center;
    }

    .detail-item {
      flex-direction: column;
      gap: 4px;
    }
  }

  /* Loading States */
  .loading {
    opacity: 0.6;
    pointer-events: none;
  }

  /* Hover Effects */
  .staff-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transition: box-shadow 0.3s ease;
  }

  .chart-container:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transition: box-shadow 0.3s ease;
  }

  /* Animation for modals */
  .modal-overlay {
    animation: fadeIn 0.3s ease;
  }

  .modal {
    animation: slideIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Scrollbar Styling */
  .schedules-list::-webkit-scrollbar,
  .announcements-list::-webkit-scrollbar {
    width: 8px;
  }

  .schedules-list::-webkit-scrollbar-track,
  .announcements-list::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  .schedules-list::-webkit-scrollbar-thumb,
  .announcements-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  .schedules-list::-webkit-scrollbar-thumb:hover,
  .announcements-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Focus states for accessibility */
  button:focus,
  input:focus,
  textarea:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Status indicators */
  .status-indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .status-indicator.active {
    background: #10b981;
  }

  .status-indicator.banned {
    background: #ef4444;
  }

  .status-indicator.inactive {
    background: #6b7280;
  }
</style>
