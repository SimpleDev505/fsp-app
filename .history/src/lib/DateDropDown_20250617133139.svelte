<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  // State: calendar visibility, selected dates
  let showCalendar = $state(false);
  let startDate = $state<Date | null>(null);
  let endDate = $state<Date | null>(null);

  // Current month and year for display (starting with June 2025 as per screenshot)
  let currentMonth = $state(5); // 0 = January, 5 = June
  let currentYear = $state(2025);

  // Days in the month
  let daysInMonth = $derived(
    new Date(currentYear, currentMonth + 1, 0).getDate()
  );
  let firstDayOfMonth = $derived(
    new Date(currentYear, currentMonth, 1).getDay()
  );

  // Array of days for rendering
  let days = $derived(() => {
    let dayArray = [];
    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      dayArray.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      dayArray.push(i);
    }
    return dayArray;
  });

  // Month names for display
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Handle date selection
  function selectDate(day: number) {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (!startDate || (startDate && endDate)) {
      startDate = selectedDate;
      endDate = null;
    } else if (startDate && !endDate) {
      if (selectedDate < startDate) {
        endDate = startDate;
        startDate = selectedDate;
      } else {
        endDate = selectedDate;
      }
    }
  }

  // Format selected dates for display
  let displayDate = $derived(() => {
    if (!startDate) return "";
    if (!endDate)
      return `${startDate.getDate()} ${months[startDate.getMonth()].slice(0, 3)} '${startDate.getFullYear() % 100}`;
    return `${startDate.getDate()} ${months[startDate.getMonth()].slice(0, 3)} - ${endDate.getDate()} ${months[endDate.getMonth()].slice(0, 3)} '${startDate.getFullYear() % 100}`;
  });

  // Handle clicks outside to close the calendar
  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".datepicker-container")) {
      showCalendar = false;
    }
  }

  onMount(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  // Navigate to previous month
  function prevMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear -= 1;
    } else {
      currentMonth -= 1;
    }
  }

  // Navigate to next month
  function nextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear += 1;
    } else {
      currentMonth += 1;
    }
  }
</script>

<div class="datepicker-container">
  <input
    type="text"
    placeholder="Select dates..."
    value={displayDate}
    onfocus={() => (showCalendar = true)}
    readonly
  />
  {#if showCalendar}
    <div class="calendar">
      <div class="calendar-header">
        <button onclick={prevMonth}>←</button>
        <span>{months[currentMonth]} {currentYear}</span>
        <button onclick={nextMonth}>→</button>
      </div>
      <div class="calendar-grid">
        <div class="day-header">Su</div>
        <div class="day-header">Mo</div>
        <div class="day-header">Tu</div>
        <div class="day-header">We</div>
        <div class="day-header">Th</div>
        <div class="day-header">Fr</div>
        <div class="day-header">Sa</div>
        {#each days as day}
          {#if day}
            <div
              class="day"
              class:selected={startDate &&
                endDate &&
                day >= startDate.getDate() &&
                day <= endDate.getDate() &&
                startDate.getMonth() === currentMonth &&
                endDate.getMonth() === currentMonth}
              onmousedown={() => selectDate(day)}
            >
              {day}
            </div>
          {:else}
            <div class="day empty"></div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .datepicker-container {
    position: relative;
    width: 200px;
  }

  .datepicker-container input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  .calendar {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    z-index: 1000;
    padding: 10px;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .calendar-header button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }

  .day-header {
    text-align: center;
    font-size: 12px;
    font-weight: bold;
  }

  .day {
    text-align: center;
    padding: 5px;
    cursor: pointer;
    border-radius: 4px;
  }

  .day:hover {
    background: #f0f0f0;
  }

  .day.selected {
    background: #007bff;
    color: white;
  }

  .day.empty {
    background: transparent;
  }
</style>
