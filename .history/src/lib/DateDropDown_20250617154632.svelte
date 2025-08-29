<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  // --- Props ---
  // The selected date. Using $state for internal management, but can be bindable from parent.
  // Add an export keyword if you want to bind it from a parent component.
  // export let selectedDate = $state<Date | null>(null); // If you want to allow binding
  let selectedDate = $state<Date | null>(null);

  // --- Internal State ---
  let showCalendar = $state(false);
  let inputElement: HTMLInputElement | undefined;
  let calendarElement: HTMLDivElement | undefined;

  // Calendar display state
  let currentMonth = $state(new Date().getMonth());
  let currentYear = $state(new Date().getFullYear());

  // --- Helper Functions ---
  function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
  }

  function formatDate(date: Date | null): string {
    if (!date) return "";
    // Using 'en-CA' for YYYY-MM-DD format as an example
    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  // --- Calendar Grid Generation ---
  // The $derived block directly returns the array, not a function that returns an array.
  let calendarDays: (number | null)[] = $derived(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth); // 0 (Sun) to 6 (Sat)
    const days: (number | null)[] = []; // Explicitly type 'days' array inside

    // Add leading empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days; // This function returns (number | null)[]
  });

  let monthName: string = $derived(() => {
    // Also type monthName for consistency
    return new Date(currentYear, currentMonth).toLocaleString("en-US", {
      month: "long",
    });
  });

  let monthName = $derived(() => {
    return new Date(currentYear, currentMonth).toLocaleString("en-US", {
      month: "long",
    });
  });

  // --- Event Handlers ---
  function handleInputFocus() {
    showCalendar = true;
  }

  function handleDayClick(day: number | null) {
    if (day !== null) {
      selectedDate = new Date(currentYear, currentMonth, day);
      showCalendar = false;
    }
  }

  // For accessibility: allows selecting with Enter/Space key
  function handleDayKeyDown(event: KeyboardEvent, day: number | null) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); // Prevent default scroll for space key
      handleDayClick(day);
    }
  }

  function navigateMonth(direction: "prev" | "next") {
    if (direction === "prev") {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
    } else {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  }

  // Handle clicks outside the component to close the calendar
  function handleClickOutside(event: MouseEvent) {
    // Add a slight delay using setTimeout to ensure the click event has fully propagated
    // and hasn't been consumed by the calendar itself (e.g., if clicking a day).
    // This is a common pattern for popups to prevent immediate closing.
    setTimeout(() => {
      if (
        showCalendar &&
        inputElement &&
        calendarElement &&
        !inputElement.contains(event.target as Node) &&
        !calendarElement.contains(event.target as Node)
      ) {
        showCalendar = false;
      }
    }, 0); // A zero-delay timeout runs after the current event loop finishes.
  }

  // --- Lifecycle Hooks ---
  onMount(() => {
    document.addEventListener("mousedown", handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener("mousedown", handleClickOutside);
  });

  // Export selectedDate for parent components to bind to
  // If you want to expose `selectedDate` to parent components via `bind:`, uncomment this line:
  // export { selectedDate };

  // For demonstration: logs the selected date whenever it changes
  $effect(() => {
    console.log("Selected Date Changed:", selectedDate);
  });
</script>

<div class="datepicker-wrapper">
  <input
    type="text"
    placeholder="Select a date"
    readonly
    value={formatDate(selectedDate)}
    onfocus={handleInputFocus}
    bind:this={inputElement}
    aria-haspopup="dialog"
    aria-expanded={showCalendar}
    aria-controls="date-picker-calendar"
  />

  {#if showCalendar}
    <div
      id="date-picker-calendar"
      class="datepicker-calendar-overlay"
      bind:this={calendarElement}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-month-year"
    >
      <div class="calendar-header">
        <button
          type="button"
          onclick={() => navigateMonth("prev")}
          aria-label="Previous Month"
        >
          &lt;
        </button>
        <h2 id="calendar-month-year">{monthName} {currentYear}</h2>
        <button
          type="button"
          onclick={() => navigateMonth("next")}
          aria-label="Next Month"
        >
          &gt;
        </button>
      </div>
      <div class="calendar-grid">
        {#each ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as dayOfWeek}
          <div class="calendar-day-header">{dayOfWeek}</div>
        {/each}
        {#each calendarDays as day (day)}
          <div
            class="calendar-day"
            class:empty={day === null}
            class:selected={day !== null &&
              selectedDate &&
              day === selectedDate.getDate() &&
              currentMonth === selectedDate.getMonth() &&
              currentYear === selectedDate.getFullYear()}
            onclick={() => handleDayClick(day)}
            onkeydown={(e) => handleDayKeyDown(e, day)}
            role="gridcell"
            tabindex={day === null ? -1 : 0}
            aria-label={day !== null
              ? `${monthName} ${day}, ${currentYear}`
              : undefined}
            aria-selected={day !== null &&
              selectedDate &&
              day === selectedDate.getDate() &&
              currentMonth === selectedDate.getMonth() &&
              currentYear === selectedDate.getFullYear()}
          >
            {day}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .datepicker-wrapper {
    position: relative;
    display: inline-block; /* Ensures the wrapper only takes necessary space */
  }

  .datepicker-wrapper input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    min-width: 150px; /* Adjust as needed */
  }

  .datepicker-calendar-overlay {
    position: fixed; /* Crucial for overlaying all elements */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Center the overlay */
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000; /* High z-index to ensure it's above other elements */
    padding: 20px;
    font-family: sans-serif;
    width: 300px; /* Fixed width for the calendar */
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .calendar-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }

  .calendar-header button {
    background: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 1rem;
    color: #555;
  }

  .calendar-header button:hover {
    background: #f0f0f0;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    text-align: center;
  }

  .calendar-day-header {
    font-weight: bold;
    color: #777;
    padding: 5px 0;
  }

  .calendar-day {
    padding: 10px 0;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    user-select: none; /* Prevent text selection */
  }

  .calendar-day.empty {
    background-color: transparent;
    cursor: default;
  }

  .calendar-day.selected {
    background-color: #007bff;
    color: white;
    font-weight: bold;
  }

  .calendar-day[tabindex="0"]:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
</style>
