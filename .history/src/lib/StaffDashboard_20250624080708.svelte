<script lang="ts">
  import { onMount } from "svelte";
  import { LoginData } from "../store/LoginData";
  import { flightHistory, announcements } from "../store/dashboardData";
  import { fetchAnnouncements, fetchFlightHistory } from "../utils/api";

  onMount(() => {
    fetchAnnouncements();
    fetchFlightHistory();
    const interval = setInterval(fetchFlightHistory, 20000);
    return () => clearInterval(interval);
  });
</script>

<main class="dashboard">
  <aside class="sidebar">
    <button>DashBoard</button>
    <button>Boarding Pass</button>
    <button>Announcements</button>
    <button>Scheduling</button>
  </aside>

  <section class="main-content">
    <header class="navbar">
      <h1>AIRLINE COMPANY</h1>
      <div class="user-info">
        <p>Welcome, {@const u = $LoginData} {u?.username}</p>
      </div>
    </header>

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
        {#each $flightHistory as flight}
          <div class="flight-card">
            <p>{flight.route}</p>
            <small>{flight.duration}</small>
            <span class={flight.status}>{flight.status}</span>
          </div>
        {/each}
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
      {#each $announcements as note}
        <div class="announcement {note.type.toLowerCase()}">
          <strong>{note.type}:</strong>
          {note.message} — <em>{note.message_author}</em>
        </div>
      {/each}
    </section>
  </section>
</main>

<style>
  .dashboard {
    display: flex;
    height: 100vh;
    font-family: "Segoe UI", sans-serif;
  }

  .sidebar {
    width: 200px;
    background: #f1f1f1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .main-content {
    flex: 1;
    padding: 2rem;
    background: #fff;
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: #e6f9fd;
    padding: 1rem 2rem;
    border-radius: 12px;
    flex: 1;
  }

  .progress-bar {
    background: #ccc;
    border-radius: 8px;
    height: 8px;
    margin-top: 5px;
  }
  .progress-bar .fill {
    background: #04b0d3;
    height: 100%;
    border-radius: 8px;
  }

  .flight-history,
  .weather,
  .announcements {
    margin-bottom: 2rem;
  }

  .flight-items,
  .weather-scroll {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
  }

  .flight-card,
  .weather-card {
    background: #e6f9fd;
    padding: 1rem;
    border-radius: 8px;
    min-width: 150px;
  }

  .announcements .announcement {
    padding: 0.75rem;
    margin: 0.5rem 0;
    border-radius: 6px;
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
