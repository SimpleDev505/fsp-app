<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { GetUserData, LoginData } from "./Store/login";
  import Nav from "./Nav.svelte";
  import { gsap } from "gsap";
  import {
    fetchFlightStatus,
    fetchWeather,
    flightStats,
    LoadingType,
    weatherInfo,
    type WeatherInfo,
  } from "./Store/dash";
  import AnnounceCard from "./AnnounceCard.svelte";
  import { Announcements, fetchLatestAnnouncements } from "./Store/announce";
  import BoardingPassCard from "./BoardingPassCard.svelte";
  import SchedulingPage from "./SchedulingPage.svelte";
  import { LoadLatestScheduledFlights, schFlights } from "./Store/schedule";
  import StaffManage from "./StaffManage.svelte";
  import { CurrentAppPage } from "./Store/store";

  const activeSection = writable("dashboard");
  let flightstat = $derived($flightStats);
  let loggeddata = $derived($LoginData);
  let weatherstat: WeatherInfo = $derived($weatherInfo);
  let anns = $derived($Announcements);
  // Fetch announcements

  onMount(() => {
    document.body.style.overflow = "hidden";
    //Stats----------------
    fetchFlightStatus();
    // const interval1 = setInterval(fetchFlightStatus, 60000);
    // return () => clearInterval(interval1);
    //Weather--------------
    document.addEventListener("scroll", navhandle);
    fetchWeather();
    // const interval2 = setInterval(fetchWeather, 15000);
    // return () => clearInterval(interval2);
    //Announcements -------------
    fetchLatestAnnouncements();
    // const interval3 = setInterval(fetchAnnouncements, 15000);
    // return () => clearInterval(interval3);
    LoadLatestScheduledFlights();
    gsap.fromTo(
      ".announcement",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 1,
        ease: "circ.inOut",
      }
    );

    setInterval(async () => {
      if ($LoginData?.user_type === "STAFF" && $LoginData.id) {
        const banned = await GetUserData($LoginData.id, "banned");
        if (banned) {
          $CurrentAppPage = "LOGIN";
        }
      }
    }, 10000);
  });
  $effect(() => {
    if ($LoadingType === "HISTORY") {
      gsap.fromTo(
        ".flight-items > *",
        {
          opacity: 0,
          y: 30,
        },
        {
          duration: 0.6,
          stagger: 0.2,
          ease: "back.inOut",
          opacity: 1,
          y: 0,
        }
      );
    }
  });
  function formatDate(date: string | number | Date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
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
    {#if $LoginData?.user_type === "ADMIN"}
      <button
        class={$activeSection === "staffmanage" ? "sidebar-selected" : ""}
        onclick={() => activeSection.set("staffmanage")}
      >
        Manage Staff
        {#if $activeSection === "staffmanage"}
          <span class="material-symbols-outlined"> arrow_forward_ios </span>
        {/if}
      </button>
    {/if}
  </aside>

  <Nav></Nav>
  <main class="staff-dash-content">
    <div class="top-bar top-nonsticky" id="top-bar-info">
      <div class="staff-info">
        <span class="logout">Welcome, {loggeddata?.username}</span>
      </div>
    </div>

    {#if $activeSection === "dashboard"}
      <section class="stats-row">
        <div class="stat-card">
          <h3
            style="display: flex; justify-content: space-between; align-items: center; background-color: var(--blue-dark); width: 100%;
          padding: 5px; color: white; border-radius: 3px;
          font-size: var(--font-sm);"
          >
            <span class="material-symbols-outlined"> calendar_month </span>
            TODAY
          </h3>
          <p>{new Date().toLocaleDateString().replaceAll("/", "-")}</p>
        </div>
        <div class="stat-card">
          <h3
            style="display: flex; justify-content: space-between; align-items: center; background-color: var(--blue-dark); width: 100%;
          padding: 5px; color: white; border-radius: 3px;
          font-size: var(--font-sm);"
          >
            <span class="material-symbols-outlined"> support_agent </span>
            CREW ON DUTY
          </h3>
          <p>43</p>
        </div>
        <div class="stat-card">
          <h3
            style="display: flex; justify-content: space-between; align-items: center; background-color: var(--blue-dark); width: 100%;
          padding: 5px; color: white; border-radius: 3px;
          font-size: var(--font-sm);"
          >
            <span class="material-symbols-outlined"> plane_contrails </span>
            TOTAL FLIGHTS
          </h3>
          <p>87</p>
        </div>
        <div class="stat-card">
          <h3
            style="display: flex; justify-content: space-between; align-items: center; background-color: var(--blue-dark); width: 100%;
          padding: 5px; color: white; border-radius: 3px;
          font-size: var(--font-sm);"
          >
            <span class="material-symbols-outlined"> airplane_ticket </span>
            BOOKED TODAY
          </h3>
          <p>12</p>
        </div>
        <div class="stat-card flight-status">
          <h3
            style="display: flex; justify-content: space-between; align-items: center; background-color: var(--blue-dark); width: 100%;
          padding: 10px; color: white; border-radius: 3px;
          font-size: var(--font-sm);"
          >
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
          <h2
            style="background-color: var(--blue-dark); width: 100%;
          padding: 10px; color: white; border-radius: 3px;
          font-size: var(--font-sm); display: flex; justify-content: space-between;
          align-items: center;"
          >
            FLIGHT HISTORY
            <button
              disabled={$LoadingType === "HISTORY"}
              class="refresh-btn"
              onclick={() => {
                $LoadingType = "HISTORY";
                LoadLatestScheduledFlights();
              }}
              ><span class="material-symbols-outlined">
                autorenew
              </span></button
            >
          </h2>
          <div class="flight-items">
            {#if $schFlights}
              {#each $schFlights as flight}
                {#if flight.flight.itineraries[0] && flight.flight.itineraries[0].segments[0]}
                  <div class="flight-card">
                    {#if flight.scheduledType === "DELAY" || flight.scheduledType === "RESCHEDULED"}
                      <p
                        style="position: absolute; right: -1px; background-color: white;
                        padding: 4px; color: var(--blue-dark); border-top-left-radius: 4px; border-bottom-left-radius: 4px;
                        top: 0;"
                      >
                        Gate {flight.flight.itineraries[0].segments[0].arrival
                          .terminal}
                      </p>
                    {/if}
                    <p>
                      {flight.flight.itineraries[0].segments[0].departure
                        .iataCode} - {flight.flight.itineraries[0].segments[0]
                        ?.arrival.iataCode}
                    </p>
                    <small
                      >{flight.flight.itineraries[0].segments[0]?.aircraft.code}
                      |
                      {flight.flight.itineraries[0].segments[0]
                        ?.duration}</small
                    >
                    <span
                      class="status-tag {flight.scheduledType === 'CANCELED'
                        ? 'red'
                        : flight.scheduledType === 'DELAY'
                          ? 'yellow'
                          : 'green'}">{flight.scheduledType}</span
                    >
                  </div>
                {/if}
              {/each}
            {/if}
          </div>
        </div>
        <div class="weather-announcements">
          <section class="weather">
            <div class="weather-header">
              <h2
                style="display: flex; justify-content: space-between; column-gap: 10px; align-items: center; background-color: var(--blue-dark); width: 100%;
              padding: 10px; color: white; border-radius: 3px;
              font-size: var(--font-sm);"
              >
                WEATHER
                <small style="color: var(--grey-light);"
                  >Updated every 10s</small
                >
                <button
                  disabled={$LoadingType === "WEATHER"}
                  class="refresh-btn"
                  onclick={() => fetchWeather()}
                  ><span class="material-symbols-outlined">
                    autorenew
                  </span></button
                >
              </h2>
            </div>
            <div
              class="weather-scroll {$LoadingType === 'WEATHER'
                ? 'loading-data'
                : ''}"
            >
              {#each weatherstat.forecast as w}
                <div class="weather-card">
                  <span style="font-size: var(--font-sm); font-weight: normal;">
                    {#if w.date === formatDate(new Date().toLocaleDateString())}
                      <span
                        style="display: flex; justify-content: center; align-items: center; background-color: var(--blue-dark); width: 100%;
                      padding: 4px; color: white; border-radius: 3px;
                      font-size: var(--font-sm); column-gap: 10px; white-space: nowarp;"
                      >
                        <strong>Date</strong>
                        Today</span
                      >
                    {:else}
                      <span
                        style="display: flex; justify-content: center; align-items: center; background-color: var(--grey-dark); width: 100%;
                      padding: 4px; color: white; border-radius: 3px;
                      font-size: var(--font-sm); column-gap: 10px; white-space: nowrap;"
                      >
                        <strong>Date</strong>{w.date}</span
                      >
                    {/if}
                  </span>
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
        <section
          class="announcements {$LoadingType === 'ANN' ? 'loading-data' : ''}"
        >
          <span
            style="display: flex; justify-content: center; align-items: center; column-gap: 10px;"
          >
            <h3
              style="display: flex; justify-content: space-between; align-items: center; background-color: var(--blue-dark); width: 100%;
            padding: 10px; color: white; border-radius: 3px;
            font-size: var(--font-sm);"
            >
              GLOBAL ANNOUNCEMENTS
              <button
                class="refresh-btn"
                disabled={$LoadingType === "ANN"}
                onclick={() => fetchLatestAnnouncements()}
                ><span class="material-symbols-outlined">
                  autorenew
                </span></button
              >
            </h3>
          </span>
          <div class="announcements-scroll">
            {#each anns as ann}
              <div class="announcement announcement-{ann.type}">
                <strong>{ann.message_author}</strong>
                {ann.message}
              </div>
            {/each}
            {#if $LoadingType === "ANN"}
              <div class="ann-loading"></div>
            {/if}
          </div>
        </section>
      </section>

      <section class="dashboard-lower"></section>
    {:else if $activeSection === "boarding"}
      <BoardingPassCard></BoardingPassCard>
    {:else if $activeSection === "announcements"}
      <AnnounceCard></AnnounceCard>
    {:else if $activeSection === "scheduling"}
      <SchedulingPage></SchedulingPage>
    {:else if $activeSection === "staffmanage"}
      <StaffManage></StaffManage>
    {/if}
  </main>
</div>

<style>
  .loading-data {
    filter: grayscale(100%);
  }
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px;
    padding-top: 15px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    height: fit-content;
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
    justify-content: flex-end;
    width: 100%;
    gap: 1rem;
  }

  .logout {
    background: transparent;
    border: none;
    color: white;
    padding: 0.2rem 0.2rem;
    border-radius: 6px;
    font-weight: bold;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
    text-align: center;
    vertical-align: middle;
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
    border-radius: 4px;
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
    border-radius: 4px;
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
    padding-bottom: 100px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--blue-dark) transparent;
  }

  .flight-card {
    position: relative;
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
    filter: grayscale(100%);
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
    color: var(--green);
  }

  .status-tag.yellow {
    background: #fff3cd;
    color: var(--yellow);
  }

  .status-tag.red {
    background: #f8d7da;
    color: var(--red);
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
    border-radius: 4px;
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
    padding-right: 350px;
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
    filter: grayscale(100%);
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
    border-radius: 4px;
    padding: 0.5em 1em;
    overflow: hidden;
    max-width: 25em;
    margin: 0 0 0 auto;
  }
  .announcements-scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 0 1em;
    height: 100%;
    scrollbar-width: thin;
    scrollbar-color: var(--blue-dark) transparent;
    position: relative;
    padding-bottom: 100px;
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

  .announcement-WARNING {
    border-color: var(--yellow);
  }
  .announcement-WARNING:hover {
    outline: 3px solid var(--yellow);
  }

  /* .announcement.delay {
    border-color: var(--red);
  }
  .announcement.delay:hover {
    outline: 3px solid var(--red);
  } */

  .announcement-IMPORTANT {
    border-color: var(--red);
  }
  .announcement-IMPORTANT:hover {
    outline: 3px solid var(--red);
  }

  .announcement-INFO {
    border-color: var(--blue);
  }
  .announcement-INFO:hover {
    outline: 3px solid var(--blue);
  }
</style>
