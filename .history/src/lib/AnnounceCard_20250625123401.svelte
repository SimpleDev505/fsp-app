<script lang="ts">
  import { get, writable } from "svelte/store";
  import type { MenuItem } from "./Store/store";
  import Dropdownmenu from "./dropdownmenu.svelte";
  import { AnnounceGlobalMessage } from "./Store/announce";
  import { LoginData } from "./Store/login";

  // Writable store for announcement data
  const announcementStore = writable({
    scheduleType: "Tomorrow",
    announceType: "Warning",
    hours: "",
    minutes: "",
    content: "Ex Weather Issue",
  });

  let { scheduleType, announceType, hours, minutes, content } =
    $state($announcementStore);
  let loggeddata: LoginData | null = $derived($LoginData ?? null);
  let ann_err = $state("");
  // Update store when values change
  $effect(() => {
    announcementStore.set({
      scheduleType,
      announceType,
      hours,
      minutes,
      content,
    });
  });

  function handleAnnounce() {
    console.log("Announcement data:", {
      scheduleType,
      announceType,
      hours,
      minutes,
      content,
    });
    console.log("Announce :", $announcementStore);
    if (loggeddata && loggeddata.username) {
      Object.entries($announcementStore).forEach(([key, value]) => {
        if (!value) {
          ann_err = "Fill The Required Data , Before Annoucing Message!";
          setTimeout(() => {
            ann_err = "";
          }, 2500);
          return;
        }
      });
      const res = AnnounceGlobalMessage({
        author: loggeddata.username,
        message: $announcementStore.content,
        type: $announcementStore.announceType,
        timestamp: new Date(),
      });
      announcementStore.set({
        announceType: "",
        content: "",
        hours: "",
        minutes: "",
        scheduleType: "",
      });
      scheduleType = "Tomorrow";
      announceType = "Info";
      hours = "";
      minutes = "";
      content = "Ex Weather Issue";

      if (!res) {
        ann_err = "Error Announcing Message!";
        setTimeout(() => {
          ann_err = "";
        }, 2500);
        return;
      }
    }
  }

  const Ann_Type_items: MenuItem[] = [
    {
      label: "Info",
      action: () => {
        announceType = "Info";
      },
      split: false,
    },
    {
      label: "Warning",
      action: () => {
        announceType = "Warning";
      },
      split: false,
    },
    {
      label: "Important",
      action: () => {
        announceType = "Important";
      },
      split: false,
    },
  ];
</script>

<div class="announcement-container">
  <div class="announcement-card">
    <h2 class="title">Announce</h2>
    <p class="subtitle">Announce By</p>

    <!-- Schedule Type Radio Buttons -->
    <div class="schedule-options">
      <label class="radio-option">
        <input type="radio" bind:group={scheduleType} value="Tomorrow" />
        <span class="radio-custom"></span>
        Tomorrow
      </label>

      <label class="radio-option">
        <input type="radio" bind:group={scheduleType} value="+1 Day" />
        <span class="radio-custom"></span>
        +1 Day
      </label>

      <label class="radio-option">
        <input type="radio" bind:group={scheduleType} value="+2 Day" />
        <span class="radio-custom"></span>
        +2 Day
      </label>

      <label class="radio-option">
        <input type="radio" bind:group={scheduleType} value="Current Time" />
        <span class="radio-custom"></span>
        Current Time
      </label>

      <label class="radio-option">
        <input type="radio" bind:group={scheduleType} value="Custom Time" />
        <span class="radio-custom"></span>
        Custom Time
      </label>
    </div>

    <!-- Time and Announce Type Section -->
    <div class="controls-section">
      <div class="announce-type-section">
        <label class="section-label">Announce Type</label>
        <Dropdownmenu leftpx={0} rightpx={0} items={Ann_Type_items}
        ></Dropdownmenu>
      </div>

      <div class="time-section">
        <div class="time-group">
          <label class="time-label">Hrs</label>
          <input
            type="number"
            bind:value={hours}
            placeholder="Time"
            class="time-input"
            min="1"
            max="24"
          />
          <small class="time-hint">Enter a number between 1 and 24</small>
        </div>

        <div class="time-group">
          <label class="time-label">Mins</label>
          <input
            type="number"
            bind:value={minutes}
            placeholder="Time"
            class="time-input"
            min="1"
            max="60"
          />
          <small class="time-hint">Enter a number between 1 and 60</small>
        </div>
      </div>
    </div>

    <!-- Content Textarea -->
    <textarea
      bind:value={content}
      placeholder="Ex Weather Issue"
      class="content-textarea"
    ></textarea>

    <!-- Announce Button -->
    <span>
      {#if ann_err}
        <span style="font-size: var(--font-sm); color: var(--red);"
          >{ann_err}</span
        >
      {/if}
      <button class="announce-btn" onclick={handleAnnounce}> Announce </button>
    </span>
  </div>
</div>

<style>
  .announcement-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: white;
    padding: 20px;
  }

  .announcement-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 100%;
    max-width: 550px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .title {
    text-align: center;
    font-size: var(--font-lg);
    font-weight: 600;
    margin: 0 0 8px 0;
    color: var(--grey-dark);
  }

  .subtitle {
    text-align: center;
    font-size: var(--font-s);
    color: var(--grey-dark);
    margin: 0 0 20px 0;
  }

  .schedule-options {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    white-space: nowrap;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: var(--font-s);
    color: var(--grey-dark);
  }

  .radio-option input[type="radio"] {
    display: none;
  }

  .radio-custom {
    width: 16px;
    height: 16px;
    border: 2px solid var(--grey-dark);
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
  }

  .radio-option input[type="radio"]:checked + .radio-custom {
    border-color: var(--blue);
  }

  .radio-option input[type="radio"]:checked + .radio-custom::after {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--blue);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .controls-section {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    align-items: flex-start;
  }

  .announce-type-section {
    flex: 1;
  }

  .section-label {
    display: block;
    font-size: var(--font-s);
    color: var(--grey-dark);
    margin-bottom: 8px;
    font-weight: 500;
  }
  .time-section {
    display: flex;
    gap: 12px;
    flex: 1;
  }

  .time-group {
    flex: 1;
  }

  .time-label {
    display: block;
    font-size: var(--font-s);
    color: var(--grey-dark);
    margin-bottom: 4px;
    text-align: center;
    font-weight: 500;
  }

  .time-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: var(--font-s);
    text-align: center;
    background: var(--grey-light);
  }

  .time-input:focus {
    outline: none;
    border-color: var(--blue);
    background: white;
  }

  .time-hint {
    display: block;
    font-size: 12px;
    color: var(--grey-dark);
    text-align: center;
    margin-top: 4px;
  }

  .content-textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 2px solid var(--blue);
    border-radius: 8px;
    font-size: var(--font-s);
    resize: vertical;
    margin-bottom: 20px;
    font-family: inherit;
  }

  .content-textarea:focus {
    outline: none;
    border-color: var(--blue-dark);
  }

  .content-textarea::placeholder {
    color: var(--grey-dark);
  }

  .announce-btn {
    background: var(--blue);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: var(--font-sm);
    font-weight: 500;
    cursor: pointer;
    float: right;
    transition: 0.2s ease-in-out;
  }

  .announce-btn:hover {
    background: var(--blue-dark);
  }

  .announce-btn:active {
    transform: translateY(1px);
  }
</style>
