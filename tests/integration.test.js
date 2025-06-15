/**
 * Integration tests for the Timezone App
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Timezone App Integration Tests', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        // Read the actual HTML file
        const htmlPath = path.join(__dirname, '..', 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Create DOM from actual HTML
        dom = new JSDOM(htmlContent, {
            url: "http://localhost",
            pretendToBeVisual: true,
            resources: "usable",
            runScripts: "dangerously"
        });

        document = dom.window.document;
        window = dom.window;
        
        global.document = document;
        global.window = window;
    });

    afterEach(() => {
        dom.window.close();
    });

    describe('HTML Structure', () => {
        test('should have correct page title', () => {
            expect(document.title).toBe('Timezone Checker');
        });

        test('should have three timezone cards', () => {
            const timezoneCards = document.querySelectorAll('.timezone-card');
            expect(timezoneCards.length).toBe(3);
        });

        test('should have three timezone selects', () => {
            const timezoneSelects = document.querySelectorAll('.timezone-select');
            expect(timezoneSelects.length).toBe(3);
            
            timezoneSelects.forEach((select, index) => {
                expect(select.dataset.timezone).toBe((index + 1).toString());
            });
        });

        test('should have refresh button', () => {
            const refreshBtn = document.getElementById('refresh-btn');
            expect(refreshBtn).toBeTruthy();
            expect(refreshBtn.textContent.trim()).toContain('Refresh Times');
        });

        test('should have auto-refresh checkbox', () => {
            const autoRefreshCheckbox = document.getElementById('auto-refresh');
            expect(autoRefreshCheckbox).toBeTruthy();
            expect(autoRefreshCheckbox.type).toBe('checkbox');
            expect(autoRefreshCheckbox.checked).toBe(true);
        });
    });

    describe('CSS Loading', () => {
        test('should reference correct CSS file', () => {
            const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
            const appCssLink = Array.from(cssLinks).find(link => 
                link.href.includes('src/css/styles.css')
            );
            expect(appCssLink).toBeTruthy();
        });
    });

    describe('JavaScript Loading', () => {
        test('should reference correct JavaScript file', () => {
            const scripts = document.querySelectorAll('script[src]');
            const appScript = Array.from(scripts).find(script => 
                script.src.includes('src/js/script.js')
            );
            expect(appScript).toBeTruthy();
        });
    });

    describe('Initial State', () => {
        test('should have empty time displays initially', () => {
            const timeDisplays = document.querySelectorAll('.time');
            timeDisplays.forEach(timeDisplay => {
                expect(timeDisplay.textContent).toBe('--:--:--');
            });
        });

        test('should have default date messages', () => {
            const dateDisplays = document.querySelectorAll('.date');
            dateDisplays.forEach(dateDisplay => {
                expect(dateDisplay.textContent).toBe('Select a timezone');
            });
        });

        test('should have default zone info', () => {
            const zoneInfos = document.querySelectorAll('.zone-info');
            zoneInfos.forEach(zoneInfo => {
                expect(zoneInfo.textContent).toBe('--');
            });
        });
    });

    describe('Responsive Design Elements', () => {
        test('should have viewport meta tag', () => {
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            expect(viewportMeta).toBeTruthy();
            expect(viewportMeta.content).toContain('width=device-width');
        });

        test('should have proper semantic structure', () => {
            expect(document.querySelector('header')).toBeTruthy();
            expect(document.querySelector('main')).toBeTruthy();
            expect(document.querySelector('footer')).toBeTruthy();
        });
    });

    describe('Accessibility', () => {
        test('should have proper heading structure', () => {
            const h1 = document.querySelector('h1');
            expect(h1).toBeTruthy();
            expect(h1.textContent).toContain('Timezone Checker');
        });

        test('should have labels for form elements', () => {
            const autoRefreshLabel = document.querySelector('label');
            expect(autoRefreshLabel).toBeTruthy();
        });

        test('should have proper button structure', () => {
            const refreshBtn = document.getElementById('refresh-btn');
            expect(refreshBtn.tagName).toBe('BUTTON');
        });
    });
});
