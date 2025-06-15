class TimezoneApp {
    constructor() {
        this.timezones = [
            // United States
            { value: 'America/New_York', label: 'New York (EST/EDT)' },
            { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
            { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
            { value: 'America/Denver', label: 'Denver (MST/MDT)' },
            { value: 'America/Phoenix', label: 'Phoenix (MST)' },
            { value: 'America/Anchorage', label: 'Anchorage (AKST/AKDT)' },
            { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
            
            // United Kingdom
            { value: 'Europe/London', label: 'London (GMT/BST)' },
            
            // India
            { value: 'Asia/Kolkata', label: 'Delhi (IST)' },
            
            // Australia
            { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
            { value: 'Australia/Melbourne', label: 'Melbourne (AEDT/AEST)' },
            { value: 'Australia/Brisbane', label: 'Brisbane (AEST)' },
            { value: 'Australia/Perth', label: 'Perth (AWST)' },
            { value: 'Australia/Adelaide', label: 'Adelaide (ACDT/ACST)' },
            { value: 'Australia/Darwin', label: 'Darwin (ACST)' },
            { value: 'Australia/Hobart', label: 'Hobart (AEDT/AEST)' }
        ];
        
        this.selectedTimezones = {};
        this.autoRefreshInterval = null;
        this.init();
    }

    init() {
        this.populateTimezoneSelects();
        this.bindEvents();
        this.startAutoRefresh();
    }

    populateTimezoneSelects() {
        const selects = document.querySelectorAll('.timezone-select');
        
        selects.forEach(select => {
            // Clear existing options except the first one
            select.innerHTML = '<option value="">Select a timezone</option>';
            
            // Add timezone options
            this.timezones.forEach(timezone => {
                const option = document.createElement('option');
                option.value = timezone.value;
                option.textContent = timezone.label;
                select.appendChild(option);
            });
        });
    }

    bindEvents() {
        // Timezone selection events
        document.querySelectorAll('.timezone-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const timezoneNumber = e.target.dataset.timezone;
                const selectedTimezone = e.target.value;
                
                if (selectedTimezone) {
                    this.selectedTimezones[timezoneNumber] = selectedTimezone;
                    this.updateTimezone(timezoneNumber, selectedTimezone);
                } else {
                    delete this.selectedTimezones[timezoneNumber];
                    this.clearTimezone(timezoneNumber);
                }
            });
        });

        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.refreshAllTimezones();
        });

        // Auto-refresh toggle
        document.getElementById('auto-refresh').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.startAutoRefresh();
            } else {
                this.stopAutoRefresh();
            }
        });
    }

    updateTimezone(timezoneNumber, timezone) {
        const card = document.getElementById(`timezone-${timezoneNumber}`);
        const timeElement = card.querySelector('.time');
        const dateElement = card.querySelector('.date');
        const zoneInfoElement = card.querySelector('.zone-info');

        try {
            const now = new Date();
            
            // Format time
            const timeFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            
            // Format date
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Get timezone offset
            const offsetFormatter = new Intl.DateTimeFormat('en', {
                timeZone: timezone,
                timeZoneName: 'short'
            });
            
            const timeString = timeFormatter.format(now);
            const dateString = dateFormatter.format(now);
            const offsetString = offsetFormatter.formatToParts(now).find(part => part.type === 'timeZoneName')?.value || '';

            timeElement.textContent = timeString;
            dateElement.textContent = dateString;
            zoneInfoElement.textContent = `${timezone.split('/').pop().replace('_', ' ')} (${offsetString})`;

            // Add a subtle animation
            card.classList.add('loading');
            setTimeout(() => {
                card.classList.remove('loading');
            }, 300);

        } catch (error) {
            console.error('Error updating timezone:', error);
            timeElement.textContent = 'Error';
            dateElement.textContent = 'Invalid timezone';
            zoneInfoElement.textContent = '--';
        }
    }

    clearTimezone(timezoneNumber) {
        const card = document.getElementById(`timezone-${timezoneNumber}`);
        const timeElement = card.querySelector('.time');
        const dateElement = card.querySelector('.date');
        const zoneInfoElement = card.querySelector('.zone-info');

        timeElement.textContent = '--:--:--';
        dateElement.textContent = 'Select a timezone';
        zoneInfoElement.textContent = '--';
    }

    refreshAllTimezones() {
        Object.entries(this.selectedTimezones).forEach(([timezoneNumber, timezone]) => {
            this.updateTimezone(timezoneNumber, timezone);
        });

        // Visual feedback for refresh
        const refreshBtn = document.getElementById('refresh-btn');
        const refreshIcon = refreshBtn.querySelector('.refresh-icon');
        
        refreshIcon.style.animation = 'spin 0.5s linear';
        setTimeout(() => {
            refreshIcon.style.animation = '';
        }, 500);
    }

    startAutoRefresh() {
        this.stopAutoRefresh(); // Clear any existing interval
        
        this.autoRefreshInterval = setInterval(() => {
            this.refreshAllTimezones();
        }, 60000); // Refresh every minute
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    // Method to get current time in a specific timezone (useful for API calls)
    getTimeInTimezone(timezone) {
        try {
            const now = new Date();
            return {
                timestamp: now.getTime(),
                timezone: timezone,
                localTime: now.toLocaleString('en-US', { timeZone: timezone }),
                utcTime: now.toISOString()
            };
        } catch (error) {
            console.error('Error getting time for timezone:', timezone, error);
            return null;
        }
    }
}

// Utility functions
const utils = {
    // Get user's current timezone
    getUserTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },

    // Check if timezone is valid
    isValidTimezone(timezone) {
        try {
            Intl.DateTimeFormat(undefined, { timeZone: timezone });
            return true;
        } catch (error) {
            return false;
        }
    },

    // Format timezone offset
    getTimezoneOffset(timezone) {
        try {
            const now = new Date();
            const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
            const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
            const offset = (targetTime.getTime() - utc.getTime()) / (1000 * 60 * 60);
            
            const sign = offset >= 0 ? '+' : '-';
            const hours = Math.floor(Math.abs(offset));
            const minutes = Math.floor((Math.abs(offset) % 1) * 60);
            
            return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } catch (error) {
            return 'Unknown';
        }
    }
};

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TimezoneApp();
    
    // Make app globally accessible for debugging
    window.timezoneApp = app;
    window.timezoneUtils = utils;
    
    console.log('🌍 Timezone Checker App initialized successfully!');
    console.log('Your current timezone:', utils.getUserTimezone());
});
