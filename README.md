# 🐻 Weather Dashboard
live demo 

A cute, live weather dashboard with a mint-green & light-brown theme, built with plain HTML/CSS/JS and powered by the OpenWeatherMap API. No build step, no dependencies — open the file and it just works.

![theme](https://img.shields.io/badge/theme-mint%20%26%20brown-4F9E80?style=flat-square)
![live data](https://img.shields.io/badge/data-live-C79F72?style=flat-square)
![no build](https://img.shields.io/badge/build-none%20needed-3F3226?style=flat-square)

## ✨ Features

- **Live current conditions** — temperature, feels-like, min/max, cloud cover, description
- **3-day forecast strip** with weather icons
- **24-hour temperature trend** chart
- **Sunrise & sunset** times
- **Air Quality** ring gauge (CO, SO₂, NO₂, O₃, PM10, PM2.5)
- **UV Index** KPI
- **4-day Chance of Rain** bar chart
- **Location switcher** — quick-select buttons for popular cities, plus a search box with live wildcard/substring autocomplete
- **Auto-refreshes** every 10 minutes
- Flat, solid mint-green & light-brown theme with a bear mascot in the header

## 📦 What's in this repo

| File | Description |
|---|---|
| `weather_dashboard.html` | The dashboard itself — a single self-contained HTML file |
| `bear_transparent.png` | Transparent mascot image used in the header |
| `MintBear_Theme.json` | Matching Power BI theme (optional companion) |
| `PowerBI_Setup_Guide.md` | Steps + Power Query M code to rebuild this as a `.pbix` (optional companion) |

## 🚀 Getting started

1. Clone or download this repo.
2. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api).
3. Open `weather_dashboard.html` in a text editor and replace the API key:
   ```js
   const API_KEY = "YOUR_API_KEY_HERE";
   ```
4. Open `weather_dashboard.html` in any browser. That's it — no server, no build tools, no npm install.

### Optional: serve it locally
Some browsers restrict `fetch()` on `file://` pages. If data doesn't load, serve it locally instead:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000/weather_dashboard.html
```

## 🔑 API key & security

This project calls the OpenWeatherMap API directly from the browser, which means **the key is visible in the page source** to anyone who opens it. That's fine for personal/local use, but:
- Don't commit a real key to a public repo — use a placeholder and instructions like above, or load it from an untracked config file / environment injected at build time.
- If a key is ever exposed publicly, regenerate it from your OpenWeatherMap dashboard.

## 🌐 Data sources

| Data | Endpoint |
|---|---|
| Current weather, 3-day/hourly forecast | OpenWeatherMap `/data/2.5/weather` and `/data/2.5/forecast` (free tier) |
| Air quality | OpenWeatherMap `/data/2.5/air_pollution` (free tier) |
| UV Index | [currentuvindex.com](https://currentuvindex.com) — free, keyless (OpenWeatherMap's UV data now requires a paid One Call 3.0 subscription) |

## 🎨 Customizing the theme

Colors live as CSS variables at the top of the `<style>` block:
```css
:root{
  --mint:#4F9E80;
  --mint-light:#DCEFE5;
  --tan:#C79F72;
  --tan-light:#F0E2CC;
  --cream:#FAF7F1;
  --ink:#3F3226;
  --ink-soft:#8A7A66;
}
```


## 📄 License

MIT — do whatever you'd like with it.
