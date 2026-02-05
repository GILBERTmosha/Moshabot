# Weather Dashboard (Starter)

Simple weather dashboard:
- Backend: Node + Express (proxy to OpenWeatherMap, keep API key server-side)
- Frontend: React (create-react-app style) - search by city, show current weather + 7-day forecast.

Prereqs:
- Node.js >= 16
- An OpenWeatherMap API key: https://openweathermap.org/api

Setup

1. Clone or copy repo and set API key:
   - Create `server/.env` from `.env.example` and set `OPENWEATHER_API_KEY`.

2. Install & run server:
   ```
   cd server
   npm install
   npm start
   ```
   Server runs on http://localhost:4000 by default.

3. Install & run client:
   ```
   cd client
   npm install
   npm start
   ```
   Client runs on http://localhost:3000 and proxies API calls to server.

How it works
- Client calls `/api/weather?city=CityName`.
- Server queries OpenWeatherMap `/weather` to get coordinates, then `/onecall` for daily forecast.
- Server returns combined data to client.

Notes & tips
- Keep your API key private. For production you may deploy the server to a secure host (Heroku, Vercel Serverless functions, etc.).
- Rate limits apply per your OpenWeatherMap plan.
- You can extend the frontend (maps, icons, caching, search history) or add server-side caching (Redis) to reduce API hits.