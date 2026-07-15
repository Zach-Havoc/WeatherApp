/**
 * Weather Dashboard Core Integration Engine (Refactored & Enhanced)
 * Optimized for performance, scrollable sidebars, and custom climate analytics.
 */

class WeatherDashboard {
    constructor() {
        // --- Application State ---
        this.state = {
            unit: 'C',
            payload: null,
            city: "Calaca",
            // Calaca coordinates as default
            lat: 13.9317,
            lon: 120.8122,
            chartInstance: null
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
        this.injectAnalyticsCard(); // Programmatically place the chart container into the HTML
        this.bindEvents();
        this.populateMockFavoritesIfNeeded();
        this.renderFavoritesSidebar();

        this.applyLoadingShimmer();
        this.fetchWeatherCoordinates(this.state.lat, this.state.lon);
        this.tryAutomaticGPSLookup();
    }

    // Programmatically imports Chart.js without altering index.html
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
            unitToggle: document.querySelector(".unit-toggle"),
            addDashboardBtn: document.querySelector(".btn-add-dashboard"),
            addLocationSidebarBtn: document.querySelector(".add-location-btn"),
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
            statusBox: document.getElementById("status-message")
        };
    }

    // Injects the card markup nicely right into the layout structure
    injectAnalyticsCard() {
        const rightCol = document.querySelector(".right-column");
        if (!rightCol) return;

        // Prevent duplicate injection
        if (document.getElementById("analytics-chart-section")) return;

        const chartSection = document.createElement("section");
        chartSection.id = "analytics-chart-section";
        chartSection.className = "card analytics-graph-card";
        chartSection.innerHTML = `
            <div class="analytics-header">
                <h3>Climate Outlook &amp; Trends</h3>
                <span class="analytics-subtitle">24-Hour Temperature vs Humidity Analytics</span>
            </div>
            <div class="chart-wrapper">
                <canvas id="weatherAnalyticsChart"></canvas>
            </div>
            <div id="weather-analytics-insights"></div>
        `;
        
        // Appends beautifully right under the metrics and before the extended forecast card
        const extendedForecast = document.querySelector(".extended-forecast-card");
        if (extendedForecast) {
            rightCol.insertBefore(chartSection, extendedForecast);
        } else {
            rightCol.appendChild(chartSection);
        }
        
        this.dom.chartCanvas = document.getElementById("weatherAnalyticsChart");
        this.dom.insightsContainer = document.getElementById("weather-analytics-insights");
    }

    bindEvents() {
        if (this.dom.searchForm && this.dom.cityInput) {
            this.dom.searchForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const query = this.dom.cityInput.value.trim();
                if (query) {
                    this.applyLoadingShimmer();
                    this.fetchLocationCoordinatesByQuery(query);
                }
            });
        }

        if (this.dom.unitToggle) {
            this.dom.unitToggle.addEventListener("click", () => {
                this.state.unit = this.state.unit === 'C' ? 'F' : 'C';
                
                const spans = this.dom.unitToggle.querySelectorAll("span");
                if (spans.length >= 2) {
                    spans[0].classList.toggle("active", this.state.unit === 'C');
                    spans[1].classList.toggle("active", this.state.unit === 'F');
                }
                
                this.updateUI();
            });
        }

        if (this.dom.addDashboardBtn) {
            this.dom.addDashboardBtn.addEventListener("click", () => this.saveCurrentCityToFavorites());
        }

        if (this.dom.addLocationSidebarBtn) {
            this.dom.addLocationSidebarBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                const newCity = prompt("Enter the name of the city you want to add:");
                if (newCity && newCity.trim()) {
                    this.applyLoadingShimmer();
                    await this.fetchLocationCoordinatesByQuery(newCity.trim(), true);
                }
            });
        }
    }

    // --- API & Data Fetching ---
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
        // Expanded variables to include relative_humidity_2m in hourly telemetry for the analytics chart
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

    // --- Core UI Updates ---
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

    // --- Dynamic Analytics Chart Render (Integrated Dual-Axes) ---
    renderDynamicAnalytics() {
        if (!this.state.payload || !this.dom.chartCanvas || !window.Chart) return;

        const { hourly } = this.state.payload;
        const datapointsCount = 12; // Track trends over the next 12 hours

        // Format times (X-Axis labels)
        const labels = hourly.time.slice(0, datapointsCount).map(timeStr => {
            return new Date(timeStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        });

        // Convert temperatures for y-axis depending on unit state
        const tempDataset = hourly.temperature_2m.slice(0, datapointsCount).map(temp => {
            return this.state.unit === 'F' ? Math.round((temp * 9 / 5) + 32) : Math.round(temp);
        });

        const humidityDataset = hourly.relative_humidity_2m.slice(0, datapointsCount);

        // Destroy old instance to avoid hover flicker & leak issues
        if (this.state.chartInstance) {
            this.state.chartInstance.destroy();
        }

        const ctx = this.dom.chartCanvas.getContext("2d");
        
        // Custom Gradients
        const tempGradient = ctx.createLinearGradient(0, 0, 0, 250);
        tempGradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
        tempGradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

        const humGradient = ctx.createLinearGradient(0, 0, 0, 250);
        humGradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
        humGradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

        // Instantiate Chart
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
                            color: '#e2e8f0',
                            font: { family: 'Inter', size: 11 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        titleColor: '#f8fafc',
                        bodyColor: '#e2e8f0'
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
                    },
                    yTemp: {
                        type: 'linear',
                        position: 'left',
                        grid: { color: 'rgba(255,255,255,0.05)' },
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

        // Add dynamically calculated micro-insight analysis metrics text below the graph
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

    // --- Favorites Management ---
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
    }

    renderFavoritesSidebar() {
        if (!this.dom.sidebarContainer) return;
        
        // Find or create scroll wrapper inside the container
        let scrollWrapper = this.dom.sidebarContainer.querySelector(".sidebar-scroll-wrapper");
        if (!scrollWrapper) {
            scrollWrapper = document.createElement("div");
            scrollWrapper.className = "sidebar-scroll-wrapper";
            this.dom.sidebarContainer.insertBefore(scrollWrapper, this.dom.sidebarContainer.firstChild);
        }

        // Keep the DOM list clean
        scrollWrapper.innerHTML = "";

        const favorites = this.getPinnedFavorites();
        const fragment = document.createDocumentFragment();

        favorites.forEach(city => {
            const row = document.createElement("div");
            const isActive = city.name.toLowerCase() === this.state.city.toLowerCase();
            row.className = `location-item ${isActive ? 'active' : ''}`;
            
            row.innerHTML = `
                <div class="location-text-group">
                    <span class="time" style="font-size: 11px; opacity: 0.6; font-weight: 500;">SAVED LOCATION</span>
                    <span class="city" style="font-size: 15px; font-weight: 600;">${city.name}</span>
                </div>
                <div class="location-meta-group">
                    <span class="material-symbols-outlined delete-btn" style="color: rgba(255,100,100,0.8); font-size: 20px; transition: color 0.2s;" title="Remove">delete</span>
                </div>`;

            row.addEventListener("click", () => {
                this.state.city = city.name;
                this.applyLoadingShimmer();
                this.fetchWeatherCoordinates(city.lat, city.lon);
            });

            row.querySelector(".delete-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                row.style.opacity = "0";
                row.style.transform = "translateX(20px)";
                setTimeout(() => {
                    const updated = this.getPinnedFavorites().filter(f => f.name !== city.name);
                    localStorage.setItem("weatherDashboardPinnedFavorites", JSON.stringify(updated));
                    this.renderFavoritesSidebar();
                }, 200);
            });

            fragment.appendChild(row);
        });

        scrollWrapper.appendChild(fragment);
    }

    populateMockFavoritesIfNeeded() {
        // Populates with Calaca and Balayan defaults
        if (!localStorage.getItem("weatherDashboardPinnedFavorites")) {
            const mock = [
                { name: "Calaca", lat: 13.9317, lon: 120.8122 },
                { name: "Balayan", lat: 13.9355, lon: 120.7208 },
                { name: "New York", lat: 40.7128, lon: -74.0060 }
            ];
            localStorage.setItem("weatherDashboardPinnedFavorites", JSON.stringify(mock));
        }
    }

    // --- Helper & Utility Methods ---
    formatTemp(celsius) {
        return this.state.unit === 'F' ? `${Math.round((celsius * 9 / 5) + 32)}°` : `${Math.round(celsius)}°`;
    }

    setStatus(message, isError = false) {
        if (!this.dom.statusBox) return;
        this.dom.statusBox.textContent = message;
        this.dom.statusBox.className = `status-message ${isError ? 'error' : 'info'}`;
    }

    updateSubmetricValue(labelStr, value) {
        const container = document.querySelector(".metrics-strip") || document.body;
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeValue.trim() === labelStr) {
                const parent = node.parentElement;
                const valNode = parent.querySelector(".value") || parent.nextElementSibling;
                if (valNode) valNode.textContent = value;
                return;
            }
        }
    }

    applyLoadingShimmer() {
        const targets = [".main-degrees", ".condition-text", ".high-low", ".metrics-strip", ".hourly-scroll", ".days-row"];
        targets.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.classList.add("shimmer-active");
        });
    }

    removeLoadingShimmer() {
        document.querySelectorAll(".shimmer-active").forEach(el => el.classList.remove("shimmer-active"));
    }

    injectGlobalStyles() {
        if (document.getElementById("dashboard-animations")) return;
        const style = document.createElement("style");
        style.id = "dashboard-animations";
        style.innerText = `
            @keyframes shimmerGlow {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            .shimmer-active {
                background: linear-gradient(90deg, rgba(238,238,238,0.1) 25%, rgba(221,221,221,0.2) 50%, rgba(238,238,238,0.1) 75%) !important;
                background-size: 200% 100% !important;
                animation: shimmerGlow 1.5s infinite linear !important;
                color: transparent !important; border-color: transparent !important;
            }

            /* --- Scrollable Sidebar Configurations --- */
            .location-list-card {
                display: flex !important;
                flex-direction: column !important;
                max-height: 480px !important;
                overflow: hidden !important;
            }
            .sidebar-scroll-wrapper {
                flex-grow: 1 !important;
                overflow-y: auto !important;
                padding-right: 4px !important;
                max-height: 380px !important;
            }
            /* Custom Scrollbar */
            .sidebar-scroll-wrapper::-webkit-scrollbar {
                width: 5px;
            }
            .sidebar-scroll-wrapper::-webkit-scrollbar-track {
                background: rgba(255,255,255,0.02);
                border-radius: 10px;
            }
            .sidebar-scroll-wrapper::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.15);
                border-radius: 10px;
            }
            .sidebar-scroll-wrapper::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.3);
            }

            .location-item {
                display: flex !important; justify-content: space-between !important;
                align-items: center !important; padding: 12px 16px !important;
                margin-bottom: 8px !important; border-radius: 12px !important;
                background: rgba(255, 255, 255, 0.08) !important;
                border: 1px solid rgba(255, 255, 255, 0.12) !important;
                cursor: pointer; transition: all 0.2s ease;
            }
            .location-item:hover { background: rgba(255, 255, 255, 0.15) !important; transform: translateX(4px); }
            .location-item.active { background: rgba(255, 255, 255, 0.25) !important; border-color: rgba(255, 255, 255, 0.4) !important; }
            .location-text-group { display: flex; flex-direction: column; gap: 2px; }
            .location-meta-group { display: flex; align-items: center; gap: 12px; }
            
            .unit-toggle, .btn-add-dashboard, .add-location-btn, #search-form button {
                transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) !important; cursor: pointer !important;
            }
            .unit-toggle:hover, .btn-add-dashboard:hover, #search-form button:hover { transform: scale(1.03); filter: brightness(1.1); }

            /* --- Modern Analytics Graph Card CSS --- */
            .analytics-graph-card {
                background: rgba(30, 41, 59, 0.7) !important;
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 16px !important;
                padding: 20px !important;
                margin-bottom: 24px !important;
                color: #ffffff;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .analytics-header {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .analytics-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                letter-spacing: -0.01em;
            }
            .analytics-subtitle {
                font-size: 11px;
                opacity: 0.6;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .chart-wrapper {
                position: relative;
                height: 220px;
                width: 100%;
            }
            #weather-analytics-insights {
                display: flex;
                flex-direction: column;
                gap: 8px;
                border-top: 1px solid rgba(255, 255, 255, 0.06);
                padding-top: 12px;
            }
            .insight-row {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
            }
            .insight-pill {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(255, 255, 255, 0.04);
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .insight-icon {
                font-size: 16px;
                color: #60a5fa;
            }
        `;
        document.head.appendChild(style);
    }
}

// Boot up the application
document.addEventListener("DOMContentLoaded", () => {
    const app = new WeatherDashboard();
    app.init();
});