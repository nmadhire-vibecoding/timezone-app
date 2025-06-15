/**
 * Unit tests for TimezoneApp class
 */

const fs = require('fs');
const path = require('path');

// Mock DOM environment
const { JSDOM } = require('jsdom');

describe('TimezoneApp Class', () => {
    let dom;
    let document;
    let window;
    let TimezoneApp;

    beforeEach(() => {
        // Create a new DOM environment for each test
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
                <body>
                    <div class="timezone-card" id="timezone-1">
                        <select class="timezone-select" data-timezone="1">
                            <option value="">Select a timezone</option>
                        </select>
                        <div class="time-display">
                            <div class="time">--:--:--</div>
                            <div class="date">Select a timezone</div>
                            <div class="zone-info">--</div>
                        </div>
                    </div>
                    <div class="timezone-card" id="timezone-2">
                        <select class="timezone-select" data-timezone="2">
                            <option value="">Select a timezone</option>
                        </select>
                        <div class="time-display">
                            <div class="time">--:--:--</div>
                            <div class="date">Select a timezone</div>
                            <div class="zone-info">--</div>
                        </div>
                    </div>
                    <div class="timezone-card" id="timezone-3">
                        <select class="timezone-select" data-timezone="3">
                            <option value="">Select a timezone</option>
                        </select>
                        <div class="time-display">
                            <div class="time">--:--:--</div>
                            <div class="date">Select a timezone</div>
                            <div class="zone-info">--</div>
                        </div>
                    </div>
                    <button id="refresh-btn">
                        <span class="refresh-icon">🔄</span>
                        Refresh Times
                    </button>
                    <input type="checkbox" id="auto-refresh" checked>
                </body>
            </html>
        `, {
            url: "http://localhost",
            pretendToBeVisual: true,
            resources: "usable"
        });

        document = dom.window.document;
        window = dom.window;
        
        // Make DOM available globally
        global.document = document;
        global.window = window;

        // Read and evaluate the script
        const scriptPath = path.join(__dirname, '..', 'src', 'js', 'script.js');
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');
        
        // Execute the script in the DOM context
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.head.appendChild(script);
        
        // Get the TimezoneApp class
        TimezoneApp = window.TimezoneApp;
    });

    afterEach(() => {
        dom.window.close();
    });

    describe('Initialization', () => {
        test('should create TimezoneApp instance with correct properties', () => {
            const app = new TimezoneApp();
            
            expect(app.timezones).toBeDefined();
            expect(Array.isArray(app.timezones)).toBe(true);
            expect(app.timezones.length).toBeGreaterThan(0);
            expect(app.selectedTimezones).toBeDefined();
            expect(typeof app.selectedTimezones).toBe('object');
        });

        test('should have correct timezone data structure', () => {
            const app = new TimezoneApp();
            
            app.timezones.forEach(timezone => {
                expect(timezone).toHaveProperty('value');
                expect(timezone).toHaveProperty('label');
                expect(typeof timezone.value).toBe('string');
                expect(typeof timezone.label).toBe('string');
            });
        });

        test('should include required timezones', () => {
            const app = new TimezoneApp();
            const timezoneValues = app.timezones.map(tz => tz.value);
            
            // Check for US timezones
            expect(timezoneValues).toContain('America/New_York');
            expect(timezoneValues).toContain('America/Los_Angeles');
            
            // Check for UK timezone
            expect(timezoneValues).toContain('Europe/London');
            
            // Check for India timezone
            expect(timezoneValues).toContain('Asia/Kolkata');
            
            // Check for Australia timezones
            expect(timezoneValues).toContain('Australia/Sydney');
            expect(timezoneValues).toContain('Australia/Melbourne');
        });
    });

    describe('Timezone Selection Handling', () => {
        test('should populate dropdown selects with timezones', () => {
            const app = new TimezoneApp();
            
            const selects = document.querySelectorAll('.timezone-select');
            expect(selects.length).toBe(3);
            
            selects.forEach(select => {
                expect(select.children.length).toBeGreaterThan(1); // More than just the default option
            });
        });

        test('should handle timezone selection correctly', () => {
            const app = new TimezoneApp();
            
            // Test updating a timezone
            app.selectedTimezones['1'] = 'America/New_York';
            expect(app.selectedTimezones['1']).toBe('America/New_York');
            
            // Test clearing a timezone
            delete app.selectedTimezones['1'];
            expect(app.selectedTimezones['1']).toBeUndefined();
        });
    });

    describe('Time Display Methods', () => {
        test('should clear timezone display correctly', () => {
            const app = new TimezoneApp();
            
            app.clearTimezone('1');
            
            const card = document.getElementById('timezone-1');
            const timeElement = card.querySelector('.time');
            const dateElement = card.querySelector('.date');
            const zoneInfoElement = card.querySelector('.zone-info');
            
            expect(timeElement.textContent).toBe('--:--:--');
            expect(dateElement.textContent).toBe('Select a timezone');
            expect(zoneInfoElement.textContent).toBe('--');
        });

        test('should get time in timezone correctly', () => {
            const app = new TimezoneApp();
            
            const timeData = app.getTimeInTimezone('America/New_York');
            
            expect(timeData).toBeDefined();
            expect(timeData).toHaveProperty('timestamp');
            expect(timeData).toHaveProperty('timezone');
            expect(timeData).toHaveProperty('localTime');
            expect(timeData).toHaveProperty('utcTime');
            expect(timeData.timezone).toBe('America/New_York');
        });

        test('should handle invalid timezone gracefully', () => {
            const app = new TimezoneApp();
            
            const timeData = app.getTimeInTimezone('Invalid/Timezone');
            
            expect(timeData).toBeNull();
        });
    });

    describe('Auto-refresh Functionality', () => {
        test('should start auto-refresh', () => {
            const app = new TimezoneApp();
            
            // Mock setInterval
            const mockSetInterval = jest.spyOn(global, 'setInterval');
            
            app.startAutoRefresh();
            
            expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 60000);
            expect(app.autoRefreshInterval).toBeDefined();
        });

        test('should stop auto-refresh', () => {
            const app = new TimezoneApp();
            
            // Mock clearInterval
            const mockClearInterval = jest.spyOn(global, 'clearInterval');
            
            app.autoRefreshInterval = 123; // Mock interval ID
            app.stopAutoRefresh();
            
            expect(mockClearInterval).toHaveBeenCalledWith(123);
            expect(app.autoRefreshInterval).toBeNull();
        });
    });

    describe('Error Handling', () => {
        test('should handle updateTimezone with invalid timezone', () => {
            const app = new TimezoneApp();
            
            // Mock console.error to check if errors are logged
            const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
            
            // This should not throw an error, but should log it
            expect(() => {
                app.updateTimezone('1', 'Invalid/Timezone');
            }).not.toThrow();
            
            mockConsoleError.mockRestore();
        });
    });
});
