<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { LoginData } from "./Store/login";
  import Nav from "./Nav.svelte";
  import {
    fetchFlightStatus,
    fetchWeather,
    flightStats,
    weatherInfo,
    type WeatherInfo,
  } from "./Store/dash";
  import AnnounceCard from "./AnnounceCard.svelte";

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
  let loggeddata = $derived($LoginData);
  let weatherstat: WeatherInfo = $derived($weatherInfo);
  // Fetch announcements
  async function fetchAnnouncements() {
    const res = await fetch("http://localhost:8080/api/announcements");
    const data = await res.json();
    Announcements.set(data);
  }

  onMount(() => {
    document.body.style.overflow = "hidden";
    fetchAnnouncements();
    //Stats----------------
    fetchFlightStatus();
    // const interval = setInterval(fetchFlightStatus, 60000);
    // return () => clearInterval(interval);
    //Weather--------------
    document.addEventListener("scroll", navhandle);
    fetchWeather();
    // const interval = setInterval(fetchWeather, 15000);
    // return () => clearInterval(interval);
    //Announcements -------------
    fetchAnnouncements();
    // const interval = setInterval(fetchWeather, 15000);
    // return () => clearInterval(interval);
  });

  function navhandle() {
    // const t = document.getElementById("top-bar-info");
    // if (t) {
    //   if (window.top > 100) {
    //     t.classList.remove("top-nonsticky");
    //     t.classList += " top-sticky";
    //   } else {
    //     t.classList.remove("top-sticky");
    //     t.classList += " top-nonsticky";
    //   }
    // }
  }

  function GetWeatherIcon(name: string): string {
    let icon = "progress_activity";
    if (name === "Sunny") {
      icon = "clear_day";
    } else if (name === "Partly cloudy") {
      icon = "partly_cloudy_day";
    } else if (name === "Cloudy") {
      icon = "cloud";
    } else if (name.toLowerCase().includes("rain")) {
      icon = "rainy";
    }

    return icon;
  }
</script>

