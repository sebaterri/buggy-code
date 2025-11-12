# Quick Start Guide

Get the Fantasy Soccer Dashboard up and running in 5 minutes!

## Option 1: Docker (Recommended)

### Requirements
- Docker & Docker Compose installed

### Run
```bash
docker-compose up --build
```

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Option 2: Local Development

### Requirements
- Node.js 18+
- npm or yarn

### Terminal 1: Start Backend

```bash
cd backend
npm install
npm run dev
```

✅ Backend ready at: http://localhost:5000

### Terminal 2: Start Frontend

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000 npm start
```

✅ Frontend ready at: http://localhost:3000

---

## First Steps

1. **View Players**: The dashboard displays 14 top soccer players
2. **Search**: Use the search bar to find players by name or club
3. **Filter**: Select position to filter players (GK, DEF, MID, FWD)
4. **Sort**: Click the sort dropdown to arrange by Fantasy Score, Goals, etc.
5. **Add to Team**: Click "Add" on player cards to add them to your team
6. **View Team**: Your selected players appear in the "Team Players" section
7. **Analyze**: Check the charts to see team composition and player stats

---

## Key Features Demo

### ⚽ Player Cards
- Click "Add" to select players
- Heart icon shows selected players
- Fantasy score displayed prominently
- Stats: Goals, Assists, Appearances, Clean Sheets, Cards

### 📊 Visualizations
- **Team Composition Pie Chart**: Distribution of positions
- **Player Comparison Bar Chart**: Compare top team players
- **Team Summary**: Total score, average score, validation status

### 🎛️ Controls
- **Grid/Table Toggle**: Switch between card and table views
- **Search Bar**: Find players by name or club
- **Position Filter**: Filter by GK, DEF, MID, FWD
- **Sort Dropdown**: Sort by different statistics

### ✅ Team Validation
- Maximum 11 players
- At least 1 goalkeeper
- 3-6 defenders
- 2-5 midfielders
- 1-3 forwards
- Real-time validation status

---

## Available Players (Mock Data)

### Forwards (FWD)
- Mohamed Salah (Liverpool) - 88 pts
- Erling Haaland (Manchester City) - 117 pts
- Harry Kane (Bayern Munich) - 98 pts

### Midfielders (MID)
- Vinicius Jr (Real Madrid) - 79 pts
- Rodri (Manchester City) - 54 pts
- Jude Bellingham (Real Madrid) - 66 pts
- Florian Wirtz (Bayer Leverkusen) - 78 pts

### Defenders (DEF)
- Antonio Rudiger (Real Madrid) - 38 pts
- Virgil van Dijk (Liverpool) - 38 pts
- Kyle Walker (Manchester City) - 42 pts
- Joao Cancelo (Barcelona) - 28 pts

### Goalkeepers (GK)
- Ederson (Manchester City) - 34 pts
- Alisson (Liverpool) - 38 pts
- Gianluigi Donnarumma (PSG) - 30 pts

---

## Fantasy Score Formula

```
Score = Goals×4 + Assists×3 + CleanSheets×2 - YellowCards - RedCards×3
```

Example: Haaland (27 goals, 5 assists)
```
27×4 + 5×3 + 0×2 - 2 - 0×3 = 108 + 15 - 2 = 121 points
```

---

## API Endpoints Reference

### Get Players
```bash
curl http://localhost:5000/players
curl http://localhost:5000/players?position=FWD
curl http://localhost:5000/players?sortBy=goals
```

### Get Top Players
```bash
curl http://localhost:5000/topPlayers?limit=10
```

### Get Player Details
```bash
curl http://localhost:5000/players/p1
curl http://localhost:5000/players/p1/stats
curl http://localhost:5000/players/p1/fantasyScore
```

### Calculate Team Score
```bash
curl -X POST http://localhost:5000/calculate-team-score \
  -H "Content-Type: application/json" \
  -d '{"playerIds": ["p1", "p2", "p3"]}'
```

### Health Check
```bash
curl http://localhost:5000/health
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Frontend API connection fails
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL environment variable
- Verify CORS is enabled in backend

### Clear cache
```bash
curl -X POST http://localhost:5000/clear-cache
```

---

## Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [DEVELOPMENT.md](DEVELOPMENT.md) for advanced setup
3. Explore the code in `backend/src` and `frontend/src`
4. Customize the player data in `backend/src/mockData.ts`
5. Add your own features!

---

## Technologies

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Tailwind CSS
- **Charts**: Chart.js
- **State**: React Context + useReducer
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

---

**🎉 You're ready to build your dream team!**

For more help, see [DEVELOPMENT.md](DEVELOPMENT.md) or open an issue in the repository.
