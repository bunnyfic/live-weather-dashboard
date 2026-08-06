# Weather Dashboard
live demo : https://live-weather-dashboard-1-b8n5.onrender.com/


A cute, live weather dashboard with a baby pink theme, built with plain HTML/CSS/JS and powered by the OpenWeatherMap API. No build step, no dependencies — open the file and it just works.

![theme](https://img.shields.io/badge/theme-baby%20pink%20%26%20dark%20pink-FF1493?style=flat-square&labelColor=FFC1E3&color=FF1493)

![live data](https://img.shields.io/badge/data-live-FF1493?style=flat-square&labelColor=FFC1E3)

![no build](https://img.shields.io/badge/build-none%20needed-FF1493?style=flat-square&labelColor=FFC1E3)
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
- Flat, solid mint-green & light-pink and dark themed with a mascot in the header

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
SCREENSHOTS
<img width="1340" height="585" alt="image" src="https://github.com/user-attachments/assets/51aa7816-9b0f-48a2-b6e7-a6a3bc694198" />
<img width="1366" height="721" alt="image" src="https://github.com/user-attachments/assets/16aa0f54-8aa1-4bec-b012-b8596e7eb501" />

added Update :
an cute weather ai assistant to summarize the weather for the user incase the user is lost and cannot make stuff out of the dashboard. :3



## 📄 License

MIT — do whatever you'd like with it.
