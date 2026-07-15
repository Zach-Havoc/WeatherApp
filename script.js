/**
 * Weather Dashboard Core Integration Engine (Refactored & Enhanced)
 * Featuring: Theme Engine (Dark/Light), Keyboard Shortcuts Interface, 
 * Dynamic Analytics, and Scrollable Sidebar Locations.
 */

class WeatherDashboard {
    constructor() {
        // --- Application State ---
        this.state = {
            unit: 'C',
            payload: null,
            city: "Manila",
            lat: 14.5995,
            lon: 120.9842,
            chartInstance: null,
            theme: localStorage.getItem("weatherDashboardTheme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        };

        // --- WMO Weather Metadata ---
        this.metadata = {
            0: { text: "Sunny", icon: "wb_sunny", theme: "linear-gradient(135deg, #FF9900 0%, #FF5E62 100%)" },
            1: { text: "Mostly Sunny", icon: "wb_sunny", theme: "linear-gradient(135deg, #FF9900 0%, #FF5E62 100%)" },
            2: { text: "Partly Cloudy", icon: "partly_cloudy_day", theme: "linear-gradient(135deg, #4DA0B0 0%, #D39D38 100%)" },
            3: { text: "Cloudy", icon: "cloud", theme: "linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)" },
            45: { text: "Foggy", icon: "foggy", theme: "linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)" },
            48: { text: "Rime Fog", icon: "foggy", theme: "linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)" },
            51: { text: "Light Drizzle", icon: "grain", theme: "linear-gradient(135deg, #373B44 0%, #4286f4 100%)" },
            61: { text: "Slight Rain", icon: "rainy", theme: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)" },
            63: { text: "Moderate Rain", icon: "rainy", theme: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)" },
            71: { text: "Slight Snow", icon: "cloudy_snowing", theme: "linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)" },
            77: { text: "Snow Grains", icon: "cloudy_snowing", theme: "linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)" },
            85: { text: "Snow Showers", icon: "rainy_snow", theme: "linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)" },
            95: { text: "Thunderstorm", icon: "thunderstorm", theme: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" }
        };
    }

    // --- Initialization ---
    async init() {
        this.injectGlobalStyles();
        await this.loadChartJS();
        this.cacheDOM();
        this.injectAnalyticsCard();
        this.injectFeatureControls(); // Injects individual icon buttons for Theme and Shortcuts
        this.injectHelpModal();
        this.applyTheme();
        this.bindEvents();
        this.bindKeyboardShortcuts();
        this.populateMockFavoritesIfNeeded();
        this.renderFavoritesSidebar();

        this.applyLoadingShimmer();
        this.fetchWeatherCoordinates(this.state.lat, this.state.lon);
        this.tryAutomaticGPSLookup();
    }

    loadChartJS() {
        return new Promise((resolve) => {
            if (window.Chart) return resolve();
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = () => resolve();
            document.head.appendChild(script);
        });
    }

    cacheDOM() {
        this.dom = {
            searchForm: document.getElementById("search-form"),
            cityInput: document.getElementById("city-input"),
            suggestionsEl: document.getElementById("search-suggestions"),
            unitToggle: document.querySelector(".unit-toggle"),
            addDashboardBtn: document.querySelector(".btn-add-dashboard"),
            sidebarContainer: document.querySelector(".location-list-card"),
            heroCard: document.querySelector(".current-weather-card"),
            dateEl: document.getElementById("current-date"),
            cityNameEl: document.getElementById("city-name"),
            conditionTextEl: document.getElementById("condition-text"),
            largeIconEl: document.getElementById("weather-icon-large"),
            mainDegreesEl: document.getElementById("main-degrees"),
            highLowEl: document.getElementById("high-low"),
            hourlyContainer: document.getElementById("hourly-forecast"),
            daysContainer: document.getElementById("forecast-days"),
            lifestyleBadge: document.getElementById("lifestyle-badge"),
            statusBox: document.getElementById("status-message")
        };
    }

    injectAnalyticsCard() {
        const rightCol = document.querySelector(".right-column");
        if (!rightCol) return;

        if (document.getElementById("analytics-chart-section")) return;

        const chartSection = document.createElement("section");
        chartSection.id = "analytics-chart-section";
        chartSection.className = "card analytics-graph-card";
        chartSection.innerHTML = `
            <div class="analytics-header">
                <h3>Climate Outlook &amp; Trends</h3>
                <span class="analytics-subtitle">24-Hour Temperature vs Humidity Analytics</span>
            </div>
            <div class="chart-wrapper" style="position: relative; height: 220px;">
                <canvas id="weatherAnalyticsChart"></canvas>
            </div>
            <div id="weather-analytics-insights"></div>
        `;
        
        const extendedForecast = document.querySelector(".extended-forecast-card");
        if (extendedForecast) {
            rightCol.insertBefore(chartSection, extendedForecast);
        } else {
            rightCol.appendChild(chartSection);
        }
        
        this.dom.chartCanvas = document.getElementById("weatherAnalyticsChart");
        this.dom.insightsContainer = document.getElementById("weather-analytics-insights");
    }

    // Injects dedicated, styled icon buttons for Dark Mode and Key Guide
    injectFeatureControls() {
        const header = document.querySelector("header") || document.body;
        
        let controlContainer = document.getElementById("feature-controls");
        if (!controlContainer) {
            controlContainer = document.createElement("div");
            controlContainer.id = "feature-controls";
            controlContainer.className = "feature-controls-container";
            header.appendChild(controlContainer);
        }

        controlContainer.innerHTML = `
            <button id="theme-toggle-btn" class="feature-btn" title="Toggle Dark/Light Mode (D)" aria-label="Toggle Dark Mode">
                <span class="material-symbols-outlined theme-icon-el">dark_mode</span>
            </button>
            <button id="help-modal-btn" class="feature-btn" title="Keyboard Shortcuts Guide (?)" aria-label="Shortcut Key Guide">
                <span class="material-symbols-outlined">keyboard</span>
            </button>
        `;

        this.dom.themeToggleBtn = document.getElementById("theme-toggle-btn");
        this.dom.helpModalBtn = document.getElementById("help-modal-btn");
    }

    injectHelpModal() {
        if (document.getElementById("keyboard-help-modal")) return;

        const modal = document.createElement("div");
        modal.id = "keyboard-help-modal";
        modal.className = "help-modal-overlay";
        modal.innerHTML = `
            <div class="help-modal-content">
                <div class="help-modal-header">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined" style="color: #3b82f6;">keyboard</span>
                        <h3 style="margin: 0; font-size: 18px; font-weight: 700;">Shortcut Key Guide</h3>
                    </div>
                    <button id="close-help-modal" class="close-modal-btn">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="help-modal-body">
                    <p class="help-desc">Control your weather dashboard experience instantly with these fast desktop key commands:</p>
                    <table class="shortcuts-table">
                        <thead>
                            <tr>
                                <th>Shortcut Key</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><kbd>S</kbd> or <kbd>/</kbd></td>
                                <td>Focus City Search Bar</td>
                            </tr>
                            <tr>
                                <td><kbd>D</kbd></td>
                                <td>Toggle Dark / Light Mode Theme</td>
                            </tr>
                            <tr>
                                <td><kbd>U</kbd></td>
                                <td>Toggle Scale Units (°C / °F)</td>
                            </tr>
                            <tr>
                                <td><kbd>F</kbd></td>
                                <td>Pin Active Location to Dashboard Favorites</td>
                            </tr>
                            <tr>
                                <td><kbd>?</kbd></td>
                                <td>Toggle this Shortcut Key Guide</td>
                            </tr>
                            <tr>
                                <td><kbd>Esc</kbd></td>
                                <td>Close Open Guide or Dropdown lists</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        this.dom.helpModal = modal;
        this.dom.closeHelpBtn = document.getElementById("close-help-modal");
    }

    bindEvents() {
        if (this.dom.searchForm && this.dom.cityInput) {
            this.dom.searchForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const query = this.dom.cityInput.value.trim();
                if (query) {
                    this.closeDropdown();
                    this.applyLoadingShimmer();
                    this.fetchLocationCoordinatesByQuery(query);
                }
            });
        }

        this.bindAutocomplete();

        if (this.dom.unitToggle) {
            this.dom.unitToggle.addEventListener("click", () => this.toggleUnits());
        }

        if (this.dom.addDashboardBtn) {
            this.dom.addDashboardBtn.addEventListener("click", () => this.saveCurrentCityToFavorites());
        }

        if (this.dom.themeToggleBtn) {
            this.dom.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
        }

        if (this.dom.helpModalBtn) {
            this.dom.helpModalBtn.addEventListener("click", () => this.toggleHelpModal());
        }

        if (this.dom.closeHelpBtn) {
            this.dom.closeHelpBtn.addEventListener("click", () => this.toggleHelpModal(false));
        }

        if (this.dom.helpModal) {
            this.dom.helpModal.addEventListener("click", (e) => {
                if (e.target === this.dom.helpModal) this.toggleHelpModal(false);
            });
        }
    }

    bindKeyboardShortcuts() {
        document.addEventListener("keydown", (e) => {
            const activeTag = document.activeElement.tagName.toLowerCase();
            if (activeTag === 'input' || activeTag === 'textarea') {
                if (e.key === "Escape") {
                    this.closeDropdown();
                    this.dom.cityInput.blur();
                }
                return;
            }

            switch (e.key.toLowerCase()) {
                case "s":
                case "/":
                    e.preventDefault();
                    if (this.dom.cityInput) {
                        this.dom.cityInput.focus();
                        this.dom.cityInput.select();
                    }
                    break;
                case "d":
                    e.preventDefault();
                    this.toggleTheme();
                    break;
                case "u":
                    e.preventDefault();
                    this.toggleUnits();
                    break;
                case "f":
                    e.preventDefault();
                    this.saveCurrentCityToFavorites();
                    break;
                case "?":
                    e.preventDefault();
                    this.toggleHelpModal();
                    break;
                case "escape":
                    e.preventDefault();
                    this.toggleHelpModal(false);
                    this.closeDropdown();
                    break;
            }
        });
    }

    applyTheme() {
        const root = document.documentElement;
        const icon = this.dom.themeToggleBtn ? this.dom.themeToggleBtn.querySelector(".theme-icon-el") : null;
        
        if (this.state.theme === "dark") {
            root.classList.add("dark-theme");
            root.classList.remove("light-theme");
            if (icon) icon.textContent = "light_mode";
        } else {
            root.classList.add("light-theme");
            root.classList.remove("dark-theme");
            if (icon) icon.textContent = "dark_mode";
        }
        
        localStorage.setItem("weatherDashboardTheme", this.state.theme);
        this.renderDynamicAnalytics();
    }

    toggleTheme() {
        this.state.theme = this.state.theme === "dark" ? "light" : "dark";
        this.applyTheme();
        this.setStatus(`Theme adjusted to ${this.state.theme} mode.`);
    }

    toggleHelpModal(forceState = null) {
        if (!this.dom.helpModal) return;
        const shouldShow = forceState !== null ? forceState : !this.dom.helpModal.classList.contains("open");
        
        if (shouldShow) {
            this.dom.helpModal.classList.add("open");
        } else {
            this.dom.helpModal.classList.remove("open");
        }
    }

    toggleUnits() {
        this.state.unit = this.state.unit === 'C' ? 'F' : 'C';
        
        const spans = this.dom.unitToggle ? this.dom.unitToggle.querySelectorAll("span") : [];
        if (spans.length >= 2) {
            spans[0].classList.toggle("active", this.state.unit === 'C');
            spans[1].classList.toggle("active", this.state.unit === 'F');
        }
        
        this.updateUI();
    }

    bindAutocomplete() {
        const input = this.dom.cityInput;
        const list  = this.dom.suggestionsEl;
        if (!input || !list) return;

        this._acDebounce  = null;
        this._acResults   = [];  
        this._acHighlight = -1;  

        input.addEventListener("input", () => {
            clearTimeout(this._acDebounce);
            const q = input.value.trim();
            if (q.length < 2) { this.closeDropdown(); return; }
            this._acDebounce = setTimeout(() => this.fetchAutocompleteSuggestions(q), 300);
        });

        input.addEventListener("keydown", (e) => {
            if (!list.classList.contains("open")) return;
            const items = list.querySelectorAll(".suggestion-item");
            if (!items.length) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                this._acHighlight = Math.min(this._acHighlight + 1, items.length - 1);
                this.updateHighlight(items);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                this._acHighlight = Math.max(this._acHighlight - 1, 0);
                this.updateHighlight(items);
            } else if (e.key === "Enter") {
                if (this._acHighlight >= 0 && this._acResults[this._acHighlight]) {
                    e.preventDefault();
                    this.selectSuggestion(this._acResults[this._acHighlight]);
                }
            } else if (e.key === "Escape") {
                this.closeDropdown();
            }
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest(".search-wrapper")) this.closeDropdown();
        });
    }

    async fetchAutocompleteSuggestions(query) {
        const list = this.dom.suggestionsEl;
        if (!list) return;

        list.innerHTML = `<li class="suggestion-loading"><div class="suggestion-spinner"></div>Searching…</li>`;
        list.classList.add("open");

        try {
            const res = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
            );
            if (!res.ok) throw new Error("Geocoding API error.");
            const data = await res.json();

            this._acResults   = data.results || [];
            this._acHighlight = -1;
            this.renderSuggestions(this._acResults);
        } catch {
            list.innerHTML = `<li class="suggestion-empty">Could not fetch suggestions.</li>`;
        }
    }

    renderSuggestions(results) {
        const list = this.dom.suggestionsEl;
        if (!list) return;

        if (!results.length) {
            list.innerHTML = `<li class="suggestion-empty">No locations found.</li>`;
            list.classList.add("open");
            return;
        }

        list.innerHTML = results.map((r, i) => {
            const country  = r.country  || "";
            const region   = r.admin1   || "";
            const subLabel = [region, country].filter(Boolean).join(", ");

            return `
                <li class="suggestion-item" role="option" data-index="${i}">
                    <span class="material-symbols-outlined sug-icon">location_on</span>
                    <div class="sug-text">
                        <span class="sug-main">${r.name}</span>
                        ${subLabel ? `<span class="sug-sub">${subLabel}</span>` : ""}
                    </div>
                </li>`;
        }).join("");

        list.querySelectorAll(".suggestion-item").forEach((el) => {
            el.addEventListener("click", () => {
                const idx = parseInt(el.dataset.index, 10);
                if (!isNaN(idx) && results[idx]) this.selectSuggestion(results[idx]);
            });
        });

        list.classList.add("open");
    }

    updateHighlight(items) {
        items.forEach((el, i) => el.classList.toggle("highlighted", i === this._acHighlight));
        if (this._acHighlight >= 0) items[this._acHighlight].scrollIntoView({ block: "nearest" });
    }

    selectSuggestion(result) {
        this.dom.cityInput.value = result.name;
        this.closeDropdown();
        this.state.city = result.name;
        this.applyLoadingShimmer();
        this.fetchWeatherCoordinates(result.latitude, result.longitude);
    }

    closeDropdown() {
        if (this.dom.suggestionsEl) {
            this.dom.suggestionsEl.classList.remove("open");
            this.dom.suggestionsEl.innerHTML = "";
        }
        this._acHighlight = -1;
    }

    async fetchLocationCoordinatesByQuery(cityName, autoFavorite = false) {
        this.setStatus("Searching for city...");
        try {
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
            if (!res.ok) throw new Error("Search service unavailable.");
            
            const data = await res.json();
            if (!data.results?.length) throw new Error(`Location "${cityName}" not found.`);

            const match = data.results[0];
            this.state.city = match.name;
            
            await this.fetchWeatherCoordinates(match.latitude, match.longitude);
            if (autoFavorite) this.saveCurrentCityToFavorites();

        } catch (error) {
            this.removeLoadingShimmer();
            this.setStatus(error.message, true);
        }
    }

    async fetchWeatherCoordinates(lat, lon) {
        this.setStatus("Fetching local weather data...");
        const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,visibility&hourly=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;

        try {
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("Weather telemetry rejected.");

            this.state.payload = await res.json();
            this.state.payload.latitude = lat;
            this.state.payload.longitude = lon;
            this.state.lat = lat;
            this.state.lon = lon;

            this.removeLoadingShimmer();
            this.updateUI();
            this.renderFavoritesSidebar();
            this.setStatus(`Showing weather for ${this.state.city}.`);
        } catch (error) {
            this.removeLoadingShimmer();
            this.setStatus(`API Error: ${error.message}`, true);
        }
    }

    tryAutomaticGPSLookup() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                this.state.city = "Current Location";
                this.applyLoadingShimmer();
                this.fetchWeatherCoordinates(pos.coords.latitude, pos.coords.longitude);
            },
            () => console.warn("GPS access denied or unavailable.")
        );
    }

    updateUI() {
        if (!this.state.payload) return;
        this.renderHeroSection();
        this.renderMetrics();
        this.renderForecasts();
        this.renderDynamicAnalytics();
    }

    renderHeroSection() {
        const { current, daily } = this.state.payload;
        const meta = this.metadata[current.weather_code] || { text: "Variable", icon: "cloud", theme: "linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)" };

        if (this.dom.heroCard) {
            this.dom.heroCard.style.background = meta.theme;
            this.dom.heroCard.style.color = "#ffffff";
        }

        if (this.dom.dateEl) this.dom.dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' });
        if (this.dom.cityNameEl) this.dom.cityNameEl.textContent = this.state.city;
        if (this.dom.conditionTextEl) this.dom.conditionTextEl.textContent = meta.text;
        
        if (this.dom.largeIconEl) {
            this.dom.largeIconEl.textContent = meta.icon;
            this.dom.largeIconEl.style.transform = 'none';
            this.dom.largeIconEl.offsetHeight; 
            this.dom.largeIconEl.style.transform = "rotate(360deg) scale(1.1)";
            setTimeout(() => this.dom.largeIconEl.style.transform = "rotate(0deg) scale(1)", 600);
        }

        if (this.dom.mainDegreesEl) this.dom.mainDegreesEl.textContent = this.formatTemp(current.temperature_2m);
        if (this.dom.highLowEl) {
            this.dom.highLowEl.innerHTML = `H ${this.formatTemp(daily.temperature_2m_max[0])} &nbsp;L ${this.formatTemp(daily.temperature_2m_min[0])}`;
        }

        this.updateLifestyleAdvice(current.temperature_2m, meta.text);
    }

    renderMetrics() {
        const { current } = this.state.payload;
        this.updateSubmetricValue("Feels Like", this.formatTemp(current.apparent_temperature));
        this.updateSubmetricValue("Wind", `${Math.round(current.wind_speed_10m)} MPH`);
        this.updateSubmetricValue("Visibility", `${(current.visibility / 1609.34).toFixed(0)} ML`);
        this.updateSubmetricValue("Humidity", `${current.relative_humidity_2m}%`);
        this.updateSubmetricValue("Pressure", `${(current.surface_pressure * 0.02953).toFixed(1)} IN`);
    }

    renderForecasts() {
        const { hourly, daily } = this.state.payload;

        if (this.dom.hourlyContainer) {
            const hourlyHtml = Array.from({ length: 10 }).map((_, i) => {
                const timeObj = new Date(hourly.time[i]);
                const label = i === 0 ? "Now" : timeObj.toLocaleTimeString('en-US', { hour: 'numeric' });
                const meta = this.metadata[hourly.weather_code[i]] || { icon: "cloud" };
                return `
                    <div class="hourly-item">
                        <span class="time">${label}</span>
                        <span class="material-symbols-outlined icon">${meta.icon}</span>
                        <span class="temp">${this.formatTemp(hourly.temperature_2m[i])}</span>
                    </div>`;
            }).join('');
            this.dom.hourlyContainer.innerHTML = hourlyHtml;
        }

        if (this.dom.daysContainer) {
            const dailyHtml = daily.time.map((timeStr, d) => {
                const dateObj = new Date(timeStr);
                const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
                const meta = this.metadata[daily.weather_code[d]] || { icon: "cloud" };
                return `
                    <div class="day-column">
                        <span class="day-name">${dayLabel}</span>
                        <span class="day-date">${dateStr}</span>
                        <span class="material-symbols-outlined icon">${meta.icon}</span>
                        <span class="range">H ${this.formatTemp(daily.temperature_2m_max[d])} L ${this.formatTemp(daily.temperature_2m_min[d])}</span>
                    </div>`;
            }).join('');
            this.dom.daysContainer.innerHTML = dailyHtml;
        }
    }

    renderDynamicAnalytics() {
        if (!this.state.payload || !this.dom.chartCanvas || !window.Chart) return;

        const { hourly } = this.state.payload;
        const datapointsCount = 12;

        const labels = hourly.time.slice(0, datapointsCount).map(timeStr => {
            return new Date(timeStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        });

        const tempDataset = hourly.temperature_2m.slice(0, datapointsCount).map(temp => {
            return this.state.unit === 'F' ? Math.round((temp * 9 / 5) + 32) : Math.round(temp);
        });

        const humidityDataset = hourly.relative_humidity_2m.slice(0, datapointsCount);

        if (this.state.chartInstance) {
            this.state.chartInstance.destroy();
        }

        const ctx = this.dom.chartCanvas.getContext("2d");
        
        const tempGradient = ctx.createLinearGradient(0, 0, 0, 200);
        tempGradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
        tempGradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

        const humGradient = ctx.createLinearGradient(0, 0, 0, 200);
        humGradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
        humGradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

        const textColor = this.state.theme === "dark" ? "#e2e8f0" : "#334155";
        const gridColor = this.state.theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

        this.state.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `Temp (°${this.state.unit})`,
                        data: tempDataset,
                        borderColor: '#f87171',
                        borderWidth: 3,
                        backgroundColor: tempGradient,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'yTemp',
                        pointBackgroundColor: '#ef4444',
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Humidity (%)',
                        data: humidityDataset,
                        borderColor: '#60a5fa',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        backgroundColor: humGradient,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'yHum',
                        pointBackgroundColor: '#3b82f6',
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,
                            font: { family: 'Inter', size: 11 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: this.state.theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: 'rgba(0,0,0,0.05)',
                        borderWidth: 1,
                        titleColor: this.state.theme === 'dark' ? '#f8fafc' : '#0f172a',
                        bodyColor: this.state.theme === 'dark' ? '#e2e8f0' : '#334155'
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
                    },
                    yTemp: {
                        type: 'linear',
                        position: 'left',
                        grid: { color: gridColor },
                        ticks: {
                            color: '#f87171',
                            font: { family: 'Inter', size: 10 },
                            callback: value => `${value}°`
                        }
                    },
                    yHum: {
                        type: 'linear',
                        position: 'right',
                        grid: { display: false },
                        min: 0,
                        max: 100,
                        ticks: {
                            color: '#60a5fa',
                            font: { family: 'Inter', size: 10 },
                            callback: value => `${value}%`
                        }
                    }
                }
            }
        });

        this.renderSmartInsights(tempDataset, humidityDataset);
    }

    renderSmartInsights(temps, humidities) {
        if (!this.dom.insightsContainer) return;
        
        const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
        const maxTemp = Math.max(...temps);
        const avgHum = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length);

        let comfortAnalysis = "Atmospheric stability predicted.";
        if (avgHum > 75) {
            comfortAnalysis = "Sticky environment expected due to elevated humidity levels.";
        } else if (avgHum < 30) {
            comfortAnalysis = "High dryness parameters detected. Stay hydrated.";
        }

        this.dom.insightsContainer.innerHTML = `
            <div class="insight-row">
                <div class="insight-pill">
                    <span class="material-symbols-outlined insight-icon">insights</span>
                    <span>Average Temp: <strong>${avgTemp}°${this.state.unit}</strong> (Peak: ${maxTemp}°)</span>
                </div>
                <div class="insight-pill">
                    <span class="material-symbols-outlined insight-icon">water_drop</span>
                    <span>Average Humidity: <strong>${avgHum}%</strong> (${comfortAnalysis})</span>
                </div>
            </div>
        `;
    }

    getPinnedFavorites() {
        return JSON.parse(localStorage.getItem("weatherDashboardPinnedFavorites")) || [];
    }

    saveCurrentCityToFavorites() {
        let list = this.getPinnedFavorites();
        const activeFav = { name: this.state.city, lat: this.state.lat, lon: this.state.lon };

        if (list.some(item => item.name.toLowerCase() === activeFav.name.toLowerCase())) {
            this.setStatus("Location is already pinned.", true);
            return;
        }

        list.push(activeFav);
        localStorage.setItem("weatherDashboardPinnedFavorites", JSON.stringify(list));
        
        if (this.dom.addDashboardBtn) {
            this.dom.addDashboardBtn.style.transform = "scale(1.1)";
            setTimeout(() => this.dom.addDashboardBtn.style.transform = "scale(1)", 180);
        }
        this.renderFavoritesSidebar();
        this.setStatus(`Pinned ${this.state.city} to favorites.`);
    }

    renderFavoritesSidebar() {
        if (!this.dom.sidebarContainer) return;
        
        let scrollWrapper = this.dom.sidebarContainer.querySelector(".sidebar-scroll-wrapper");
        if (!scrollWrapper) {
            scrollWrapper = document.createElement("div");
            scrollWrapper.className = "sidebar-scroll-wrapper";
            this.dom.sidebarContainer.insertBefore(scrollWrapper, this.dom.sidebarContainer.firstChild);
        }

        scrollWrapper.innerHTML = "";

        const favorites = this.getPinnedFavorites();
        const fragment = document.createDocumentFragment();

        favorites.forEach((city, index) => {
            const row = document.createElement("div");
            const isActive = city.name.toLowerCase() === this.state.city.toLowerCase();
            row.className = `location-item ${isActive ? 'active' : ''}`;
            
            row.innerHTML = `
                <div class="location-text-group" style="flex: 1; cursor: pointer;">
                    <span class="time" style="font-size: 11px; opacity: 0.6; font-weight: 500;">SAVED LOCATION</span>
                    <span class="city" style="font-size: 15px; font-weight: 600;">${city.name}</span>
                </div>
                <button class="btn-delete-favorite" data-index="${index}" title="Remove Location" style="background: none; border: none; color: inherit; opacity: 0.6; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; transition: opacity 0.2s;">
                    <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                </button>
            `;

            row.querySelector(".location-text-group").addEventListener("click", () => {
                this.state.city = city.name;
                this.applyLoadingShimmer();
                this.fetchWeatherCoordinates(city.lat, city.lon);
            });

            row.querySelector(".btn-delete-favorite").addEventListener("click", (e) => {
                e.stopPropagation();
                this.removeCityFromFavorites(index);
            });

            fragment.appendChild(row);
        });

        scrollWrapper.appendChild(fragment);
    }

    removeCityFromFavorites(index) {
        let list = this.getPinnedFavorites();
        list.splice(index, 1);
        localStorage.setItem("weatherDashboardPinnedFavorites", JSON.stringify(list));
        this.renderFavoritesSidebar();
        this.setStatus("Location removed from dashboard.");
    }

    populateMockFavoritesIfNeeded() {
        if (localStorage.getItem("weatherDashboardPinnedFavorites") === null) {
            const defaultMocks = [
                { name: "Irvine", lat: 33.6846, lon: -117.8265 },
                { name: "New York", lat: 40.7128, lon: -74.0060 },
                { name: "London", lat: 51.5074, lon: -0.1278 }
            ];
            localStorage.setItem("weatherDashboardPinnedFavorites", JSON.stringify(defaultMocks));
        }
    }

    applyLoadingShimmer() {
        const sections = [
            this.dom.heroCard, 
            document.querySelector(".data-metrics-card"), 
            document.getElementById("analytics-chart-section")
        ];
        sections.forEach(el => {
            if (el) el.classList.add("loading-shimmer-active");
        });
    }

    removeLoadingShimmer() {
        const sections = [
            this.dom.heroCard, 
            document.querySelector(".data-metrics-card"), 
            document.getElementById("analytics-chart-section")
        ];
        sections.forEach(el => {
            if (el) el.classList.remove("loading-shimmer-active");
        });
    }

    formatTemp(celsius) {
        if (this.state.unit === 'F') {
            return `${Math.round((celsius * 9 / 5) + 32)}°`;
        }
        return `${Math.round(celsius)}°`;
    }

    updateSubmetricValue(label, value) {
        const items = document.querySelectorAll(".metric-item");
        items.forEach(item => {
            const labelEl = item.querySelector(".label");
            if (labelEl && labelEl.textContent.trim().toLowerCase() === label.toLowerCase()) {
                const valueEl = item.querySelector(".value");
                if (valueEl) valueEl.textContent = value;
            }
        });
    }

    updateLifestyleAdvice(celsius, conditionText) {
        if (!this.dom.lifestyleBadge) return;

        let advice = "Comfortable temperature.";
        let icon = "check_circle";

        if (celsius < 10) {
            advice = "Freezing cold! Layers, heavy coat & scarf recommended.";
            icon = "ac_unit";
        } else if (celsius >= 10 && celsius < 18) {
            advice = "Chilly atmosphere. Perfect for a cozy sweater or light jacket.";
            icon = "dry_cleaning";
        } else if (celsius >= 18 && celsius <= 26) {
            advice = "Pleasant conditions. Wear classic t-shirt & casual attire.";
            icon = "checkroom";
        } else {
            advice = "Warm/hot weather. Breatheable fabrics & stay hydrated!";
            icon = "wb_sunny";
        }

        const lowerCondition = conditionText.toLowerCase();
        if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
            advice += " Umbrella needed!";
            icon = "umbrella";
        } else if (lowerCondition.includes("snow")) {
            advice += " Waterproof boots advised.";
            icon = "snowboarding";
        }

        this.dom.lifestyleBadge.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 16px;">${icon}</span>
            <span>${advice}</span>
        `;
    }

    setStatus(message, isError = false) {
        if (!this.dom.statusBox) return;
        this.dom.statusBox.textContent = message;
        this.dom.statusBox.className = `status-message ${isError ? 'error' : 'info'}`;
    }

    injectGlobalStyles() {
        if (document.getElementById("dashboard-dynamic-styles")) return;

        const styleSheet = document.createElement("style");
        styleSheet.id = "dashboard-dynamic-styles";
        styleSheet.textContent = `
            /* --- LIGHT THEME SYSTEM VARIABLES --- */
            :root, .light-theme {
                --bg-primary: #f1f5f9;
                --bg-card: #ffffff;
                --text-primary: #0f172a;
                --text-secondary: #475569;
                --border-color: rgba(0, 0, 0, 0.08);
                --sidebar-active-bg: rgba(59, 130, 246, 0.08);
                --shadow-depth: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            }

            /* --- DARK THEME SYSTEM VARIABLES --- */
            .dark-theme {
                --bg-primary: #0f172a;
                --bg-card: #1e293b;
                --text-primary: #f8fafc;
                --text-secondary: #94a3b8;
                --border-color: rgba(255, 255, 255, 0.08);
                --sidebar-active-bg: rgba(59, 130, 246, 0.2);
                --shadow-depth: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
            }

            /* Global overrides mapping styles to theme-dependent CSS variables */
            body {
                background-color: var(--bg-primary) !important;
                color: var(--text-primary) !important;
                transition: background-color 0.3s ease, color 0.3s ease;
            }
            .card, .location-list-card, .data-metrics-card, .extended-forecast-card, .analytics-graph-card {
                background-color: var(--bg-card) !important;
                color: var(--text-primary) !important;
                border: 1px solid var(--border-color) !important;
                box-shadow: var(--shadow-depth) !important;
                transition: background-color 0.3s ease, border-color 0.3s ease;
            }
            input#city-input {
                background-color: var(--bg-card) !important;
                color: var(--text-primary) !important;
                border: 1px solid var(--border-color) !important;
            }
            header, h1, h2, h3, span, div, p, th, td {
                color: inherit;
            }

            /* Autocomplete */
            .search-wrapper { position: relative; }
            .search-suggestions {
                position: absolute; top: calc(100% + 5px); left: 0; right: 0;
                background: var(--bg-card); border: 1px solid var(--border-color);
                border-radius: 8px; max-height: 250px; overflow-y: auto;
                z-index: 1000; display: none; padding: 0; list-style: none;
                box-shadow: var(--shadow-depth);
            }
            .search-suggestions.open { display: block; }
            .suggestion-item {
                display: flex; align-items: center; gap: 10px; padding: 10px 12px;
                color: var(--text-primary); cursor: pointer; transition: background 0.15s;
            }
            .suggestion-item:hover, .suggestion-item.highlighted { background: var(--sidebar-active-bg); }
            .sug-icon { color: var(--text-secondary); font-size: 18px; }
            .sug-text { display: flex; flex-direction: column; }
            .sug-main { font-size: 13px; font-weight: 500; }
            .sug-sub { font-size: 11px; color: var(--text-secondary); }
            .suggestion-loading, .suggestion-empty {
                padding: 12px; font-size: 13px; color: var(--text-secondary); text-align: center;
                display: flex; align-items: center; justify-content: center; gap: 8px;
            }
            .suggestion-spinner {
                width: 14px; height: 14px; border: 2px solid #3b82f6;
                border-top-color: transparent; border-radius: 50%;
                animation: sug-spin 0.6s linear infinite;
            }
            @keyframes sug-spin { to { transform: rotate(360deg); } }

            /* Saved Locations Sidebar Styling */
            .sidebar-scroll-wrapper {
                display: flex; flex-direction: column; gap: 10px;
                max-height: 200px; overflow-y: auto; padding-right: 4px;
            }
            .sidebar-scroll-wrapper::-webkit-scrollbar { width: 4px; }
            .sidebar-scroll-wrapper::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
            .location-item {
                display: flex; align-items: center; justify-content: space-between;
                padding: 12px; background: rgba(127,127,127,0.05); border-radius: 8px;
                transition: background 0.2s, transform 0.2s;
            }
            .location-item.active { background: var(--sidebar-active-bg); border-left: 3px solid #3b82f6; }
            .location-item:hover { background: rgba(127,127,127,0.1); transform: translateY(-1px); }
            .btn-delete-favorite:hover { opacity: 1 !important; color: #ef4444 !important; }

            /* Dynamic Control Group (Theme Toggle & Keyboard Shortcut Help) */
            .feature-controls-container {
                display: flex; gap: 10px; align-items: center; justify-content: flex-end; margin-left: auto;
            }
            .feature-btn {
                background: var(--bg-card); border: 1px solid var(--border-color);
                color: var(--text-primary); border-radius: 50%; width: 42px; height: 42px;
                display: flex; align-items: center; justify-content: center; cursor: pointer;
                box-shadow: var(--shadow-depth); transition: background-color 0.2s, transform 0.1s;
            }
            .feature-btn:hover { background-color: var(--sidebar-active-bg); transform: scale(1.05); }
            .feature-btn:active { transform: scale(0.95); }

            /* Help Modal Overlay Styling */
            .help-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px);
                display: flex; align-items: center; justify-content: center;
                z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
            }
            .help-modal-overlay.open { opacity: 1; pointer-events: auto; }
            .help-modal-content {
                background: var(--bg-card); border: 1px solid var(--border-color);
                width: 90%; max-width: 480px; border-radius: 12px; padding: 24px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                transform: translateY(20px); transition: transform 0.25s ease;
            }
            .help-modal-overlay.open .help-modal-content { transform: translateY(0); }
            .help-modal-header {
                display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;
            }
            .close-modal-btn {
                background: none; border: none; color: var(--text-secondary); cursor: pointer;
                display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 50%;
            }
            .close-modal-btn:hover { background: var(--sidebar-active-bg); color: var(--text-primary); }
            .help-desc { font-size: 13px; color: var(--text-secondary); margin: 0 0 16px 0; line-height: 1.5; }
            
            .shortcuts-table { width: 100%; border-collapse: collapse; }
            .shortcuts-table th {
                text-align: left; padding: 8px 12px; font-size: 11px;
                text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary);
                border-bottom: 1px solid var(--border-color);
            }
            .shortcuts-table td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid var(--border-color); }
            .shortcuts-table tr:last-child td { border-bottom: none; }
            kbd {
                background: var(--bg-primary); border: 1px solid var(--border-color);
                box-shadow: 0 2px 0 var(--border-color); border-radius: 4px;
                padding: 3px 6px; font-family: monospace; font-size: 12px;
                font-weight: 600; color: var(--text-primary);
            }

            /* Insights */
            #weather-analytics-insights { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; }
            .insight-row { display: flex; gap: 8px; flex-wrap: wrap; }
            .insight-pill {
                display: flex; align-items: center; gap: 6px; background: rgba(127, 127, 127, 0.05);
                border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 50px;
                font-size: 11px; color: var(--text-secondary);
            }
            .insight-icon { font-size: 14px; color: #3b82f6; }

            /* Shimmer */
            .loading-shimmer-active {
                position: relative; overflow: hidden; pointer-events: none; opacity: 0.75;
            }
            .loading-shimmer-active::after {
                content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
                animation: shimmerAnim 1.4s infinite;
            }
            @keyframes shimmerAnim {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new WeatherDashboard();
    engine.init();
});