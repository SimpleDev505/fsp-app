<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { LoginData } from "./Store/login";
  import Nav from "./Nav.svelte";
  import { fetchFlightStatus } from "./Store/dash";

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

  /* Stats Section */
  .stats {
    display: flex;
    gap: 1.5rem;
    margin: 1.5rem 0;
  }
  .stat-card {
    flex: 1;
    background: #e6faff;
    padding: 1.2rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  .stat-card h3 {
    font-weight: 700;
    color: #004d66;
    margin-bottom: 0.5rem;
  }
  .stat-card p {
    font-size: 1.2rem;
    font-weight: 600;
    color: #222;
  }

  .progress-bar {
    height: 8px;
    background: #ccc;
    border-radius: 6px;
    overflow: hidden;
    margin-top: 0.4rem;
  }
  .progress-bar .fill {
    height: 100%;
    background: #04b0d3;
    border-radius: 6px 0 0 6px;
  }

  /* Weather Cards */
  .weather-scroll {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 1rem 0;
  }
  .weather-card {
    min-width: 160px;
    background: #04b0d3;
    color: white;
    font-weight: 500;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  /* Announcements */
  .announcements {
    margin-top: 2rem;
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
    border-color: #f5a623;
  }
  .announcement.delay {
    border-color: #ff6f61;
  }
  .announcement.cancel {
    border-color: #d9534f;
  }
  .announcement.important {
    border-color: #5bc0de;
  }

  /* Flight History*/
  .flight-history {
    margin-top: 2rem;
  }
  .flight-items {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .flight-card {
    background: #e6faff;
    padding: 1rem;
    border-radius: 10px;
    min-width: 160px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  }
  .flight-card span {
    font-weight: bold;
  }
</style>
