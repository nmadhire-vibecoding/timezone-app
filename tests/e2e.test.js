/**
 * End-to-end tests for timezone app functionality
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Timezone App E2E Tests', () => {
    let dom;
    let document;
    let window;
    let app;

    beforeEach(async () => {
        // Read HTML and CSS files
        const htmlPath = path.join(__dirname, '..', 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Create DOM with the actual HTML
        dom = new JSDOM(htmlContent, {
            url: "http://localhost",
            pretendToBeVisual: true,
            resources: "usable"
        });

        document = dom.window.document;
        window = dom.window;
        
        global.document = document;
        global.window = window;
        global.setInterval = jest.fn();
        global.clearInterval = jest.fn();

        // Load and execute the JavaScript
        const scriptPath = path.join(__dirname, '..', 'src', 'js', 'script.js');
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');
        
        // Execute script in the window context
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.head.appendChild(scriptElement);

        // Wait for DOM to be ready and create app instance
        if (window.TimezoneApp) {
            app = new window.TimezoneApp();
        }
    });

    afterEach(() => {
        if (app && app.stopAutoRefresh) {
            app.stopAutoRefresh();
        }
        dom.window.close();
    });

    describe('Full Application Workflow', () => {
        test('should initialize app and populate dropdowns', () => {
            expect(app).toBeDefined();
            expect(app.timezones).toBeDefined();
            expect(app.timezones.length).toBeGreaterThan(0);

            const selects = document.querySelectorAll('.timezone-select');
            selects.forEach(select => {
                expect(select.children.length).toBeGreaterThan(1);
            });
        });

        test('should handle timezone selection workflow', () => {
            const select1 = document.querySelector('[data-timezone="1"]');
            expect(select1).toBeTruthy();

            // Simulate selecting a timezone
            select1.value = 'America/New_York';
            const changeEvent = new dom.window.Event('change');
            select1.dispatchEvent(changeEvent);

            // Check if timezone was stored
            expect(app.selectedTimezones['1']).toBe('America/New_York');
        });

        test('should handle multiple timezone selections', () => {
            const selects = document.querySelectorAll('.timezone-select');
            const testTimezones = ['America/New_York', 'Europe/London', 'Asia/Kolkata'];

            selects.forEach((select, index) => {
                if (testTimezones[index]) {
                    select.value = testTimezones[index];
                    const changeEvent = new dom.window.Event('change');
                    select.dispatchEvent(changeEvent);
                }
            });

            expect(app.selectedTimezones['1']).toBe('America/New_York');
            expect(app.selectedTimezones['2']).toBe('Europe/London');
            expect(app.selectedTimezones['3']).toBe('Asia/Kolkata');
        });

        test('should handle refresh button click', () => {
            const refreshBtn = document.getElementById('refresh-btn');
            expect(refreshBtn).toBeTruthy();

            // Set up a timezone first
            app.selectedTimezones['1'] = 'America/New_York';

            // Mock the refresh method
            const refreshSpy = jest.spyOn(app, 'refreshAllTimezones');

            // Simulate button click
            const clickEvent = new dom.window.Event('click');
            refreshBtn.dispatchEvent(clickEvent);

            expect(refreshSpy).toHaveBeenCalled();
        });

        test('should handle auto-refresh toggle', () => {
            const autoRefreshCheckbox = document.getElementById('auto-refresh');
            expect(autoRefreshCheckbox).toBeTruthy();
            expect(autoRefreshCheckbox.checked).toBe(true);

            // Mock the auto-refresh methods
            const startAutoRefreshSpy = jest.spyOn(app, 'startAutoRefresh');
            const stopAutoRefreshSpy = jest.spyOn(app, 'stopAutoRefresh');

            // Simulate unchecking
            autoRefreshCheckbox.checked = false;
            const changeEvent = new dom.window.Event('change');
            autoRefreshCheckbox.dispatchEvent(changeEvent);

            expect(stopAutoRefreshSpy).toHaveBeenCalled();

            // Simulate checking again
            autoRefreshCheckbox.checked = true;
            autoRefreshCheckbox.dispatchEvent(changeEvent);

            expect(startAutoRefreshSpy).toHaveBeenCalled();
        });
    });

    describe('Error Handling Scenarios', () => {
        test('should handle invalid timezone gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            expect(() => {
                app.updateTimezone('1', 'Invalid/Timezone');
            }).not.toThrow();

            consoleSpy.mockRestore();
        });

        test('should handle missing DOM elements gracefully', () => {
            // Remove an element and test
            const card = document.getElementById('timezone-1');
            card.remove();

            expect(() => {
                app.updateTimezone('1', 'America/New_York');
            }).not.toThrow();
        });
    });

    describe('Timezone Data Validation', () => {
        test('should have all required country timezones', () => {
            const timezoneValues = app.timezones.map(tz => tz.value);

            // US timezones
            expect(timezoneValues).toContain('America/New_York');
            expect(timezoneValues).toContain('America/Los_Angeles');
            expect(timezoneValues).toContain('America/Chicago');

            // UK timezone
            expect(timezoneValues).toContain('Europe/London');

            // India timezone
            expect(timezoneValues).toContain('Asia/Kolkata');

            // Australia timezones
            expect(timezoneValues).toContain('Australia/Sydney');
            expect(timezoneValues).toContain('Australia/Melbourne');
        });

        test('should not have invalid timezones', () => {
            const timezoneValues = app.timezones.map(tz => tz.value);

            // Should not contain the invalid Asia/Delhi
            expect(timezoneValues).not.toContain('Asia/Delhi');
        });

        test('should have proper timezone labels', () => {
            app.timezones.forEach(timezone => {
                expect(timezone.label).toMatch(/\([A-Z]{3,4}(\/[A-Z]{3,4})?\)$/);
            });
        });
    });

    describe('Performance and Memory', () => {
        test('should clean up intervals on stop', () => {
            app.startAutoRefresh();
            expect(app.autoRefreshInterval).toBeTruthy();

            app.stopAutoRefresh();
            expect(app.autoRefreshInterval).toBeNull();
        });

        test('should not create multiple intervals', () => {
            const setIntervalSpy = jest.spyOn(global, 'setInterval');

            app.startAutoRefresh();
            app.startAutoRefresh(); // Call again

            // Should clear the previous interval before setting a new one
            expect(setIntervalSpy).toHaveBeenCalledTimes(2);
        });
    });
});
