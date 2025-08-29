<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  // State: calendar visibility, selected dates
  let showCalendar = $state(false);
  let startDate = $state<Date | null>(new Date(2025, 5, 17)); // Today, June 17, 2025
  let endDate = $state<Date | null>(null);

  // Current months and years for display (start with June and July 2025)
  let firstMonth = $state(5); // June
  let firstYear = $state(2025);
  let secondMonth = $state(6); // July
  let secondYear = $state(2025);

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

  // Function to get days for a given month
  function getDaysForMonth(month: number, year: number): (number | null)[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days: (number | null)[] = [];

    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }

  // Get days for the two months
  let firstMonthDays = $state(getDaysForMonth(firstMonth, firstYear));
  let secondMonthDays = $state(getDaysForMonth(secondMonth, secondYear));

  // Update days when months change
  $effect(() => {
    firstMonthDays = getDaysForMonth(firstMonth, firstYear);
    secondMonthDays = getDaysForMonth(secondMonth, secondYear);
  });

  // Handle date selection
  function selectDate(day: number, month: number, year: number) {
    const selectedDate = new Date(year, month, day);
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

  // Check if a day is in the selected range
  function isDayInRange(day: number, month: number, year: number): boolean {
    if (!startDate || !endDate) return false;
    const dayDate = new Date(year, month, day);
    return dayDate >= startDate && dayDate <= endDate;
  }

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

  // Navigate to previous months
  function prevMonths() {
    if (firstMonth === 0) {
      firstMonth = 11;
      firstYear -= 1;
    } else {
      firstMonth -= 1;
    }
    if (secondMonth === 0) {
      secondMonth = 11;
      secondYear -= 1;
    } else {
      secondMonth -= 1;
    }
  }

  // Navigate to next months
  function nextMonths() {
    if (firstMonth === 11) {
      firstMonth = 0;
      firstYear += 1;
    } else {
      firstMonth += 1;
    }
    if (secondMonth === 11) {
      secondMonth = 0;
      secondYear += 1;
    } else {
      secondMonth += 1;
    }
  }
</script>

<div class="datepicker-container">
  <input
    type="text"
    placeholder="Select dates..."
    value={displayDate}
    on:focus={() => (showCalendar = true)}
    readonly
  />
  {#if showCalendar}
    <div class="calendar">
      <div class="calendar-header">
        <button on:click={prevMonths}>←</button>
        <span
          >{months[firstMonth]}
          {firstYear} - {months[secondMonth]}
          {secondYear}</span
        >
        <button on:click={nextMonths}>→</button>
      </div>
      <div class="calendar-container">
        <!-- First Month -->
        <div class="calendar-month">
          <div class="month-label">{months[firstMonth]} {firstYear}</div>
          <div class="calendar-grid">
            <div class="day-header">Su</div>
            <div class="day-header">Mo</div>
            <div class="day-header">Tu</div>
            <div class="day-header">We</div>
            <div class="day-header">Th</div>
            <div class="day-header">Fr</div>
            <div class="day-header">Sa</div>
            {#each firstMonthDays as day (day)}
              {#if day !== null}
                <div
                  class="day"
                  class:selected={isDayInRange(day, firstMonth, firstYear)}
                  role="button"
                  tabindex="0"
                  on:mousedown={() => selectDate(day, firstMonth, firstYear)}
                >
                  {day}
                </div>
              {:else}
                <div class="day empty"></div>
              {/if}
            {/each}
          </div>
        </div>
        <!-- Second Month -->
        <div class="calendar-month">
          <div class="month-label">{months[secondMonth]} {secondYear}</div>
          <div class="calendar-grid">
            <div class="day-header">Su</div>
            <div class="day-header">Mo</div>
            <div class="day-header">Tu</div>
            <div class="day-header">We</div>
            <div class="day-header">Th</div>
            <div class="day-header">Fr</div>
            <div class="day-header">Sa</div>
            {#each secondMonthDays as day (day)}
              {#if day !== null}
                <div
                  class="day"
                  class:selected={isDayInRange(day, secondMonth, secondYear)}
                  role="button"
                  tabindex="0"
                  on:mousedown={() => selectDate(day, secondMonth, secondYear)}
                >
                  {day}
                </div>
              {:else}
                <div class="day empty"></div>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .datepicker-container {
    position: relative;
    width: 400px;
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

  .calendar-container {
    display: flex;
    gap: 20px;
  }

  .calendar-month {
    flex: 1;
  }

  .month-label {
    text-align: center;
    font-weight: bold;
    margin-bottom: 5px;
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
