require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free';
const BASE = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  console.error('Missing OPENWEATHER_API_KEY in .env — the app will not be able to fetch weather data.');
}
if (!OPENROUTER_API_KEY) {
  console.error('Missing OPENROUTER_API_KEY in .env — the AI assistant will not work.');
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

async function proxy(url, res) {
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.get('/api/weather', (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'city query param is required' });
  proxy(`${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`, res);
});

app.get('/api/forecast', (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'city query param is required' });
  proxy(`${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`, res);
});

app.get('/api/air-pollution', (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon query params are required' });
  proxy(`${BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`, res);
});

// ---- AI Weather Assistant (Gemini) ----
const SYSTEM_PROMPT = `You are "Sunny", a warm, upbeat weather assistant embedded inside a cute pastel-pink weather dashboard.
Rules:
- Keep replies SHORT: 1–4 sentences, casual and friendly, occasional light emoji is fine (max one).
- You are given the user's currently viewed city and live weather data as context — use it naturally when relevant (e.g. clothing advice, umbrella advice, travel/activity suggestions, comparisons).
- If the user asks about a different city than the one in context, answer from your general knowledge but note you're most accurate about the city currently on screen.
- If asked something totally unrelated to weather, you can answer briefly, then gently steer back ("anyway, want to know anything about the weather?").
- Never fabricate precise numbers not present in the given context — speak qualitatively if you don't have exact data.
- Do not use markdown headers or bullet lists; write in plain conversational sentences.`;

app.post('/api/ai-chat', async (req, res) => {
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'Server is missing OPENROUTER_API_KEY' });
  }
  const { message, history, weatherContext } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }

  const contextBlock = weatherContext
    ? `Current weather context (city on screen): ${JSON.stringify(weatherContext)}`
    : 'No weather context available yet.';

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(Array.isArray(history) ? history : []).map(h => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: h.text
    })),
    { role: 'user', content: `${contextBlock}\n\nUser: ${message}` }
  ];

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Weather Dashboard'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages,
        temperature: 0.8,
        max_tokens: 200
      })
    });
    const data = await r.json();
    if (!r.ok) {
      console.error('OpenRouter error:', data);
      return res.status(r.status).json({ error: data.error?.message || 'OpenRouter request failed' });
    }
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't think of anything to say!";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Weather dashboard running at http://localhost:${PORT}`);
});