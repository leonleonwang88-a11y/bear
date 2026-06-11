// Common timezones
const COMMON_TIMEZONES = [
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'America/Denver',
    'America/Anchorage',
    'Pacific/Honolulu',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Bangkok',
    'Asia/Hong_Kong',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Brisbane',
    'Pacific/Auckland',
    'Pacific/Fiji',
    'America/Toronto',
    'America/Mexico_City',
    'America/São_Paulo',
    'America/Buenos_Aires',
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Africa/Lagos',
];

// State
let clocks = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadClocks();
    startClocks();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const addBtn = document.getElementById('addBtn');
    const input = document.getElementById('timezoneInput');

    addBtn.addEventListener('click', addClock);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addClock();
    });
    input.addEventListener('input', showSuggestions);
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.controls') && !e.target.closest('.suggestions')) {
            hideSuggestions();
        }
    });
}

// Show timezone suggestions
function showSuggestions() {
    const input = document.getElementById('timezoneInput');
    const value = input.value.toLowerCase();
    const suggestionsDiv = document.getElementById('suggestions');

    if (!value) {
        suggestionsDiv.innerHTML = '';
        return;
    }

    const filtered = COMMON_TIMEZONES.filter(tz =>
        tz.toLowerCase().includes(value)
    );

    if (filtered.length > 0) {
        const html = `
            <div class="suggestion-list">
                ${filtered.slice(0, 8).map(tz => `
                    <div class="suggestion-item" onclick="selectTimezone('${tz}')">
                        ${tz}
                    </div>
                `).join('')}
            </div>
        `;
        suggestionsDiv.innerHTML = html;
    } else {
        suggestionsDiv.innerHTML = '';
    }
}

// Hide suggestions
function hideSuggestions() {
    document.getElementById('suggestions').innerHTML = '';
}

// Select timezone from suggestions
function selectTimezone(timezone) {
    document.getElementById('timezoneInput').value = timezone;
    hideSuggestions();
    addClock();
}

// Add new clock
function addClock() {
    const input = document.getElementById('timezoneInput');
    const timezone = input.value.trim();

    if (!timezone) return;

    // Validate timezone
    if (!isValidTimezone(timezone)) {
        showError(`Invalid timezone: ${timezone}`);
        return;
    }

    // Check if already exists
    if (clocks.some(c => c.timezone === timezone)) {
        showError('This timezone is already added');
        return;
    }

    // Add clock
    clocks.push({ timezone, id: Date.now() });
    input.value = '';
    hideSuggestions();
    saveClocks();
    renderClocks();
}

// Remove clock
function removeClock(id) {
    clocks = clocks.filter(c => c.id !== id);
    saveClocks();
    renderClocks();
}

// Validate timezone
function isValidTimezone(timezone) {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: timezone });
        return true;
    } catch (e) {
        return false;
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById('clocksContainer');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    container.insertAdjacentElement('beforebegin', errorDiv);

    setTimeout(() => errorDiv.remove(), 3000);
}

// Render all clocks
function renderClocks() {
    const container = document.getElementById('clocksContainer');

    if (clocks.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">⏰</div>
                <div class="empty-state-text">No timezones added yet</div>
                <div class="empty-state-subtext">Add a timezone to see the current time</div>
            </div>
        `;
        return;
    }

    container.innerHTML = clocks.map(clock => createClockCard(clock)).join('');
    clocks.forEach(clock => {
        const removeBtn = document.getElementById(`remove-${clock.id}`);
        removeBtn.addEventListener('click', () => removeClock(clock.id));
    });
}

// Create clock card HTML
function createClockCard(clock) {
    const time = getTimeInTimezone(clock.timezone);
    const date = getDateInTimezone(clock.timezone);
    const cleanTimezone = clock.timezone.replace(/_/g, ' ');

    return `
        <div class="clock-card">
            <button id="remove-${clock.id}" class="remove-btn">×</button>
            <div class="timezone-label">Timezone</div>
            <div class="timezone-name">${cleanTimezone}</div>
            <div class="digital-time">${time}</div>
            <div class="time-info">
                <div class="date-display">${date}</div>
            </div>
        </div>
    `;
}

// Get time in timezone
function getTimeInTimezone(timezone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    return formatter.format(new Date());
}

// Get date in timezone
function getDateInTimezone(timezone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return formatter.format(new Date());
}

// Start updating clocks every second
function startClocks() {
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
}

// Update all clock displays
function updateAllClocks() {
    clocks.forEach(clock => {
        const timeElement = document.querySelector(`[data-time-${clock.id}]`);
        if (timeElement) {
            timeElement.textContent = getTimeInTimezone(clock.timezone);
        }
    });
}

// Save clocks to localStorage
function saveClocks() {
    localStorage.setItem('clocks', JSON.stringify(clocks));
}

// Load clocks from localStorage
function loadClocks() {
    const saved = localStorage.getItem('clocks');
    if (saved) {
        clocks = JSON.parse(saved);
        renderClocks();
    }
}
