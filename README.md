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

## ✨ Features

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

