<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { LoginData } from "./Store/login";
  import Nav from "./Nav.svelte";

  // Interfaces
  interface Announcement {
    _id: string;
    message_author: string;
    message: string;
    type: "DELAY" | "CANCEL" | "ALERT" | "IMPORTANT";
  }
  interface FlightHistoryItem {
    route: string;
    code: string;
    duration: string;
    status: string;
  }

  // Writable stores
  const Announcements = writable<Announcement[]>([]);
  const FlightHistory = writable<FlightHistoryItem[]>([]);
  const OnTimePercent = writable(95);
  const CrewOnDuty = writable(43);
  const activeSection = writable("dashboard");

  // Dummy Weather
  const dummyWeather = [
    { time: "Now", temp: "16 C", condition: "☀️", duration: "2hrs" },
    { time: "8:30 AM", temp: "16 C", condition: "🌤️", duration: "2hrs" },
    { time: "9:30 AM", temp: "18 C", condition: "🌦️", duration: "2hrs" },
  ];

  // Fetch announcements
  async function fetchAnnouncements() {
    const res = await fetch("http://localhost:8080/api/announcements");
    const data = await res.json();
    Announcements.set(data);
  }

  // Fetch flight history (replace with Amadeus API later)
  async function fetchFlightHistory() {
    // Simulated
    FlightHistory.set([
      {
        route: "WRO - STN",
        code: "FR - 8084",
        duration: "2h 15m",
        status: "OnTime",
      },
      {
        route: "WRO - STN",
        code: "FR - 8084",
        duration: "2h 15m",
        status: "Delayed",
      },
      {
        route: "WRO - STN",
        code: "FR - 8084",
        duration: "2h 15m",
        status: "OnTime",
      },
    ]);
  }

  onMount(() => {
    fetchAnnouncements();
    fetchFlightHistory();
    const interval = setInterval(fetchFlightHistory, 20000);
    return () => clearInterval(interval);
  });
</script>

<!-- Sidebar -->
<div class="dashboard">
  <aside class="sidebar">
    <button on:click={() => activeSection.set("dashboard")}>DashBoard</button>
    <button on:click={() => activeSection.set("boarding")}>Boarding Pass</button
    >
    <button on:click={() => activeSection.set("announcements")}
      >Announcements</button
    >
    <button on:click={() => activeSection.set("scheduling")}>Scheduling</button>
  </aside>

  <!-- Main Content -->
  <Nav></Nav>
  <main class="staff-dash-content">
    {#if $activeSection === "dashboard"}
      <section class="stats">
        <div class="stat-card">
          <h3>CREW ON DUTY</h3>
          <p>43</p>
        </div>
        <div class="stat-card">
          <h3>FLIGHT STATUS</h3>
          <p>95% On Time</p>
          <div class="progress-bar">
            <div class="fill" style="width: 95%"></div>
          </div>
        </div>
        <div class="stat-card">
          <h3>BOOKED TODAY</h3>
          <p>12</p>
        </div>
      </section>

      <section class="flight-history">
        <h2>FLIGHT HISTORY</h2>
        <div class="flight-items">
          <!-- {#each $flightHistory as flight}
            <div class="flight-card">
              <p>{flight.route}</p>
              <small>{flight.duration}</small>
              <span class={flight.status}>{flight.status}</span>
            </div>
          {/each} -->
        </div>
      </section>

      <section class="weather">
        <h2>WEATHER</h2>
        <div class="weather-scroll">
          <div class="weather-card">Now 16°C ☀️ 2hrs</div>
          <div class="weather-card">8:30 AM 16°C 🌤 2hrs</div>
          <div class="weather-card">9:30 AM 18°C 🌧 2hrs</div>
        </div>
      </section>

      <section class="announcements">
        <h2>GLOBAL ANNOUNCEMENTS</h2>
        <!-- {#each $announcements as note}
          <div class="announcement {note.type.toLowerCase()}">
            <strong>{note.type}:</strong>
            {note.message} — <em>{note.message_author}</em>
          </div>
        {/each} -->
      </section>
    {:else if $activeSection === "boarding"}
      <h2>Boarding Pass Page</h2>
      <p>Content for boarding pass goes here...</p>
    {:else if $activeSection === "announcements"}
      <h2>Announcements Page</h2>
      <p>Custom announcements view here...</p>
    {:else if $activeSection === "scheduling"}
      <h2>Scheduling Page</h2>
      <p>Scheduling content goes here...</p>
    {/if}
  </main>
</div>

<style>
  :global(body) {
    overflow: hidden;
  }
  .dashboard {
    display: flex;
    height: 100vh;
    font-family: "Segoe UI", sans-serif;
    background-color: #f8f9fa;
    margin-top: 40px;
  }
  .staff-dash-content {
    overflow: hidden;
    width: 100%;
  }
  /* SIDEBAR */
  .sidebar {
    width: 220px;
    background: #0f9fcf;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
  .sidebar button {
    background: white;
    border: none;
    border-radius: 6px;
    padding: 0.8rem 1rem;
    text-align: left;
    font-weight: 600;
    color: #0f9fcf;
    cursor: pointer;
    transition: 0.2s;
  }
  .sidebar button:hover {
    background: #d9f3fc;
  }

  /* MAIN CONTENT */
  .main-content {
    flex: 1;
    padding: 2rem 3rem;
    overflow-y: auto;
  }

  /* NAVBAR */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  .navbar h1 {
    font-size: 2rem;
    color: #0f9fcf;
  }
  .user-info {
    font-size: 1rem;
    color: #333;
  }

  /* STATS CARDS */
  .stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 2.5rem;
  }
  .stat-card {
    background: #e6f9fd;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    flex: 1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  .stat-card h3 {
    margin-bottom: 0.5rem;
    color: #055e77;
  }

  /* PROGRESS BAR */
  .progress-bar {
    background: #ccc;
    border-radius: 8px;
    height: 10px;
    margin-top: 8px;
    width: 100%;
  }
  .progress-bar .fill {
    background: #04b0d3;
    height: 100%;
    border-radius: 8px;
  }

  /* SECTIONS */
  .flight-history,
  .weather,
  .announcements {
    margin-bottom: 2rem;
  }
  .flight-history h2,
  .weather h2,
  .announcements h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #222;
  }

  /* FLIGHT CARDS */
  .flight-items {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
  }
  .flight-card {
    background: #ffffff;
    padding: 1rem;
    border-radius: 8px;
    min-width: 200px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .flight-card span {
    font-weight: bold;
  }
  .flight-card .OnTime {
    color: green;
  }
  .flight-card .Delayed {
    color: orange;
  }
  .flight-card .Cancelled {
    color: red;
  }

  /* WEATHER CARDS */
  .weather-scroll {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
  }
  .weather-card {
    background: #04b0d3;
    color: white;
    padding: 1rem;
    border-radius: 10px;
    min-width: 140px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  /* ANNOUNCEMENTS */
  .announcement {
    padding: 0.8rem 1rem;
    border-radius: 6px;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  }
  .announcement.alert {
    background: #ffe0e0;
    color: #b30000;
  }
  .announcement.delay {
    background: #fff4cc;
    color: #8a6d00;
  }
  .announcement.cancel {
    background: #ffe6cc;
    color: #b36b00;
  }
  .announcement.important {
    background: #e6f7ff;
    color: #005580;
  }
</style>
