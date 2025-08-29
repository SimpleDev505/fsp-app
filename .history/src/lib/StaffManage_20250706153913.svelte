<!-- StaffManagement.svelte -->
<script lang="ts">
  import { writable, derived } from "svelte/store";
  import { onMount } from "svelte";

  // Interfaces
  interface LoginData {
    username?: string;
    id?: string;
    email?: string;
    phone?: string;
    photo?: string;
    passportno?: string;
    pancardno?: string;
    user_type: "CUSTOMER" | "STAFF" | "ADMIN";
    login_time?: string;
    banned?: boolean;
    ban_time?: Date;
    ticket_booked?: number;
    recent_place?: string;
    amount_saved?: number;
  }

  interface GlobalAnnouncement {
    message_author: string;
    message: string;
    type: string;
    timestamp: string;
  }

  interface FlightOffer {
    id: string;
    source: string;
    oneWay: boolean;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    isUpsellOffer: boolean;
    lastTicketingDate: string;
    lastTicketingDateTime: string;
    numberOfBookableSeats: number;
    price: {
      currency: string;
      total: string;
      base?: string;
      grandTotal?: string;
      fees?: { amount: string; type: string }[];
    };
    pricingOptions: {
      fareType: string[];
      includedCheckedBagsOnly: boolean;
    };
    validatingAirlineCodes: string[];
    itineraries: {
      duration: string;
      segments: {
        id: string;
        duration: string;
        numberOfStops: number;
        carrierCode: string;
        number: string;
        blacklistedInEU: boolean;
        aircraft: { code: string };
        operating: { carrierCode: string };
        departure: {
          iataCode: string;
          at: string;
          terminal?: string;
        };
        arrival: {
          iataCode: string;
          at: string;
          terminal?: string;
        };
      }[];
    }[];
    travelerPricings: {
      travelerId: string;
      fareOption: string;
      travelerType: string;
      price: {
        currency: string;
        total: string;
        base: string;
      };
      fareDetailsBySegment: {
        segmentId: string;
        cabin: string;
        brandedFare: string;
        brandedFareLabel: string;
        fareBasis: string;
        class: string;
        includedCheckedBags?: {
          weight: number;
          weightUnit: string;
        };
        includedCabinBags?: {
          weight: number;
          weightUnit: string;
        };
        amenities?: {
          description: string;
          isChargeable: boolean;
          amenityType: string;
          amenityProvider: {
            name: string;
          };
        }[];
      }[];
    }[];
  }

  interface ScheduledFlight {
    scheduledType: "DELAY" | "RESCHEDULED" | "CANCELED";
    rescheduledTime?: string;
    delayTime?: string;
    flight: FlightOffer;
    scheduledBy?: string;
  }

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

  // Mock data for demonstration
  const mockStaff: LoginData = {
    username: "john_doe",
    id: "STF001",
    email: "john.doe@airline.com",
    phone: "+1234567890",
    photo: "https://via.placeholder.com/100",
    passportno: "A1234567",
    pancardno: "ABCDE1234F",
    user_type: "STAFF",
    login_time: "2024-01-15T10:30:00Z",
    banned: false,
    ticket_booked: 45,
    recent_place: "New York",
    amount_saved: 2500,
  };

  const mockAnnouncements: GlobalAnnouncement[] = [
    {
      message_author: "john_doe",
      message: "Flight AA123 delayed by 2 hours due to weather conditions",
      type: "DELAY",
      timestamp: "2024-01-15T14:30:00Z",
    },
    {
      message_author: "john_doe",
      message: "Gate change for flight BB456 from Gate 12 to Gate 15",
      type: "GATE_CHANGE",
      timestamp: "2024-01-15T16:45:00Z",
    },
    {
      message_author: "john_doe",
      message: "Boarding now for flight CC789 to Los Angeles",
      type: "BOARDING",
      timestamp: "2024-01-15T18:00:00Z",
    },
  ];

  const mockScheduledFlights: ScheduledFlight[] = [
    {
      scheduledType: "DELAY",
      delayTime: "2 hours",
      scheduledBy: "john_doe",
      flight: {
        id: "AA123",
        source: "JFK",
        oneWay: true,
        instantTicketingRequired: false,
        nonHomogeneous: false,
        isUpsellOffer: false,
        lastTicketingDate: "2024-01-16",
        lastTicketingDateTime: "2024-01-16T23:59:59Z",
        numberOfBookableSeats: 150,
        price: {
          currency: "USD",
          total: "299.99",
          base: "250.00",
          grandTotal: "299.99",
        },
        pricingOptions: {
          fareType: ["PUBLISHED"],
          includedCheckedBagsOnly: false,
        },
        validatingAirlineCodes: ["AA"],
        itineraries: [
          {
            duration: "PT5H30M",
            segments: [
              {
                id: "SEG1",
                duration: "PT5H30M",
                numberOfStops: 0,
                carrierCode: "AA",
                number: "123",
                blacklistedInEU: false,
                aircraft: { code: "737" },
                operating: { carrierCode: "AA" },
                departure: {
                  iataCode: "JFK",
                  at: "2024-01-16T08:00:00Z",
                  terminal: "4",
                },
                arrival: {
                  iataCode: "LAX",
                  at: "2024-01-16T13:30:00Z",
                  terminal: "1",
                },
              },
            ],
          },
        ],
        travelerPricings: [
          {
            travelerId: "1",
            fareOption: "STANDARD",
            travelerType: "ADULT",
            price: {
              currency: "USD",
              total: "299.99",
              base: "250.00",
            },
            fareDetailsBySegment: [
              {
                segmentId: "SEG1",
                cabin: "ECONOMY",
                brandedFare: "BASIC",
                brandedFareLabel: "Basic Economy",
                fareBasis: "Y",
                class: "Y",
              },
            ],
          },
        ],
      },
    },
  ];

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
        const time = new Date(
          flight.flight.itineraries[0].segments[0].departure.at
        ).getHours();
        acc[time] = (acc[time] || 0) + 1;
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      currentStaff = mockStaff;

      announcements = mockAnnouncements;

      scheduledFlights = mockScheduledFlights;
    } catch (error) {
      console.error("Error searching staff:", error);
    } finally {
      loading = false;
    }
  }

  function toggleBanStaff() {
    if (!currentStaff) return;

    if (currentStaff.banned) {
      // Remove ban
      currentStaff = {
        ...currentStaff,
        banned: false,
        ban_time: undefined,
      };
    } else {
      // Show ban modal
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
    const maxValue = Math.max(...data.map((d) => d.count));
    const width = 300;
    const height = 150;
    const padding = 20;

    return data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y =
        height - padding - (d.count / maxValue) * (height - 2 * padding);
      return { x, y, ...d };
    });
  }

  onMount(() => {
    // Initialize component
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
        onkeydown={(e) => e.key === "Enter" && searchStaff()}
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
            <svg viewBox="0 0 300 150" class="chart-svg">
              {#each chartPoints as point, i}
                <circle cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
                {#if i < chartPoints.length - 1}
                  <line
                    x1={point.x}
                    y1={point.y}
                    x2={chartPoints[i + 1].x}
                    y2={chartPoints[i + 1].y}
                    stroke="#3b82f6"
                    stroke-width="2"
                  />
                {/if}
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
            <svg viewBox="0 0 300 150" class="chart-svg">
              {#each chartPoints as point, i}
                <circle cx={point.x} cy={point.y} r="4" fill="#ef4444" />
                {#if i < chartPoints.length - 1}
                  <line
                    x1={point.x}
                    y1={point.y}
                    x2={chartPoints[i + 1].x}
                    y2={chartPoints[i + 1].y}
                    stroke="#ef4444"
                    stroke-width="2"
                  />
                {/if}
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
              <span class="value">{currentStaff.email}</span>
            </div>
            <div class="detail-item">
              <span class="label">Phone:</span>
              <span class="value">{currentStaff.phone}</span>
            </div>
            <div class="detail-item">
              <span class="label">Passport:</span>
              <span class="value">{currentStaff.passportno}</span>
            </div>
            <div class="detail-item">
              <span class="label">PAN Card:</span>
              <span class="value">{currentStaff.pancardno}</span>
            </div>
            <div class="detail-item">
              <span class="label">Tickets Booked:</span>
              <span class="value">{currentStaff.ticket_booked}</span>
            </div>
            <div class="detail-item">
              <span class="label">Recent Place:</span>
              <span class="value">{currentStaff.recent_place}</span>
            </div>
            <div class="detail-item">
              <span class="label">Amount Saved:</span>
              <span class="value">${currentStaff.amount_saved}</span>
            </div>
          </div>

          {#if currentStaff.banned}
            <div class="ban-notice">
              <span class="ban-icon">🚫</span>
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
