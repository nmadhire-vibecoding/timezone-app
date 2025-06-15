/**
 * Unit tests for TimezoneApp utility functions
 */

// Import the utils functions
// Since we're testing browser code, we need to simulate the browser environment
const fs = require('fs');
const path = require('path');

// Read the script file and evaluate it in a mock browser environment
const scriptPath = path.join(__dirname, '..', 'src', 'js', 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Mock DOM elements and browser APIs
global.document = {
    addEventListener: jest.fn(),
    querySelectorAll: jest.fn().mockReturnValue([]),
    getElementById: jest.fn(),
    createElement: jest.fn()
};

global.window = {
    timezoneApp: null,
    timezoneUtils: null
};

global.console = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
};

// Mock setInterval and clearInterval
global.setInterval = jest.fn();
global.clearInterval = jest.fn();

describe('Timezone Utility Functions', () => {
    let utils;

    beforeAll(() => {
        // Evaluate the script to get access to the utils object
        eval(scriptContent);
        utils = global.window.timezoneUtils;
    });

    describe('getUserTimezone', () => {
        test('should return a valid timezone string', () => {
            const timezone = utils.getUserTimezone();
            expect(typeof timezone).toBe('string');
            expect(timezone.length).toBeGreaterThan(0);
        });

        test('should return a timezone in IANA format', () => {
            const timezone = utils.getUserTimezone();
            // Should contain a forward slash for IANA format
            expect(timezone).toMatch(/\//);
        });
    });

    describe('isValidTimezone', () => {
        test('should return true for valid timezones', () => {
            expect(utils.isValidTimezone('America/New_York')).toBe(true);
            expect(utils.isValidTimezone('Asia/Kolkata')).toBe(true);
            expect(utils.isValidTimezone('Europe/London')).toBe(true);
            expect(utils.isValidTimezone('Australia/Sydney')).toBe(true);
        });

        test('should return false for invalid timezones', () => {
            expect(utils.isValidTimezone('Invalid/Timezone')).toBe(false);
            expect(utils.isValidTimezone('Asia/Delhi')).toBe(false); // Not a valid IANA timezone
            expect(utils.isValidTimezone('')).toBe(false);
            expect(utils.isValidTimezone(null)).toBe(false);
            expect(utils.isValidTimezone(undefined)).toBe(false);
        });

        test('should handle edge cases', () => {
            expect(utils.isValidTimezone('UTC')).toBe(true);
            expect(utils.isValidTimezone('GMT')).toBe(true);
            expect(utils.isValidTimezone('123')).toBe(false);
            expect(utils.isValidTimezone('random_string')).toBe(false);
        });
    });

    describe('getTimezoneOffset', () => {
        test('should return offset in correct format for valid timezones', () => {
            const offset = utils.getTimezoneOffset('America/New_York');
            expect(offset).toMatch(/^[+-]\d{2}:\d{2}$/);
        });

        test('should return "Unknown" for invalid timezones', () => {
            expect(utils.getTimezoneOffset('Invalid/Timezone')).toBe('Unknown');
            expect(utils.getTimezoneOffset('')).toBe('Unknown');
            expect(utils.getTimezoneOffset(null)).toBe('Unknown');
        });

        test('should handle UTC correctly', () => {
            const offset = utils.getTimezoneOffset('UTC');
            expect(offset).toBe('+00:00');
        });
    });
});
