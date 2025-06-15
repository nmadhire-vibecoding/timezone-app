// Setup file for Jest tests
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock DOM methods that might not be available in jsdom
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock Intl if needed for older Node versions
if (!global.Intl) {
    global.Intl = {
        DateTimeFormat: jest.fn().mockImplementation(() => ({
            format: jest.fn().mockReturnValue('12:00:00'),
            formatToParts: jest.fn().mockReturnValue([
                { type: 'timeZoneName', value: 'IST' }
            ])
        }))
    };
}
