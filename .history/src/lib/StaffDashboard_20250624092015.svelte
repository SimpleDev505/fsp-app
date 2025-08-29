<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { LoginData } from "./Store/login";
  import Nav from "./Nav.svelte";
  import { fetchFlightStatus, flightStats } from "./Store/dash";

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

  const Announcements = writable<Announcement[]>([]);
  const OnTimePercent = writable(95);
  const CrewOnDuty = writable(43);
  const activeSection = writable("dashboard");
  let flightstat = $derived($flightStats);
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

  onMount(() => {
    document.body.style.overflow = "hidden";
    fetchAnnouncements();
    fetchFlightStatus();
    // const interval = setInterval(fetchFlightStatus, 60000);
    // return () => clearInterval(interval);
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

  <Nav></Nav>
  <main class="staff-dash-content">
    {#if $activeSection === "dashboard"}
      <div class="top-bar">
        <h1>AIRLINE COMPANY</h1>
        <div class="staff-info">
          <span>Welcome, Staff 321</span>
          <button class="logout">LogOut ⚙️</button>
        </div>
      </div>

      <section class="stats-row">
        <div class="stat-card">
          <h3>TODAY</h3>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
        <div class="stat-card">
          <h3>CREW ON DUTY</h3>
          <p>43</p>
        </div>
        <div class="stat-card">
          <h3>TOTAL FLIGHTS</h3>
          <p>87</p>
        </div>
      </section>

      <section class="stats-row">
        <div class="stat-card flight-status">
          <h3>FLIGHT STATUS</h3>
          <p>{(flightstat.probability * 100).toFixed(2)}% On Time</p>
          <div class="progress-bar">
            <div
              class="fill"
              style="width: {flightstat.probability * 100}%"
            ></div>
          </div>
          <div class="status-metrics">
            <div class="count-box green">✔ {flightstat.onTimeCount}</div>
            <div class="count-box yellow">⏱ {flightstat.delayedCount}</div>
            <div class="count-box red">✖ {flightstat.cancelledCount}</div>
          </div>
        </div>
        <div class="stat-card">
          <h3>BOOKED TODAY</h3>
          <p>12</p>
        </div>
      </section>

      <section class="dashboard-lower">
        <div class="flight-history">
          <h2>FLIGHT HISTORY</h2>
          <div class="flight-items">
            <div class="flight-card">
              <p>WRO - STN</p>
              <small>FR - 8084 | 2h 15m</small>
              <span class="status-tag green">OnTime</span>
            </div>
            <div class="flight-card">
              <p>WRO - STN</p>
              <small>FR - 8084 | 2h 15m</small>
              <span class="status-tag yellow">Delayed</span>
            </div>
            <div class="flight-card">
              <p>WRO - STN</p>
              <small>FR - 8084 | 2h 15m</small>
              <span class="status-tag green">OnTime</span>
            </div>
          </div>
        </div>

        <div class="weather-announcements">
          <section class="weather">
            <div class="weather-header">
              <h2>WEATHER</h2>
              <small>Updated every 10s</small>
              <button class="refresh-btn">⟳</button>
            </div>
            <div class="weather-scroll">
              {#each dummyWeather as w}
                <div class="weather-card">
                  {w.time}
                  {w.temp}
                  {w.condition}
                  {w.duration}
                </div>
              {/each}
            </div>
          </section>

          <section class="announcements">
            <h2>GLOBAL ANNOUNCEMENTS</h2>
            <div class="announcement alert">
              <strong>Weather Alert:</strong> Flights to Northern Europe may be delayed
              due to heavy snowfall.
            </div>
            <div class="announcement important">
              <strong>System Maintenance:</strong> Online check-in services down
              9:00–3:00 on June 17.
            </div>
            <div class="announcement alert">
              <strong>Policy Update:</strong> New baggage rules from 20 June. Please
              refer SOP.
            </div>
          </section>
        </div>
      </section>
    {:else if $activeSection === "boarding"}
      <h2>Boarding Pass Page</h2>
    {:else if $activeSection === "announcements"}
      <h2>Announcements Page</h2>
    {:else if $activeSection === "scheduling"}
      <h2>Scheduling Page</h2>
    {/if}
  </main>
</div>

<style>
  .dashboard {
    display: flex;
    height: 100%;
    width: 100%;
    font-family: "Segoe UI", sans-serif;
    background-color: #f8f9fa;
    margin-top: 40px;
    overflow: hidden;
  }

  .staff-dash-content {
    width: 100%;
    padding: 2rem;
    overflow-y: auto;
  }

  /* Top Cards */
  .stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: #e6faff;
    padding: 1.2rem 1.5rem;
    border-radius: 12px;
    flex: 1;
    margin-right: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }

  .stat-card:last-child {
    margin-right: 0;
  }

  .stat-card h3 {
    font-weight: bold;
    color: var(--blue-dark);
    margin-bottom: 0.5rem;
  }

  .stat-card p {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--grey-dark);
  }

  .progress-bar {
    height: 8px;
    background: var(--grey-light);
    border-radius: 6px;
    overflow: hidden;
    margin-top: 0.4rem;
  }

  .progress-bar .fill {
    height: 100%;
    background: var(--blue);
    border-radius: 6px 0 0 6px;
  }

  /* Flight History */
  .flight-history {
    margin-bottom: 2rem;
  }

  .flight-history h2 {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .flight-items {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .flight-card {
    background: #e6faff;
    padding: 1rem;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  }

  .flight-card .status {
    padding: 0.3rem 0.7rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: capitalize;
  }

  .flight-card .on-time {
    background: #d4edda;
    color: #155724;
  }

  .flight-card .delayed {
    background: #fff3cd;
    color: #856404;
  }

  .flight-card .cancelled {
    background: #f8d7da;
    color: #721c24;
  }

  /* Weather Section */
  .weather {
    margin-bottom: 2rem;
  }

  .weather h2 {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 0.8rem;
  }

  .weather-scroll {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
  }

  .weather-card {
    min-width: 160px;
    background: var(--blue);
    color: white;
    font-weight: 500;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  /* Announcements Section */
  .announcements {
    margin-bottom: 2rem;
  }

  .announcements h2 {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .announcement {
    background: #fff;
    border-left: 5px solid #ccc;
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }

  .announcement.alert {
    border-color: var(--yellow);
  }

  .announcement.delay {
    border-color: var(--red);
  }

  .announcement.cancel {
    border-color: var(--red);
  }

  .announcement.important {
    border-color: var(--blue);
  }
</style>
