const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  console.error('Missing OPENWEATHER_API_KEY in environment. See .env.example');
  process.exit(1);
}

// GET /api/weather?city=CityName
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'city query required' });

  try {
    // 1) get city coordinates and current weather
    const weatherResp = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: city, appid: API_KEY, units: 'metric' }
    });

    const { coord, main, weather, wind, name } = weatherResp.data;
    const lat = coord.lat;
    const lon = coord.lon;

    // 2) get One Call daily forecast
    const onecallResp = await axios.get('https://api.openweathermap.org/data/2.5/onecall', {
      params: {
        lat, lon, exclude: 'minutely,hourly,alerts', units: 'metric', appid: API_KEY
      }
    });

    const combined = {
      city: name,
      current: {
        temp: main.temp,
        feels_like: main.feels_like,
        humidity: main.humidity,
        pressure: main.pressure,
        weather: weather[0],
        wind
      },
      daily: onecallResp.data.daily // array with daily forecast
    };

    res.json(combined);
  } catch (err) {
    if (err.response && err.response.data) {
      return res.status(err.response.status).json({ error: err.response.data.message });
    }
    console.error(err.message || err);
    res.status(500).json({ error: 'internal_server_error' });
  }
});

app.listen(PORT, () => {
  console.log(`Weather server listening on http://localhost:${PORT}`);
});