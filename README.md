# Timezone Checker App 🌍

A modern, responsive web application for checking current time across different timezones around the world.

## Features

- ✅ **Real-time timezone display** - Check time in 3 different timezones simultaneously
- ✅ **32+ Popular timezones** - Major cities from all continents
- ✅ **Auto-refresh functionality** - Updates every minute automatically
- ✅ **Responsive design** - Works on desktop, tablet, and mobile devices
- ✅ **Modern UI/UX** - Clean interface with smooth animations
- ✅ **No dependencies** - Pure HTML, CSS, and JavaScript

## Demo

Open `index.html` in your browser or run the development server:

```bash
npm run dev
```

## Installation

### Prerequisites
- Node.js (for development tools)
- Modern web browser

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd timezone-app

# Install development dependencies
npm install

# Start development server
npm run dev
```

## Usage

1. Open the application in your browser
2. Select timezones from the dropdown menus
3. View real-time updates for each selected timezone
4. Use the refresh button for manual updates
5. Toggle auto-refresh on/off as needed

## Development

### Project Structure
```
timezone-app/
├── src/
│   ├── css/
│   │   └── styles.css          # Main stylesheet
│   └── js/
│       └── script.js           # Main application logic
├── public/                     # Production build files
├── assets/                     # Static assets
├── index.html                  # Main HTML file
├── package.json               # Project configuration
├── README.md                  # This file
└── .gitignore                 # Git ignore rules
```

### Available Scripts

- `npm run dev` - Start development server with live reload
- `npm run build` - Build minified production files
- `npm run lint` - Run ESLint on JavaScript files
- `npm run format` - Format code with Prettier
- `npm run validate-html` - Validate HTML structure
- `npm run prepare-prod` - Prepare files for production deployment

### Supported Timezones

The app includes major timezones from:
- **Americas**: New York, Los Angeles, Chicago, Toronto, São Paulo, Mexico City
- **Europe**: London, Paris, Berlin, Rome, Madrid, Amsterdam, Moscow
- **Asia**: Tokyo, Shanghai, Hong Kong, Singapore, Dubai, Mumbai, Seoul
- **Oceania**: Sydney, Melbourne, Perth, Auckland
- **Africa**: Cairo, Johannesburg
- **Pacific**: Honolulu, UTC

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript ES6+** - Application logic with Intl API
- **Web APIs** - Intl.DateTimeFormat for timezone handling

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font: Inter by Google Fonts
- Timezone data: Browser's built-in Intl API
- Icons: Unicode emoji characters

## Future Enhancements

- [ ] Add timezone search functionality
- [ ] Save user preferences in localStorage
- [ ] Add dark/light theme toggle
- [ ] Export timezone data as JSON/CSV
- [ ] Add meeting time planner feature
- [ ] PWA support for offline usage
- [ ] Add more detailed timezone information
