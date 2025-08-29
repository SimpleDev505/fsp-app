<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { Current_SearchFilter, disabledDates } from "./Store/store";
  import { get } from "svelte/store";

  let inputValue = $state("");
  let showCalendar = $state(false);
  let startDate: Date | null = $state(null);
  let endDate: Date | null = $state(null);

  let { pickupenddate, icon = "" }: { pickupenddate: boolean; icon?: string } =
    $props();

  let calendarRef: HTMLDivElement;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentMonth = $state(new Date());
  let nextMonth = $derived(
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
  );

  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  let disabledSet = new Set<string>();

  // Set from store manually once at component mount
  let unsubscribe: () => void;

  onMount(() => {
    unsubscribe = disabledDates.subscribe((dates) => {
      disabledSet = new Set(dates.map((d) => d.toISOString().split("T")[0]));
    });
  });

  onDestroy(() => {
    unsubscribe?.();
  });

  function isDisabled(day: Date | null): boolean {
    if (!day) return true;
    const iso = day.toISOString().split("T")[0];
    return disabledSet.has(iso) || isPastDate(day);
  }

  function isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  function isSameDate(d1: Date | null, d2: Date | null): boolean {
    return !!d1 && !!d2 && d1.toDateString() === d2.toDateString();
  }

  function isInRange(day: Date): boolean {
    if (!startDate || !endDate) return false;
    return day >= startDate && day <= endDate;
  }

  function getDaysInMonth(date: Date): (Date | null)[] {
    const days: (Date | null)[] = [];
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const total = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    const padding = start.getDay();

    for (let i = 0; i < padding; i++) days.push(null);
    for (let d = 1; d <= total; d++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), d));
    }
    return days;
  }
  function handleDayClick(day: Date) {
    if (isDisabled(day)) return;

    if (!pickupenddate) {
      startDate = day;
      inputValue = `${formatDate(startDate)}`;
      showCalendar = false;
      updateSearchDates();
      return;
    }

    if (!startDate || (startDate && endDate)) {
      startDate = day;
      endDate = null;
    } else if (startDate && day >= startDate) {
      endDate = day;
      inputValue = `${formatDate(startDate)} to ${formatDate(endDate)}`;
      showCalendar = false;
    } else {
      startDate = day;
      endDate = null;
    }

    updateSearchDates();
  }

  function updateSearchDates() {
    Current_SearchFilter.update((prev) => {
      if (!prev || !prev.timings || prev.timings.length === 0) return prev;

      const depFormatted = startDate
        ? formatDate(startDate)
        : prev.timings.at(-1)?.dep;
      const returnFormatted =
        pickupenddate && endDate ? formatDate(endDate) : undefined;

      const updatedTimings = [...prev.timings];
      const lastIndex = updatedTimings.length - 1;

      updatedTimings[lastIndex] = {
        ...updatedTimings[lastIndex],
        dep: depFormatted ?? "none",
        ...(pickupenddate
          ? { return: returnFormatted }
          : { return: undefined }),
      };

      return {
        ...prev,
        timings: updatedTimings,
      };
    });
  }

  function formatDate(date: Date): string {
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(/ /g, "'");
  }

  function getTripDuration(): number | null {
    if (startDate && endDate) {
      const diff =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      return diff;
    }
    return null;
  }

  function canGoBack(): boolean {
    return (
      currentMonth.getFullYear() > today.getFullYear() ||
      (currentMonth.getFullYear() === today.getFullYear() &&
        currentMonth.getMonth() > today.getMonth())
    );
  }

  function prevMonthClick() {
    if (!canGoBack()) return;
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    );
    nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );
  }

  function nextMonthClick() {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );
    nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );
  }

  function handleClickOutside(event: MouseEvent) {
    if (!calendarRef?.contains(event.target as Node)) {
      showCalendar = false;
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener("click", handleClickOutside);
  });
</script>