<div class="dashboard">
  <aside class="sidebar">
    <button
      class={$activeSection === "dashboard" ? "sidebar-selected" : ""}
      onclick={() => activeSection.set("dashboard")}
    >
      DashBoard
      {#if $activeSection === "dashboard"}
        <span class="material-symbols-outlined"> arrow_forward_ios </span>
      {/if}
    </button>
    <button
      class={$activeSection === "boarding" ? "sidebar-selected" : ""}
      onclick={() => activeSection.set("boarding")}
    >
      Boarding Pass
      {#if $activeSection === "boarding"}
        <span class="material-symbols-outlined"> arrow_forward_ios </span>
      {/if}
    </button>
    <button
      class={$activeSection === "announcements" ? "sidebar-selected" : ""}
      onclick={() => activeSection.set("announcements")}
    >
      Announcements
      {#if $activeSection === "announcements"}
        <span class="material-symbols-outlined"> arrow_forward_ios </span>
      {/if}
    </button>
    <button
      class={$activeSection === "scheduling" ? "sidebar-selected" : ""}
      onclick={() => activeSection.set("scheduling")}
    >
      Scheduling
      {#if $activeSection === "scheduling"}
        <span class="material-symbols-outlined"> arrow_forward_ios </span>
      {/if}
    </button>
  </aside>

  <Nav></Nav>
  <main class="staff-dash-content">
    {#if $activeSection === "dashboard"}
      <div class="top-bar top-nonsticky" id="top-bar-info">
        <div class="staff-info">
          <span class="logout">Welcome, {loggeddata?.username}</span>
          <button class="logout">
            Profile
            <span class="material-symbols-outlined"> account_circle </span>
          </button>
        </div>
      </div>

      <section class="stats-row">
        <div class="stat-card">
          <h3>
            <span class="material-symbols-outlined"> calendar_month </span>
            TODAY
          </h3>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
        <div class="stat-card">
          <h3>
            <span class="material-symbols-outlined"> support_agent </span>
            CREW ON DUTY
          </h3>
          <p>43</p>
        </div>
        <div class="stat-card">
          <h3>
            <span class="material-symbols-outlined"> plane_contrails </span>
            TOTAL FLIGHTS
          </h3>
          <p>87</p>
        </div>
        <div class="stat-card">
          <h3>
            <span class="material-symbols-outlined"> airplane_ticket </span>
            BOOKED TODAY
          </h3>
          <p>12</p>
        </div>
        <div class="stat-card flight-status">
          <h3>
            <span class="material-symbols-outlined"> travel </span>
            FLIGHT STATUS
          </h3>
          <p>{(flightstat.probability * 100).toFixed(2)}% On Time</p>
          <div class="progress-bar">
            <div
              class="fill"
              style="width: {flightstat.probability * 100}%"
            ></div>
          </div>
          <div class="status-metrics">
            <div class="count-box green">
              <span class="material-symbols-outlined"> schedule </span>
              {flightstat.onTimeCount}
              <p style="font-size: var(--font-s); margin: 0;">On Time</p>
            </div>
            <div class="count-box yellow">
              <span class="material-symbols-outlined">
                running_with_errors
              </span>
              {flightstat.delayedCount}
              <p style="font-size: var(--font-s); margin: 0;">Delayed</p>
            </div>
            <div class="count-box red">
              <span class="material-symbols-outlined"> block </span>
              {flightstat.cancelledCount}
              <p style="font-size: var(--font-s); margin: 0;">Cancelled</p>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-row">
        <div class="flight-history">
          <h2 style="color: var(--blue);">FLIGHT HISTORY</h2>
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
            <div class="flight-card">
              <p>WRO - STN</p>
              <small>FR - 8084 | 2h 15m</small>
              <span class="status-tag green">OnTime</span>
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
              <small style="color: var(--grey-dark);">Updated every 10s</small>
              <button class="refresh-btn" onclick={() => fetchWeather()}
                ><span class="material-symbols-outlined">
                  autorenew
                </span></button
              >
            </div>
            <div class="weather-scroll">
              {#each weatherstat.forecast as w}
                <div class="weather-card">
                  <span style="font-size: var(--font-sm); font-weight: normal;"
                    ><strong>Date</strong> {w.date}</span
                  >
                  <p style="width: 100%;text-align:center; font-size: larger;">
                    {w.temperatureCelsius}
                    <strong style="font-size: 32px; color: var(--blue-dark);"
                      >C</strong
                    >
                  </p>
                  <p>{w.weatherType}</p>
                  <span
                    style="width: 100%; text-align:center; font-size: 32px;"
                    class="material-symbols-outlined"
                  >
                    {#if w.weatherType}
                      {GetWeatherIcon(w.weatherType)}
                    {/if}
                  </span>
                </div>
              {/each}
            </div>
          </section>
        </div>
        <section class="announcements">
          <h2 style="color: var(--blue);">GLOBAL ANNOUNCEMENTS</h2>
          <div class="announcements-scroll">
            {#each $Announcements as ann}{/each}
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
            <div class="announcement important">
              <strong>System Maintenance:</strong> Online check-in services down
              9:00–3:00 on June 17.
            </div>
            <div class="announcement alert">
              <strong>Policy Update:</strong> New baggage rules from 20 June. Please
              refer SOP.
            </div>
            <div class="announcement important">
              <strong>System Maintenance:</strong> Online check-in services down
              9:00–3:00 on June 17.
            </div>
            <div class="announcement alert">
              <strong>Policy Update:</strong> New baggage rules from 20 June. Please
              refer SOP.
            </div>
            <div class="announcement important">
              <strong>System Maintenance:</strong> Online check-in services down
              9:00–3:00 on June 17.
            </div>
            <div class="announcement alert">
              <strong>Policy Update:</strong> New baggage rules from 20 June. Please
              refer SOP.
            </div>
          </div>
        </section>
      </section>

      <section class="dashboard-lower"></section>
    {:else if $activeSection === "boarding"}
      <h2>Boarding Pass Page</h2>
    {:else if $activeSection === "announcements"}
      <h2>Announcements Page</h2>
      <AnnounceCard></AnnounceCard>
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
    overflow-x: hidden;
    overflow-y: hidden;
    width: 100%;
  }

  /* SIDEBAR */
  .sidebar {
    width: 220px;
    background: var(--blue);
    padding: 5rem 0;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    row-gap: 15px;
  }

  .sidebar button {
    background: transparent;
    border: none;
    padding: 1rem 1rem;
    text-align: left;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: 0.2s;
  }
  .sidebar-selected {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--blue-dark) !important;
  }
  .sidebar-selected span {
    font-size: var(--font-s);
  }
  .sidebar button:hover {
    background: var(--blue-dark);
    color: white;
  }

  /* TOP BAR */
  .top-bar {
    background: var(--blue);
    color: white;
    padding: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  }
  .top-sticky {
    position: absolute;
  }
  .top-nonsticky {
    position: relative;
  }

  .staff-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logout {
    background: white;
    border: none;
    color: var(--blue);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
    outline: 3px solid var(--grey-light);
  }
  .logout:hover {
    outline: 2px solid var(--blue-dark);
  }

  /* STATS ROW */
  .stats-row {
    display: flex;
    gap: 1rem;
    padding: 1rem 2rem;
  }

  .stat-card {
    background: white;
    padding: 10px 1rem;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    height: fit-content;
    width: fit-content;
    outline: 3px solid var(--grey-light);
    transition: 0.1s ease-in-out;
  }
  .stat-card:hover {
    outline: 3px solid var(--blue-dark) !important;
  }

  .stat-card h3 {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    column-gap: 10px;
    font-weight: 700;
    color: var(--blue-dark);
    margin-bottom: 0.5rem;
    width: fit-content;
    height: fit-content;
    font-size: var(--font-sm);
  }

  .stat-card p {
    font-size: 1rem;
    font-weight: 600;
    color: var(--grey-dark);
    height: fit-content;
    width: fit-content;
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

  .flight-status .status-metrics {
    display: flex;
    justify-content: space-between;
    column-gap: 10px;
    margin-top: 0.8rem;
  }

  .count-box {
    background: #f0f0f0;
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    column-gap: 5px;
  }

  .count-box.green {
    color: green;
  }

  .count-box.yellow {
    color: #e6a900;
  }

  .count-box.red {
    color: red;
  }

  /* LOWER SECTION: HISTORY + WEATHER + ANNOUNCEMENTS */
  .dashboard-lower {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1rem 2rem;
  }

  .flight-history {
    flex: 1;
    max-width: 100%;
    background-color: white;
    padding: 1em;
    outline: 3px solid var(--grey-light);
    border-radius: 10px;
    height: 24em;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  .flight-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
    max-height: 23em;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--blue-dark) transparent;
  }

  .flight-card {
    background: var(--blue-dark);
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
    outline: 3px solid var(--grey-light);
    color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }
  .flight-card:hover {
    outline: 2px solid var(--yellow);
    scale: 0.98;
  }

  .flight-card span.status-tag {
    float: right;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .status-tag.green {
    background: #c6f6d5;
    color: green;
  }

  .status-tag.yellow {
    background: #fff3cd;
    color: #856404;
  }

  .status-tag.red {
    background: #f8d7da;
    color: red;
  }
  .weather {
    width: fit-content;
    margin: 0 0 0 auto;
    height: fit-content;
  }

  .weather-announcements {
    flex: 1;
    max-width: 45em;
    width: fit-content;
    height: 24em;
    outline: 3px solid var(--grey-light);
    padding: 1em;
    overflow: hidden;
    border-radius: 10px;
    background: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  }

  /* WEATHER */
  .weather-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5em;
    max-width: 25em;
    color: var(--blue);
  }

  .weather-scroll {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 1rem 0.5em;
    max-width: 45em;
    margin: 0 0 0 auto;
    scrollbar-width: thin;
    scrollbar-color: var(--blue) transparent;
  }

  .weather-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 160px;
    background: var(--blue);
    color: white;
    font-weight: 500;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
    outline: 3px solid var(--grey-light);
    cursor: pointer;
    transition: 0.2s ease-in-out;
    row-gap: 5px;
  }
  .weather-card > * {
    margin: 0;
  }
  .weather-card:hover {
    scale: 0.95;
    outline: 3px solid var(--yellow);
  }

  .refresh-btn {
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
  }

  /* ANNOUNCEMENTS */
  .announcements {
    margin-top: 2rem;
    height: 24em;
    outline: 3px solid var(--grey-light);
    border-radius: 10px;
    padding: 0.5em 1em;
    overflow: hidden;
    max-width: 25em;
    margin: 0 0 0 auto;
  }
  .announcements-scroll {
    overflow-y: scroll;
    padding: 0 1em;
    height: 100%;
    scrollbar-width: thin;
    scrollbar-color: var(--blue-dark) transparent;
  }

  .announcement {
    background: #fff;
    border-left: 5px solid #ccc;
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    outline: 3px solid var(--grey-light);
    transition: 0.2s ease-in-out;
    cursor: pointer;
  }
  .announcement:hover {
    scale: 0.95 1;
  }

  .announcement.alert {
    border-color: var(--yellow);
  }
  .announcement.alert:hover {
    outline: 3px solid var(--yellow);
  }

  .announcement.delay {
    border-color: var(--red);
  }
  .announcement.delay:hover {
    outline: 3px solid var(--red);
  }

  .announcement.cancel {
    border-color: var(--red);
  }
  .announcement.cancel:hover {
    outline: 3px solid var(--red);
  }

  .announcement.important {
    border-color: var(--blue);
  }
  .announcement.important:hover {
    outline: 3px solid var(--blue);
  }
</style>
