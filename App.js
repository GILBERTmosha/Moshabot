import React, { useState } from 'react';

const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

function WeatherCard({ current }) {
  if (!current) return null;
  const icon = current.weather?.icon;
  const desc = current.weather?.description || '';
  return (
    <div style={{
      border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center'
    }}>
      {icon && <img alt="icon" src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />}
      <div style={{ marginLeft: 12 }}>
        <h2 style={{ margin: 0 }}>{current.temp}°C</h2>
        <div style={{ color: '#555' }}>{desc}</div>
        <div style={{ fontSize: 12, color: '#777' }}>Feels like {current.feels_like}°C • Humidity {current.humidity}%</div>
      </div>
    </div>
  );
}

function ForecastList({ daily }) {
  if (!daily) return null;
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
      {daily.slice(0, 7).map((d) => {
        const date = new Date(d.dt * 1000).toLocaleDateString();
        const icon = d.weather?.[0]?.icon;
        return (
          <div key={d.dt} style={{
            minWidth: 120, border: '1px solid #eee', padding: 8, borderRadius: 8, textAlign: 'center'
          }}>
            <div style={{ fontSize: 12, color: '#555' }}>{date}</div>
            {icon && <img alt="i" src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />}
            <div style={{ fontWeight: '600' }}>{d.temp.day}°C</div>
            <div style={{ fontSize: 12, color: '#777' }}>{d.weather?.[0]?.main}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    if (!city) return;
    setLoading(true);
    setErr('');
    setData(null);
    try {
      const res = await fetch(`${apiBase}/api/weather?city=${encodeURIComponent(city)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      setData(json);
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui,Segoe UI,Roboto', padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1>Weather Dashboard</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g. Nairobi)"
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 12px', borderRadius: 6 }}>Search</button>
      </form>

      {loading && <div>Loading…</div>}
      {err && <div style={{ color: 'red' }}>{err}</div>}

      {data && (
        <>
          <h2>{data.city}</h2>
          <WeatherCard current={data.current} />
          <h3>7-day forecast</h3>
          <ForecastList daily={data.daily} />
        </>
      )}

      <footer style={{ marginTop: 40, fontSize: 12, color: '#666' }}>
        Data from <a href="https://openweathermap.org" target="_blank" rel="noreferrer">OpenWeatherMap</a>.
      </footer>
    </div>
  );
}