<!-- MARKUP -->
<div class="datepicker" bind:this={calendarRef}>
  <div class="datepicker-input">
    <input
      type="text"
      placeholder="Select date"
      readonly
      value={inputValue}
      onfocus={() => (showCalendar = true)}
    />
    {#if icon}
      <span class="material-symbols-outlined">{icon}</span>
    {/if}
  </div>

  {#if showCalendar}
    <div class="calendar-popup">
      <div class="month-wrapper">
        <!-- Current Month -->
        <div class="month">
          <div class="month-header">
            <button
              class="nav-btn"
              onclick={prevMonthClick}
              disabled={!canGoBack()}
            >
              &larr;
            </button>
            <span
              >{currentMonth.toLocaleString("default", { month: "long" })}
              {currentMonth.getFullYear()}</span
            >
          </div>
          <div class="day-grid">
            {#each dayLabels as day}<div class="day-label">{day}</div>{/each}
            {#each getDaysInMonth(currentMonth) as day}
              <div
                class="day
              {day && isDisabled(day) ? 'disabled' : ''}
              {(day && isSameDate(day, startDate)) || isSameDate(day, endDate)
                  ? 'selected'
                  : ''}
              {day && isInRange(day) ? 'in-range' : ''}"
                onclick={() => day && !isDisabled(day) && handleDayClick(day)}
              >
                {day ? day.getDate() : ""}
              </div>
            {/each}
          </div>
        </div>

        <!-- Next Month -->
        <div class="month">
          <div class="month-header">
            <span
              >{nextMonth.toLocaleString("default", { month: "long" })}
              {nextMonth.getFullYear()}</span
            >
            <button class="nav-btn" onclick={nextMonthClick}>&rarr;</button>
          </div>
          <div class="day-grid">
            {#each dayLabels as day}<div class="day-label">{day}</div>{/each}
            {#each getDaysInMonth(nextMonth) as day}
              <div
                class="day {isDisabled(day) ? 'disabled' : ''} {isSameDate(
                  day,
                  startDate
                ) || isSameDate(day, endDate)
                  ? 'selected'
                  : ''} {day && isInRange(day) ? 'in-range' : ''}"
                onclick={() => day && !isDisabled(day) && handleDayClick(day)}
              >
                {day ? day.getDate() : ""}
              </div>
            {/each}
          </div>
        </div>
      </div>

      {#if pickupenddate && getTripDuration() !== null}
        <div class="trip-duration">Trip Duration: {getTripDuration()} Days</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .day.disabled {
    color: #bbb;
    pointer-events: none;
    background-color: #f5f5f5;
  }
  .datepicker {
    position: relative;
    display: inline-block;
    font-family: sans-serif;
  }
  .datepicker-input {
    display: flex;
    align-items: center;
    position: relative;
  }
  .datepicker-input span {
    position: absolute;
    right: 10px;
    font-size: var(--font--lg);
    color: var(--blue);
  }
  input {
    padding: 10px;
    width: 180px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
    cursor: pointer;
  }

  .calendar-popup {
    position: absolute;
    top: 110%;
    left: 0;
    z-index: 9999;
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  }

  .month-wrapper {
    display: flex;
    gap: 20px;
  }
  .month {
    width: 240px;
  }
  .month-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-weight: bold;
  }
  .nav-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  .nav-btn:disabled {
    color: #aaa;
    cursor: not-allowed;
  }

  .day-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
  }
  .day-label {
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    color: #666;
  }
  .day {
    text-align: center;
    padding: 8px;
    font-size: 13px;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }
  .day:hover {
    background-color: #eee;
  }
  .day.selected {
    background-color: #3b82f6;
    color: white;
  }
  .day.in-range {
    background-color: #dbeafe;
  }
  .day.disabled {
    color: #bbb;
    pointer-events: none;
    background-color: #f5f5f5;
  }

  .trip-duration {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
  }
</style>
