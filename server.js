/**
 * Weather Dashboard — REST API Server
 * Provides persistent favorites and weather snapshot storage.
 *
 * Endpoints:
 *   GET    /api/health
 *   GET    /api/favorites
 *   POST   /api/favorites
 *   DELETE /api/favorites/:id
 *   GET    /api/weather-report
 *   POST   /api/weather-report
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = 3001;

// ─────────────────────────────────────────
//  Middleware
// ─────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));   // serves index.html & assets

// ─────────────────────────────────────────
//  In-Memory Data Store
// ─────────────────────────────────────────
let favorites = [
    { id: 1, name: 'Manila', lat: 14.5995, lon: 120.9842, addedAt: new Date().toISOString() },
    { id: 2, name: 'Cebu',   lat: 10.3157, lon: 123.8854, addedAt: new Date().toISOString() },
    { id: 3, name: 'Davao',  lat: 7.1907,  lon: 125.4553, addedAt: new Date().toISOString() },
];
let weatherReports = [];
let nextFavId = 4;

// ─────────────────────────────────────────
//  Helper — standard API envelope
// ─────────────────────────────────────────
const ok   = (res, data, status = 200) => res.status(status).json({ success: true,  ...data });
const fail = (res, error, status = 400) => res.status(status).json({ success: false, error });

// ─────────────────────────────────────────
//  GET /api/health
// ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
    ok(res, {
        status:    'OK',
        uptime:    `${Math.floor(process.uptime())}s`,
        favorites: favorites.length,
        reports:   weatherReports.length,
        timestamp: new Date().toISOString(),
    });
});

// ─────────────────────────────────────────
//  GET /api/favorites
// ─────────────────────────────────────────
app.get('/api/favorites', (req, res) => {
    ok(res, { count: favorites.length, data: favorites });
});

// ─────────────────────────────────────────
//  POST /api/favorites
//  Body: { name, lat, lon }
// ─────────────────────────────────────────
app.post('/api/favorites', (req, res) => {
    const { name, lat, lon } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return fail(res, 'Field "name" is required and must be a non-empty string.');
    }
    if (lat === undefined || lon === undefined || isNaN(Number(lat)) || isNaN(Number(lon))) {
        return fail(res, 'Fields "lat" and "lon" are required and must be numeric.');
    }
    if (Number(lat) < -90 || Number(lat) > 90)   return fail(res, '"lat" must be between -90 and 90.');
    if (Number(lon) < -180 || Number(lon) > 180) return fail(res, '"lon" must be between -180 and 180.');

    if (favorites.some(f => f.name.toLowerCase() === name.trim().toLowerCase())) {
        return fail(res, `"${name}" is already in your favorites.`, 409);
    }

    const entry = {
        id:      nextFavId++,
        name:    name.trim(),
        lat:     Number(lat),
        lon:     Number(lon),
        addedAt: new Date().toISOString(),
    };
    favorites.push(entry);

    ok(res, { message: `"${entry.name}" added to favorites.`, data: entry }, 201);
});

// ─────────────────────────────────────────
//  DELETE /api/favorites/:id
// ─────────────────────────────────────────
app.delete('/api/favorites/:id', (req, res) => {
    const id  = parseInt(req.params.id, 10);
    const idx = favorites.findIndex(f => f.id === id);

    if (idx === -1) return fail(res, `No favorite found with id ${id}.`, 404);

    const [removed] = favorites.splice(idx, 1);
    ok(res, { message: `"${removed.name}" removed from favorites.`, data: removed });
});

// ─────────────────────────────────────────
//  POST /api/weather-report
//  Body: { city, lat, lon, temperature, condition,
//          humidity, wind, feelsLike, pressure, unit }
// ─────────────────────────────────────────
app.post('/api/weather-report', (req, res) => {
    const { city, lat, lon, temperature, condition, humidity, wind, feelsLike, pressure, unit } = req.body;

    if (!city || typeof city !== 'string' || city.trim() === '') {
        return fail(res, 'Field "city" is required.');
    }
    if (temperature === undefined || isNaN(Number(temperature))) {
        return fail(res, 'Field "temperature" is required and must be numeric.');
    }
    if (!condition || typeof condition !== 'string') {
        return fail(res, 'Field "condition" is required.');
    }

    const report = {
        id:          Date.now(),
        city:        city.trim(),
        lat:         lat         !== undefined ? Number(lat)         : null,
        lon:         lon         !== undefined ? Number(lon)         : null,
        temperature: Number(temperature),
        condition:   condition.trim(),
        humidity:    humidity    !== undefined ? Number(humidity)    : null,
        wind:        wind        !== undefined ? Number(wind)        : null,
        feelsLike:   feelsLike   !== undefined ? Number(feelsLike)   : null,
        pressure:    pressure    !== undefined ? Number(pressure)    : null,
        unit:        unit || 'C',
        savedAt:     new Date().toISOString(),
    };

    weatherReports.unshift(report);
    if (weatherReports.length > 100) weatherReports.pop();

    ok(res, { message: `Weather snapshot for "${report.city}" saved.`, data: report }, 201);
});

// ─────────────────────────────────────────
//  GET /api/weather-report
//  Query: ?limit=10&city=Manila
// ─────────────────────────────────────────
app.get('/api/weather-report', (req, res) => {
    const limit  = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const filter = req.query.city ? req.query.city.toLowerCase() : null;

    let results = weatherReports;
    if (filter) results = results.filter(r => r.city.toLowerCase().includes(filter));

    ok(res, { count: results.length, data: results.slice(0, limit) });
});

// ─────────────────────────────────────────
//  404 fallback for unknown API routes
// ─────────────────────────────────────────
app.use('/api/*', (req, res) => {
    fail(res, `Route ${req.method} ${req.originalUrl} not found.`, 404);
});

// ─────────────────────────────────────────
//  Start Server
// ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║   Weather Dashboard API Server            ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║   http://localhost:${PORT}                   ║`);
    console.log('╠══════════════════════════════════════════╣');
    console.log('║  GET    /api/health                       ║');
    console.log('║  GET    /api/favorites                    ║');
    console.log('║  POST   /api/favorites                    ║');
    console.log('║  DELETE /api/favorites/:id                ║');
    console.log('║  POST   /api/weather-report               ║');
    console.log('║  GET    /api/weather-report               ║');
    console.log('╚══════════════════════════════════════════╝\n');
});
