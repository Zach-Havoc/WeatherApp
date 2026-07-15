# Weather App Manual

## Overview
This project is a simple weather dashboard built with HTML, CSS, and JavaScript. It uses the WeatherAPI to fetch current conditions, hourly weather, and a 7-day forecast for a selected city.

## Requirements
- A modern web browser
- Internet access to reach the WeatherAPI

## How to Run
1. Open the project folder in your editor.
2. Start a local web server from the project folder.
   - If you have Python installed, run:
     ```bash
     python -m http.server 8000
     ```
3. Open the app in your browser:
   - http://127.0.0.1:8000/
4. Enter a city name in the search box and click Search.

## How It Works
- The app sends a request to the WeatherAPI using the JavaScript fetch function.
- The response is parsed as JSON.
- The weather details are rendered into the dashboard cards.
- If the request fails, an error message is shown to the user.

## Files
- index.html: Main page structure
- styles.css: Visual styling
- script.js: Weather API logic and UI updates
