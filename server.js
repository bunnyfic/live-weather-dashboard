require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  console.error('Missing OPENWEATHER_API_KEY in .env — the app will not be able to fetch weather data.');
}

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// Helper to forward a request to OpenWeatherMap and relay the JSON response
async function proxy(url, res) {
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Current weather by city name
app.get('/api/weather', (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'city query param is required' });
  proxy(`${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`, res);
});

// 5-day / 3-hour forecast by city name
app.get('/api/forecast', (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'city query param is required' });
  proxy(`${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`, res);
});

// Air pollution by coordinates
app.get('/api/air-pollution', (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon query params are required' });
  proxy(`${BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`, res);
});

app.listen(PORT, () => {
  console.log(`Weather dashboard running at http://localhost:${PORT}`);
});
