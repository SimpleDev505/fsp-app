<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { LoginData } from "./Store/login";

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
    <button>DashBoard</button>
    <button>Boarding Pass</button>
    <button>Announcements</button>
    <button>Scheduling</button>
  </aside>

  <!-- Main Content -->
  <main class="content">
    <header>
      <h1>AIRLINE COMPANY</h1>
      <div class="user-info">
        <span>Welcome, {$LoginData?.username}</span>
        <img src={$LoginData?.photo} alt="user" />
      </div>
    </header>

    <section class="stats">
      <div class="card">
        <h3>CREW ON DUTY</h3>
        <p>{$CrewOnDuty}</p>
      </div>
      <div class="card">
        <h3>FLIGHT STATUS</h3>
        <p>{$OnTimePercent}% On Time</p>
        <progress max="100" value={$OnTimePercent}></progress>
      </div>
      <div class="card">
        <h3>BOOKED TODAY</h3>
        <p>12</p>
      </div>
    </section>

    <section class="flight-history">
      <h3>FLIGHT HISTORY</h3>
      {#each $FlightHistory as flight (flight.code)}
        <div class="flight-card">
          <span>{flight.route}</span>
          <span>{flight.code}</span>
          <span>{flight.duration}</span>
          <span class={flight.status.toLowerCase()}>{flight.status}</span>
        </div>
      {/each}
    </section>

    <section class="weather">
      <h3>WEATHER</h3>
      <div class="weather-scroll">
        {#each dummyWeather as w (w.time)}
          <div class="weather-card">
            <span>{w.time}</span>
            <span>{w.temp}</span>
            <span>{w.condition}</span>
            <span>{w.duration}</span>
          </div>
        {/each}
      </div>
    </section>

    <section class="announcements">
      <h3>GLOBAL ANNOUNCEMENTS</h3>
      {#each $Announcements as note (note._id)}
        <div class="note {note.type.toLowerCase()}">
          <strong>{note.type}:</strong>
          {note.message}
        </div>
      {/each}
    </section>
  </main>
</div>

<style>
  .dashboard {
    display: flex;
    height: 100vh;
    font-family: sans-serif;
  }
  .sidebar {
    background: #f5f5f5;
    padding: 1rem;
    width: 220px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-right: 1px solid #ccc;
  }
  .content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .user-info img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
  .stats {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  .card {
    flex: 1;
    background: #e0f7fa;
    padding: 1rem;
    border-radius: 8px;
  }
  .flight-history,
  .announcements,
  .weather {
    margin-top: 2rem;
  }
  .flight-card,
  .note {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .note.alert {
    background: #fff3cd;
  }
  .note.delay {
    background: #ffe0e0;
  }
  .note.cancel {
    background: #ffe0e0;
  }
  .note.important {
    background: #d1ecf1;
  }
  .weather-scroll {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 1rem 0;
  }
  .weather-card {
    min-width: 120px;
    background: #cceeff;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }
  .ontime {
    color: green;
  }
  .delayed {
    color: orange;
  }
  .cancelled {
    color: red;
  }
</style>
