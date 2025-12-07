// calendar.js - Display availability calendar
class AvailabilityCalendar {
  constructor() {
    this.events = [];
    this.container = document.getElementById("calendar-container");
    this.weeksToShow = 5; // Current week + 4 more
    this.currentWeekIndex = 0; // Track which week we're viewing
  }

  async init() {
    console.log("🚀 Initializing calendar...");
    await this.loadAvailability(); // ← Add this line
    this.render();
  }

  async loadAvailability() {
    try {
      console.log("🔍 Fetching availability data...");
      const response = await fetch("/availability.json");
      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Loaded records:", data.length);
      this.events = data.map((record) => record.fields); // ← Change to this.events
      console.log("📅 Processed events:", this.events);
    } catch (error) {
      console.error("❌ Error loading availability:", error);
      this.container.innerHTML =
        '<p class="error">Failed to load availability data.</p>';
    }
  }

  // Get the start of the current week (Sunday)
  getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Sunday = 0
    return new Date(d.setDate(diff));
  }

  // Generate all weeks to display
  getWeeksToDisplay() {
    const weeks = [];
    const startDate = this.getWeekStart();

    for (let i = 0; i < this.weeksToShow; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + i * 7);

      const days = [];
      for (let j = 0; j < 7; j++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + j);
        days.push(day);
      }

      weeks.push({ weekStart, days });
    }

    return weeks;
  }

  // Process events for a day: split regular blocks around special events
  // Process events for a day: split regular blocks around special events
  processEventsForDay(events) {
    // Separate regular and special events
    const regularEvents = events.filter((e) => e["Event Type"] !== "Special");
    const specialEvents = events.filter((e) => e["Event Type"] === "Special");

    let processedEvents = [];

    // For each regular event, check if it needs to be split by special events
    regularEvents.forEach((regular) => {
      const regularStart = this.timeToMinutes(regular["Start Time"]);
      const regularEnd = this.timeToMinutes(regular["End Time"]);

      // Find special events that overlap with this regular event
      const overlapping = specialEvents.filter((special) => {
        const specialStart = this.timeToMinutes(special["Start Time"]);
        const specialEnd = this.timeToMinutes(special["End Time"]);

        // Check if special overlaps with regular
        return specialStart < regularEnd && specialEnd > regularStart;
      });

      if (overlapping.length === 0) {
        // No overlap, keep the regular event as-is
        processedEvents.push(regular);
      } else {
        // Sort overlapping specials by start time
        overlapping.sort((a, b) => {
          return (
            this.timeToMinutes(a["Start Time"]) -
            this.timeToMinutes(b["Start Time"])
          );
        });

        // Split the regular event around each special event
        let currentStart = regularStart;

        overlapping.forEach((special) => {
          const specialStart = this.timeToMinutes(special["Start Time"]);
          const specialEnd = this.timeToMinutes(special["End Time"]);

          // Add piece before special event (if any)
          if (currentStart < specialStart) {
            processedEvents.push({
              ...regular,
              "Start Time": this.minutesToTime(currentStart),
              "End Time": this.minutesToTime(specialStart),
            });
          }

          // Move current start to after this special event
          currentStart = Math.max(currentStart, specialEnd);
        });

        // Add remaining piece after all specials (if any)
        if (currentStart < regularEnd) {
          processedEvents.push({
            ...regular,
            "Start Time": this.minutesToTime(currentStart),
            "End Time": this.minutesToTime(regularEnd),
          });
        }
      }
    });

    // Add all special events
    processedEvents = processedEvents.concat(specialEvents);

    // Sort by start time
    processedEvents.sort((a, b) => {
      return (
        this.timeToMinutes(a["Start Time"]) -
        this.timeToMinutes(b["Start Time"])
      );
    });

    // Consolidate adjacent blocks with same status
    const consolidated = this.consolidateBlocks(processedEvents); // ← Add this

    return consolidated; // ← Return consolidated instead of processedEvents
  }

  // Helper: Convert "9:00" or "09:00" to minutes since midnight
  timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Helper: Convert minutes since midnight to "HH:MM" format
  minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`;
  }

  // Consolidate adjacent blocks with same status
  consolidateBlocks(events) {
    if (events.length === 0) return events;

    const consolidated = [];
    let current = { ...events[0] };

    for (let i = 1; i < events.length; i++) {
      const next = events[i];

      const currentEnd = this.timeToMinutes(current["End Time"]);
      const nextStart = this.timeToMinutes(next["Start Time"]);

      // Check if blocks can be consolidated:
      // - Same Status
      // - Same Event Type (both Regular or both Special)
      // - Current end time = Next start time
      const sameStatus = current.Status === next.Status;
      const sameType = current["Event Type"] === next["Event Type"];
      const adjacent = currentEnd === nextStart;

      if (sameStatus && sameType && adjacent) {
        // Extend current block to include next block
        current["End Time"] = next["End Time"];
      } else {
        // Can't consolidate - save current and move to next
        consolidated.push(current);
        current = { ...next };
      }
    }

    // Don't forget the last block
    consolidated.push(current);

    return consolidated;
  }

  // Get events for a specific date
  getEventsForDate(date) {
    const dateStr = this.formatDate(date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    const events = this.events.filter((event) => {
      // If event has a specific Date, ONLY match that exact date
      if (event.Date) {
        return event.Date === dateStr;
      }

      // Otherwise, check for recurring day of week match
      if (event["Day of Week"] && event["Day of Week"] === dayName) {
        return true;
      }

      return false;
    });

    // Process events: split regular blocks around special events
    const processedEvents = this.processEventsForDay(events);

    return processedEvents;
  }

  // Format date as YYYY-MM-DD
  formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  render() {
    console.log("🎨 Starting render...");
    console.log("📊 Events loaded:", this.events.length);

    const weeks = this.getWeeksToDisplay();
    console.log("📅 Weeks to display:", weeks.length);

    // Get the current week to display
    const week = weeks[this.currentWeekIndex];
    const weekLabel = week.weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const weekEnd = new Date(week.weekStart);
    weekEnd.setDate(week.weekStart.getDate() + 6);
    const weekEndLabel = weekEnd.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const leftArrowIcon = "<i class='fa-solid fa-arrow-left'></i>";
    const rightArrowIcon = "<i class='fa-solid fa-arrow-right'></i>";

    let html = `
    <div class="calendar-header">
      <h3 class="week-heading">Week of ${weekLabel} - ${weekEndLabel}</h3>
      <div class="calendar-nav">
        <button class="nav-btn nav-prev ${
          this.currentWeekIndex === 0 ? "disabled" : ""
        }" 
          ${this.currentWeekIndex === 0 ? "disabled" : ""}>
          ${leftArrowIcon}
        </button>
        <button class="nav-btn nav-current ${
          this.currentWeekIndex === 0 ? "disabled" : ""
        }"
                ${this.currentWeekIndex === 0 ? "disabled" : ""}>
          This Week
        </button>
        <button class="nav-btn nav-next ${
          this.currentWeekIndex === weeks.length - 1 ? "disabled" : ""
        }"
          ${this.currentWeekIndex === weeks.length - 1 ? "disabled" : ""}>
          ${rightArrowIcon}
        </button>
      </div>
    </div>
    <div class="calendar">
      <div class="calendar-week ${
        this.currentWeekIndex === 0 ? "current-week" : ""
      }">
        <div class="week-grid">
  `;

    week.days.forEach((day) => {
      const dayName = day.toLocaleDateString("en-US", { weekday: "short" });
      const dayDate = day.getDate();
      const events = this.getEventsForDate(day);
      const isToday = this.formatDate(day) === this.formatDate(new Date());

      html += `
      <div class="day-cell ${isToday ? "today" : ""}">
        <div class="day-header">
          <span class="day-name">${dayName}</span>
          <span class="day-date">${dayDate}</span>
        </div>
        <div class="day-events">
    `;

      if (events.length === 0) {
        html += '<div class="event-block event-free">Free</div>';
      } else {
        events.forEach((event) => {
          const status = event.Status || "Busy";
          const eventType = event["Event Type"] || "Regular";
          const isSpecial = eventType === "Special";
          const startTime = this.formatTime(event["Start Time"]);
          const endTime = this.formatTime(event["End Time"]);

          let cssClass, displayLabel;

          if (isSpecial) {
            if (status === "Busy") {
              cssClass = "event-special-busy";
              displayLabel = "BOOKED";
            } else {
              cssClass = "event-special-available";
              displayLabel = "FREE";
            }
          } else {
            cssClass = `event-${status.toLowerCase()}`;
            displayLabel = status;
          }

          html += `
          <div class="event-block ${cssClass}">
            <div class="event-time">${startTime} - ${endTime}</div>
            <div class="event-status">${displayLabel}</div>
          </div>
        `;
        });
      }

      html += `
        </div>
      </div>
    `;
    });

    html += `
        </div>
      </div>
    </div>
  `;

    this.container.innerHTML = html;
    this.attachNavListeners();
    // console.log("✅ Render complete!");
  }

  attachNavListeners() {
    const prevBtn = this.container.querySelector(".nav-prev");
    const nextBtn = this.container.querySelector(".nav-next");
    const currentBtn = this.container.querySelector(".nav-current");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.navigateWeek(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.navigateWeek(1));
    }
    if (currentBtn) {
      currentBtn.addEventListener("click", () => this.navigateToCurrentWeek());
    }
  }

  navigateWeek(direction) {
    const weeks = this.getWeeksToDisplay();
    const newIndex = this.currentWeekIndex + direction;

    if (newIndex >= 0 && newIndex < weeks.length) {
      this.currentWeekIndex = newIndex;
      this.render();
    }
  }

  navigateToCurrentWeek() {
    if (this.currentWeekIndex !== 0) {
      this.currentWeekIndex = 0;
      this.render();
    }
  }

  // Format time from 24hr to 12hr
  formatTime(timeStr) {
    if (!timeStr) return "";

    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "pm" : "am";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    return `${displayHour}:${minutes}${period}`;
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // console.log("📅 DOM ready, creating calendar...");
  const calendar = new AvailabilityCalendar();
  calendar.init();
});
