# Weather Dashboard - Advanced Climate Analytics Platform

A modern, fully-featured weather dashboard application built with vanilla HTML, CSS, and JavaScript. This application provides real-time weather data, hourly forecasts, 7-day extended predictions, and advanced climate analytics with interactive charts.

---

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Integration](#api-integration)
- [Architecture & Design](#architecture--design)
- [Code Structure](#code-structure)
- [Features in Detail](#features-in-detail)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Browser Support](#browser-support)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features kier pogi

### Core Weather Functionality
- **Real-Time Current Weather Display**: Shows current temperature, weather condition, "feels like" temperature, and high/low forecasts
- **Intelligent Search & Autocomplete**: Dynamic city search with autocomplete suggestions powered by OpenMeteo Geocoding API
- **Hourly Forecast**: 10-hour scrollable forecast with temperatures and weather icons
- **7-Day Extended Forecast**: Full weekly weather predictions with daily high/low temperatures
- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit with one click

### Advanced Analytics
- **Climate Outlook Chart**: Interactive dual-axis Chart.js visualization displaying:
  - Temperature trends over the next 12 hours (left Y-axis)
  - Humidity percentage fluctuations (right Y-axis)
  - Real-time temperature unit conversion (°C/°F)
- **Dynamic Analytics Insights**: Text-based weather analysis and trend interpretation

### User Experience
- **GPS Location Detection**: Automatic weather loading based on device location (with user permission)
- **Favorites Management**: Save frequently-checked cities to a persistent sidebar
- **Loading Shimmer Effect**: Professional loading animation during data fetches
- **Responsive Tablet Design**: Optimized for tablet and large screen display (4:3 aspect ratio)
- **Modern Dark Theme**: Gradient backgrounds with color-coded weather themes
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation support

### Weather Metrics Display
- **Current Conditions**: Temperature, weather description, icon animation
- **Advanced Metrics Strip**:
  - Feels Like temperature
  - Wind speed (MPH)
  - Visibility (Miles)
  - Humidity percentage
  - Surface pressure (Inches)

---

## 🔧 Technology Stack

### Frontend
- **HTML5**: Semantic markup with ARIA labels for accessibility
- **CSS3**: Modern styling with CSS custom properties (variables), gradients, animations, and glassmorphism effects
- **JavaScript (Vanilla)**: No frameworks; lightweight and performant
  - Fetch API for HTTP requests
  - Promise-based async/await patterns
  - DOM manipulation and event binding

### External Libraries & APIs
- **Chart.js**: CDN-loaded charting library for analytics visualization
- **Google Fonts**: "Inter" font family for modern typography
- **Material Symbols Icons**: Icon set for weather conditions and UI elements
- **OpenMeteo Weather API**: Free, open-source weather data provider
- **OpenMeteo Geocoding API**: Location search and coordinate resolution

### Browser APIs
- **Geolocation API**: GPS-based automatic weather location detection
- **LocalStorage**: Persistent storage for favorite cities

---

## 📁 Project Structure

```
WeatherApp/
├── index.html       # Main HTML structure and layout
├── styles.css       # Complete styling, animations, and responsive design
├── script.js        # Core JavaScript engine (WeatherDashboard class)
└── README.md        # This documentation file
```

### File Sizes
- **index.html**: ~5 KB - Semantic HTML with Material Icons integration
- **styles.css**: ~15 KB - Comprehensive styling with animations and theme system
- **script.js**: ~25+ KB - Feature-rich WeatherDashboard class with API integration
- **Total**: ~45 KB (highly performant for a feature-rich weather app)

---

## 📋 Requirements

### Minimum System Requirements
- **Browser**: Any modern browser released after 2020 (Chrome, Firefox, Safari, Edge)
- **Internet Connection**: Required for API calls to OpenMeteo services
- **Screen Size**: Minimum 1100px width for optimal tablet-like layout (responsive at smaller sizes)

### Optional
- **Python 3.x**: For local development server (alternatives: Node.js, PHP)
- **GPS/Location Permissions**: For automatic geolocation-based weather (optional)

---

## ⚙️ Installation & Setup

### Option 1: Python (Recommended for Quick Start)

1. **Clone or Download the Project**
   ```bash
   git clone <repository-url>
   cd WeatherApp
   ```

2. **Start Local Web Server**
   ```bash
   # Python 3.x
   python -m http.server 8000

   # Python 2.x (deprecated but supported)
   python -m SimpleHTTPServer 8000
   ```

3. **Access in Browser**
   - Open: `http://127.0.0.1:8000`
   - The app loads with Manila as the default location

### Option 2: Node.js & http-server

1. **Install http-server**
   ```bash
   npm install -g http-server
   ```

2. **Start Server**
   ```bash
   http-server
   ```

3. **Access**
   - Open: `http://localhost:8080`

### Option 3: Live Server (VS Code Extension)

1. **Install "Live Server" Extension** in VS Code
2. **Right-click index.html** → "Open with Live Server"
3. Browser opens automatically

### Option 4: Direct File Access (Not Recommended)

- Simply open `index.html` in your browser
- **Note**: Some browser features may not work due to CORS restrictions and security policies

---

## 🎮 Usage Guide

### Basic Search
1. **Enter City Name**: Type a city name in the search box (minimum 2 characters)
2. **Autocomplete Suggestions**: A dropdown appears with matching cities
3. **Select & View**: Click a suggestion or press Enter to load weather
4. **Alternative**: Use arrow keys to navigate suggestions, Enter to select

### Navigation & Controls

#### Temperature Unit Toggle
- Click **"°C / °F"** in the header to switch temperature units
- The toggle indicator shows the active unit
- The analytics chart updates instantly

#### Add to Dashboard (Favorites)
- Click **"+ Add to Dashboard"** button to save current city
- Saved cities appear in the left sidebar for quick access
- Click any favorite city to instantly load its weather

#### Current Location
- On first load, the app may request GPS permission
- Grant permission to automatically load weather for your location
- If denied, the app defaults to Manila

### Weather Information Display

#### Hero Section (Large Temperature Card)
- **City Name**: Current location being viewed
- **Date & Time**: Today's date and current time
- **Large Temperature Display**: Main current temperature
- **High/Low Forecast**: Today's expected temperature range
- **Weather Icon**: Animated icon representing conditions
- **Background Gradient**: Changes color based on weather type

#### Metrics Strip
Below the main temperature, five key metrics display:
- **Feels Like**: Wind-adjusted temperature perception
- **Wind**: Current wind speed in MPH
- **Visibility**: Horizontal visibility distance in miles
- **Humidity**: Relative humidity percentage
- **Pressure**: Atmospheric pressure in inches

#### Hourly Forecast
- **Format**: 10-hour timeline, horizontally scrollable
- **Content**: Time label, weather icon, temperature
- **"Now"** label for the current hour

#### 7-Day Forecast
- **Format**: Daily cards showing day name, date, icon, high/low
- **Coverage**: Full week of predictions
- **Scrollable**: Horizontal scroll for narrow screens

#### Climate Analytics Chart
- **Dual-Axis Design**: 
  - Left axis (red): Temperature in selected unit (°C/°F)
  - Right axis (blue): Humidity percentage (0-100%)
- **Time Period**: 12-hour forecast window
- **Interactivity**: Hover over points to see exact values
- **Unit Aware**: Chart updates when temperature unit is toggled

---

## 🌐 API Integration

### Primary Data Source: OpenMeteo Weather API

**Endpoint**: `https://api.open-meteo.com/v1/forecast`

**Request Parameters**:
- `latitude` & `longitude`: Geographic coordinates
- `current`: Real-time weather data
- `hourly`: Hour-by-hour forecast (temperature, humidity, weather code)
- `daily`: Daily aggregates (max/min temperature, weather code)
- `temperature_unit`: Set to Celsius (converted to Fahrenheit on client)
- `wind_speed_unit`: MPH
- `precipitation_unit`: Inches
- `timezone`: Automatic based on coordinates

**Response Data Structure**:
```json
{
  "current": {
    "temperature_2m": 22,
    "relative_humidity_2m": 72,
    "apparent_temperature": 20,
    "weather_code": 2,
    "surface_pressure": 1025,
    "wind_speed_10m": 18,
    "visibility": 10000
  },
  "hourly": {
    "time": ["2024-01-15T00:00", ...],
    "temperature_2m": [22, 21, ...],
    "relative_humidity_2m": [72, 75, ...],
    "weather_code": [2, 2, ...]
  },
  "daily": {
    "time": ["2024-01-15", ...],
    "temperature_2m_max": [28, 27, ...],
    "temperature_2m_min": [18, 17, ...],
    "weather_code": [2, 3, ...]
  }
}
```

### Secondary Data Source: OpenMeteo Geocoding API

**Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`

**Features**:
- Free location name-to-coordinates resolution
- Autocomplete suggestions
- Multi-language support
- Returns: name, coordinates, country, admin regions

**Rate Limiting**: 
- No official limits for these open APIs
- Requests are debounced (300ms) to prevent excessive calls

### Weather Code Reference (WMO Codes)

The app includes a comprehensive metadata mapping:

```
0 = Sunny                      → sun icon, warm gradient
1 = Mostly Sunny               → sun icon, warm gradient
2 = Partly Cloudy              → cloud with sun, mixed gradient
3 = Cloudy                     → cloud icon, gray gradient
45 = Foggy                     → fog icon, dark gradient
48 = Rime Fog                  → fog icon, dark gradient
51 = Light Drizzle             → drizzle icon, cool gradient
61 = Slight Rain               → rain icon, stormy gradient
63 = Moderate Rain             → rain icon, stormy gradient
71 = Slight Snow                → snow icon, cool gradient
77 = Snow Grains               → snow icon, cool gradient
85 = Snow Showers              → snow rain icon, cool gradient
95 = Thunderstorm              → thunderstorm icon, dark gradient
```

---

## 🏗️ Architecture & Design

### Design Patterns

#### Object-Oriented Architecture
The entire application is encapsulated in a single `WeatherDashboard` class:
- **State Management**: Centralized in `this.state` object
- **DOM Caching**: All DOM elements cached in `this.dom` for performance
- **Lifecycle Methods**: Organized initialization, binding, and rendering methods

#### State Object Structure
```javascript
this.state = {
  unit: 'C',                    // Temperature unit: C or F
  payload: null,                // Current API response data
  city: "Manila",               // Current city name
  lat: 14.5995,                 // Current latitude
  lon: 120.9842,                // Current longitude
  chartInstance: null           // Chart.js instance reference
}
```

#### Event-Driven Architecture
- Search form submission triggers city lookup
- Autocomplete input triggers debounced suggestion fetching
- Click handlers for favorites and unit toggle
- Keyboard navigation for autocomplete suggestions

#### Async/Await Pattern
All API calls use modern Promise-based async/await:
```javascript
async fetchWeatherCoordinates(lat, lon) {
  const res = await fetch(endpoint);
  this.state.payload = await res.json();
  this.updateUI();
}
```

### UI/UX Design Principles

#### Color Scheme
- **Primary Background**: Deep navy (#0b0c16)
- **Card Background**: Slightly lighter navy (#131526)
- **Accent Colors**: Bright blue (#2962ff) for interactive elements
- **Text**: White for primary, muted gray (#8e92b2) for secondary
- **Dynamic Themes**: Weather-specific gradient backgrounds

#### Typography
- **Font Family**: Inter (modern, highly readable sans-serif)
- **Size Hierarchy**: 24px headings, 16px body, 12px labels
- **Weight Variation**: 300-600 for visual hierarchy

#### Responsive Design
- **Base Layout**: 4:3 aspect ratio tablet optimized (1100px max-width)
- **Flexible Grids**: CSS Grid for main layout, Flexbox for components
- **Media Queries**: Adapt to smaller screens
- **Touch-Friendly**: Adequate padding and tap targets

#### Animation & Micro-interactions
- **Loading Shimmer**: Subtle animation while fetching data
- **Icon Rotation**: Weather icon spins on initial render
- **Dropdown Animation**: Smooth fade-in for autocomplete
- **Hover States**: Interactive feedback on clickable elements
- **Smooth Transitions**: 0.15-0.6s easing functions

---

## 💻 Code Structure

### JavaScript Class Methods

#### Initialization Methods
- `constructor()`: Initialize state and metadata
- `async init()`: Bootstrap the entire application
- `cacheDOM()`: Select and store all DOM element references
- `injectAnalyticsCard()`: Programmatically add chart section to HTML
- `bindEvents()`: Attach event listeners to form, buttons, toggles

#### API & Data Fetching
- `async fetchLocationCoordinatesByQuery(cityName)`: Convert city name to coordinates
- `async fetchWeatherCoordinates(lat, lon)`: Fetch weather data from OpenMeteo
- `async fetchAutocompleteSuggestions(query)`: Get city suggestions during typing
- `tryAutomaticGPSLookup()`: Request device location on startup

#### UI Rendering Methods
- `updateUI()`: Master update function calling all render methods
- `renderHeroSection()`: Update main temperature card
- `renderMetrics()`: Populate the metrics strip
- `renderForecasts()`: Generate hourly and 7-day forecast HTML
- `renderDynamicAnalytics()`: Create/update Chart.js visualization
- `renderFavoritesSidebar()`: Display saved cities in left panel

#### Utility Methods
- `formatTemp(celsius)`: Convert temperature based on unit setting
- `updateSubmetricValue(label, value)`: Update individual metric
- `setStatus(message, isError)`: Display status/error messages
- `applyLoadingShimmer()`: Add loading animation class
- `removeLoadingShimmer()`: Remove loading animation

#### Autocomplete Methods
- `bindAutocomplete()`: Set up search field listeners
- `renderSuggestions(results)`: Generate suggestion list HTML
- `selectSuggestion(result)`: Handle suggestion selection
- `closeDropdown()`: Hide and clear suggestions

#### Favorites Management
- `saveCurrentCityToFavorites()`: Add current city to localStorage
- `populateMockFavoritesIfNeeded()`: Initialize defaults
- `renderFavoritesSidebar()`: Display favorite cities list

#### Chart Integration
- `loadChartJS()`: Dynamically load Chart.js library from CDN
- `renderDynamicAnalytics()`: Full chart creation with dual axes

---

## 📊 Features in Detail

### Advanced Analytics Chart

The climate outlook chart provides sophisticated weather visualization:

**Chart Type**: Line chart with dual Y-axes

**Left Axis (Temperature)**:
- Shows temperature trend over 12 hours
- Color: Red (#f87171) with gradient fill
- Unit-aware: Displays °C or °F based on toggle

**Right Axis (Humidity)**:
- Shows humidity percentage (0-100%)
- Color: Blue (#60a5fa) with dashed line and gradient fill
- Always displayed as percentage

**Interactivity**:
- Hover over data points to see exact values
- Legend toggleable to show/hide datasets
- Responsive: Automatically adjusts to container size
- Chart destroyed and recreated when unit changes to ensure accuracy

**Data Points**: 12 hourly forecasts starting from current time

### City Favorites System

**Storage**: Browser localStorage under "savedCities" key

**Format**: JSON array of city objects
```javascript
[
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 }
]
```

**Functionality**:
- Click "Add to Dashboard" to save current city
- Favorite cities appear as clickable buttons in left sidebar
- Click favorite button to instantly load that city's weather
- Favorites persist across browser sessions

### Autocomplete Search

**Trigger**: Start typing in search box (minimum 2 characters)

**Behavior**:
- 300ms debounce prevents excessive API calls
- Shows up to 6 suggestions
- Displays city name, region, and country
- Keyboard navigation (Arrow Up/Down, Enter, Escape)
- Click or Enter to select

**Error Handling**: Shows "No locations found" or "Could not fetch suggestions" messages

### Loading Shimmer Effect

**Purpose**: Visual feedback during API calls

**Implementation**: CSS animation adds shimmer class to UI elements

**Duration**: Continues until data arrives or error occurs

### GPS Geolocation

**Trigger**: Application startup (if enabled in browser settings)

**Process**:
1. Request device location via Geolocation API
2. Convert coordinates to weather data
3. Display "Current Location" as city name
4. Load weather for user's coordinates

**Fallback**: If denied or unavailable, app loads default city (Manila)

---

## 🎨 Customization

### Changing Default City

Edit [script.js](script.js) constructor:
```javascript
this.state = {
  city: "YourCityName",  // Change this
  lat: 40.7128,          // Change to your city's latitude
  lon: -74.0060          // Change to your city's longitude
}
```

### Modifying Color Scheme

All colors use CSS variables defined in [styles.css](styles.css):
```css
:root {
    --bg-color: #0b0c16;           /* Background */
    --card-bg: #131526;             /* Card backgrounds */
    --text-main: #ffffff;           /* Primary text */
    --text-muted: #8e92b2;          /* Secondary text */
    --accent-blue: #2962ff;         /* Interactive elements */
    --accent-purple: #7b1fa2;       /* Highlights */
    --border-color: #1e223d;        /* Borders */
}
```

Change these values to customize the entire theme instantly.

### Adjusting Weather Metadata

Customize weather code icons and colors in [script.js](script.js):
```javascript
this.metadata = {
    0: { 
        text: "Sunny", 
        icon: "wb_sunny",  // Material Symbol name
        theme: "linear-gradient(...)"  // Gradient background
    },
    // ... more codes
}
```

### Changing Forecast Duration

**Hourly Forecast**: Edit [script.js](script.js) `renderForecasts()`:
```javascript
Array.from({ length: 10 })  // Change 10 to desired hours
```

**7-Day Forecast**: Uses full daily data, no modification needed

**Analytics Chart**: Change `datapointsCount` in `renderDynamicAnalytics()`:
```javascript
const datapointsCount = 12;  // Change 12 to desired hours
```

### Custom API Endpoints

To use different weather/geocoding APIs:

1. **Weather API Alternative**: 
   - WeatherAPI.com (requires API key)
   - OpenWeatherMap (requires API key)
   - Weather.gov (US only, free)

2. **Geocoding Alternative**:
   - Replace OpenMeteo geocoding with Google Maps API
   - Requires API key and billing setup

3. **Implementation**: Update fetch URLs in `fetchWeatherCoordinates()` and `fetchAutocompleteSuggestions()` methods

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### "API Error: Weather telemetry rejected"
**Cause**: Server error or network issue
**Solution**: 
- Check internet connection
- Verify coordinates are valid
- Try different city
- Check browser console for detailed error

#### Autocomplete not appearing
**Cause**: Insufficient characters typed or API error
**Solution**:
- Type at least 2 characters
- Check network tab in DevTools
- Ensure geocoding API is accessible
- Clear browser cache and try again

#### Chart not displaying
**Cause**: Chart.js failed to load or DOM not ready
**Solution**:
- Check browser console for script errors
- Verify CDN is accessible
- Check that canvas element exists
- Refresh page

#### GPS not working
**Cause**: Permission denied or browser doesn't support geolocation
**Solution**:
- Check browser permissions settings
- Allow geolocation when prompted
- Use HTTPS (some browsers require it)
- Try manual city search instead

#### Favorites not saving
**Cause**: localStorage disabled or full
**Solution**:
- Check browser privacy settings
- Enable localStorage
- Clear browser cache/data
- Try incognito/private mode (temporary storage)

#### Styles not loading correctly
**Cause**: CSS file not found or cache issue
**Solution**:
- Hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
- Check Network tab to verify CSS loads
- Clear browser cache
- Verify styles.css in same directory

#### Unit conversion not working
**Cause**: JavaScript error or state not updating
**Solution**:
- Check browser console for errors
- Ensure weather data loaded first
- Try refresh
- Check that Chart.js updated properly

---

## 🌍 Browser Support

### Fully Supported (Tested & Working)
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Chrome/Firefox (responsive design)

### Partially Supported
- ⚠️ IE 11: Missing ES6 features, no async/await
- ⚠️ Opera: Minor visual differences

### Not Supported
- ❌ Internet Explorer 10 and below
- ❌ Very old mobile browsers

### Feature-Specific Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Fetch API | ✅ | ✅ | ✅ | ✅ |
| Async/Await | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Chart.js | ✅ | ✅ | ✅ | ✅ |
| Geolocation | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| Material Symbols | ✅ | ✅ | ⚠️ | ✅ |

---

## 🚀 Future Enhancements

### Potential Features & Improvements

#### Weather Predictions
- [ ] AI-powered weather trend predictions
- [ ] Historical weather data comparison
- [ ] Weather alerts and notifications
- [ ] Extreme weather warnings (heatwaves, storms, etc.)

#### User Experience
- [ ] Dark/Light theme toggle
- [ ] Customizable dashboard layout
- [ ] Weather radar integration
- [ ] Air quality index (AQI) display
- [ ] UV index and sun exposure timing
- [ ] Pollen count for allergy tracking

#### Data & Analytics
- [ ] Weather history graphs (past week/month/year)
- [ ] Precipitation likelihood percentages
- [ ] Sunrise/sunset times
- [ ] Moon phase information
- [ ] Air pressure trends

#### Performance & Technical
- [ ] Service Worker for offline capability
- [ ] Progressive Web App (PWA) conversion
- [ ] Data caching strategies
- [ ] API response optimization
- [ ] Performance monitoring and analytics

#### Social & Sharing
- [ ] Share current weather via link/QR code
- [ ] Weather comparison between cities
- [ ] Weather-based activity recommendations
- [ ] Social media integration
- [ ] Export weather reports (PDF/CSV)

#### Mobile Experience
- [ ] Native mobile app (React Native/Flutter)
- [ ] Push notifications for severe weather
- [ ] Voice input for city search
- [ ] Swipe gestures for navigation
- [ ] Always-on weather widget

---

## 📝 Code Examples

### Adding a New Weather Metric

To add a new metric to the metrics strip:

1. **Add to HTML** in [index.html](index.html):
   ```html
   <div class="metric-item">
       <span class="label">UV Index</span>
       <span class="value" id="uv-index">5</span>
   </div>
   ```

2. **Update API call** in `fetchWeatherCoordinates()`:
   ```javascript
   const endpoint = `...&current=...,uv_index&...`;
   ```

3. **Add update method** in [script.js](script.js):
   ```javascript
   renderMetrics() {
       // ... existing metrics ...
       this.updateSubmetricValue("UV Index", `${current.uv_index}`);
   }
   ```

### Creating a Custom Weather Theme

Add a new weather code mapping:
```javascript
this.metadata = {
    // ... existing codes ...
    98: { 
        text: "Custom Weather",
        icon: "wb_cloud",
        theme: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
}
```

### Implementing Alternative Temperature Unit

```javascript
formatTemp(celsius) {
    if (this.state.unit === 'F') {
        const fahrenheit = Math.round((celsius * 9 / 5) + 32);
        return `${fahrenheit}°`;
    }
    return `${Math.round(celsius)}°`;
}
```

---

## 📞 Support & Contributing

### Getting Help
- Check the Troubleshooting section above
- Review browser console for error messages
- Verify all files are in the same directory
- Ensure internet connection is active

### Contributing Guidelines
- Fork the repository
- Create feature branches
- Submit pull requests with descriptions
- Test across multiple browsers
- Document any new features

---

## 📄 License

This project is provided as-is for educational and personal use.

---

## 🙏 Acknowledgments

- **OpenMeteo**: Free, open-source weather and geocoding APIs
- **Google Fonts**: Inter typography
- **Material Design**: Icon set and design principles
- **Chart.js**: Data visualization library

---

**Weather Dashboard © 2024 | Built with ❤️ using vanilla JavaScript**

Last Updated: January 15, 2024 | Version: 2.0
