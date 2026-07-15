const API_KEY = '962b24d1573b4e0eaa905253261507';
const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';
const DEFAULT_CITY = 'Irvine';

// Store references to the main UI elements that will be updated with weather data.
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const statusMessage = document.getElementById('status-message');

const currentDateEl = document.getElementById('current-date');
const cityNameEl = document.getElementById('city-name');
const conditionTextEl = document.getElementById('condition-text');
const mainDegreesEl = document.getElementById('main-degrees');
const highLowEl = document.getElementById('high-low');
const weatherIconLargeEl = document.getElementById('weather-icon-large');

const feelsLikeEl = document.getElementById('feels-like');
const windEl = document.getElementById('wind');
const visibilityEl = document.getElementById('visibility');
const humidityEl = document.getElementById('humidity');
const pressureEl = document.getElementById('pressure');

const hourlyForecastEl = document.getElementById('hourly-forecast');
const forecastDaysEl = document.getElementById('forecast-days');

// Updates the status text shown above the forecast cards.
function setStatus(message, isError = false) {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${isError ? 'error' : 'info'}`;
}

// Maps a weather condition description to a matching Material icon name.
function getMaterialIcon(conditionText) {
  const text = conditionText.toLowerCase();

  if (text.includes('sun') || text.includes('clear')) return 'wb_sunny';
  if (text.includes('cloud')) return 'cloud';
  if (text.includes('rain') || text.includes('drizzle')) return 'rainy';
  if (text.includes('snow')) return 'ac_unit';
  if (text.includes('mist') || text.includes('fog')) return 'foggy';
  if (text.includes('thunder')) return 'thunderstorm';

  return 'wb_cloudy';
}

// Fills the main current-weather card with the latest weather information.
function updateCurrentWeather(data) {
  const current = data.current;
  const location = data.location;
  const forecastDay = data.forecast.forecastday[0];

  const localTime = new Date(location.localtime);
  currentDateEl.textContent = localTime.toLocaleString('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit'
  });

  cityNameEl.textContent = `${location.name}, ${location.country}`;
  conditionTextEl.textContent = current.condition.text;
  mainDegreesEl.textContent = `${Math.round(current.temp_c)}°`;
  highLowEl.textContent = `H ${Math.round(forecastDay.day.maxtemp_c)}° L ${Math.round(forecastDay.day.mintemp_c)}°`;
  weatherIconLargeEl.textContent = getMaterialIcon(current.condition.text);

  feelsLikeEl.textContent = `${Math.round(current.feelslike_c)}°`;
  windEl.textContent = `${Math.round(current.wind_mph)} MPH`;
  visibilityEl.textContent = `${Math.round(current.vis_km)} KM`;
  humidityEl.textContent = `${current.humidity}%`;
  pressureEl.textContent = `${current.pressure_mb} MB`;
}

// Builds the hourly weather list shown in the horizontal forecast row.
function renderHourlyForecast(data) {
  if (!hourlyForecastEl) return;

  hourlyForecastEl.innerHTML = '';
  const hours = data.forecast.forecastday[0].hour.slice(0, 10);

  hours.forEach((hour, index) => {
    const item = document.createElement('div');
    item.className = 'hourly-item';

    const label = index === 0 ? 'Now' : new Date(hour.time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    });

    item.innerHTML = `
      <span class="time">${label}</span>
      <span class="material-symbols-outlined icon">${getMaterialIcon(hour.condition.text)}</span>
      <span class="temp">${Math.round(hour.temp_c)}°</span>
    `;

    hourlyForecastEl.appendChild(item);
  });
}

// Creates the 7-day forecast cards at the bottom of the dashboard.
function renderForecastDays(data) {
  if (!forecastDaysEl) return;

  forecastDaysEl.innerHTML = '';
  const days = data.forecast.forecastday.slice(0, 7);

  days.forEach((day) => {
    const column = document.createElement('div');
    column.className = 'day-column';

    const date = new Date(day.date);
    column.innerHTML = `
      <span class="day-name">${date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
      <span class="day-date">${date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</span>
      <span class="material-symbols-outlined icon">${getMaterialIcon(day.day.condition.text)}</span>
      <span class="range">H ${Math.round(day.day.maxtemp_c)}° L ${Math.round(day.day.mintemp_c)}°</span>
    `;

    forecastDaysEl.appendChild(column);
  });
}

// Fetches weather data for a city and updates the UI on success or shows an error on failure.
async function fetchWeather(city) {
  setStatus('Loading weather...');

  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`);

    if (!response.ok) {
      throw new Error('City not found. Please try another location.');
    }

    const data = await response.json();

    if (!data || !data.current) {
      throw new Error('Weather data could not be loaded.');
    }

    updateCurrentWeather(data);
    renderHourlyForecast(data);
    renderForecastDays(data);
    setStatus(`Showing weather for ${data.location.name}.`);
  } catch (error) {
    console.error(error);
    setStatus(error.message || 'Unable to load weather right now.', true);
  }
}

// Listen for the search form submission and request weather for the typed city.
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    setStatus('Enter a city name to search.', true);
    return;
  }

  fetchWeather(city);
});

// Load the default city when the page first opens.
fetchWeather(DEFAULT_CITY);
