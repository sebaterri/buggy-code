# API Examples & Testing

Complete guide to testing the Fantasy Soccer API with curl and examples.

## Base URL
```
http://localhost:5000
```

---

## 📋 Players Endpoints

### Get All Players
```bash
curl http://localhost:5000/players
```

### Get Players by Position
```bash
# Forwards only
curl http://localhost:5000/players?position=FWD

# Defenders only
curl http://localhost:5000/players?position=DEF

# Midfielders only
curl http://localhost:5000/players?position=MID

# Goalkeepers only
curl http://localhost:5000/players?position=GK
```

### Sort Players
```bash
# By Fantasy Score (default)
curl http://localhost:5000/players?sortBy=fantasyScore

# By Goals
curl http://localhost:5000/players?sortBy=goals

# By Assists
curl http://localhost:5000/players?sortBy=assists

# By Appearances
curl http://localhost:5000/players?sortBy=appearances
```

### Combined Filters
```bash
# Top forwards by fantasy score
curl http://localhost:5000/players?position=FWD&sortBy=fantasyScore

# Defenders by goals
curl http://localhost:5000/players?position=DEF&sortBy=goals
```

### Get Single Player
```bash
curl http://localhost:5000/players/p1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "p1",
    "name": "Mohamed Salah",
    "club": "Liverpool",
    "position": "FWD",
    "photo": "https://api.sofascore.com/...",
    "stats": {
      "goals": 18,
      "assists": 8,
      "cleanSheets": 0,
      "yellowCards": 3,
      "redCards": 0,
      "appearances": 32,
      "avgRating": 8.2
    },
    "fantasyScore": 88,
    "market_value": 95000000
  }
}
```

---

## 📊 Player Statistics & Scoring

### Get Player Stats
```bash
curl http://localhost:5000/players/p1/stats
```

### Get Player Fantasy Score
```bash
curl http://localhost:5000/players/p1/fantasyScore
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fantasyScore": 88,
    "avgScore": 2.75
  }
}
```

### Get Top Players Leaderboard
```bash
# Top 10 players (default)
curl http://localhost:5000/topPlayers

# Top 20 players
curl http://localhost:5000/topPlayers?limit=20

# Top defenders
curl http://localhost:5000/topPlayers?limit=10&position=DEF

# Top forwards
curl http://localhost:5000/topPlayers?limit=10&position=FWD
```

---

## 👥 Team Management

### Validate Team Composition
```bash
curl -X POST http://localhost:5000/validate-team \
  -H "Content-Type: application/json" \
  -d '{
    "composition": {
      "goalkeepers": 1,
      "defenders": 4,
      "midfielders": 4,
      "forwards": 2
    }
  }'
```

**Response (Valid):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "errors": []
  }
}
```

**Response (Invalid):**
```json
{
  "success": true,
  "data": {
    "valid": false,
    "errors": [
      "Team must have exactly 11 players, got 11",
      "Team must have between 3 and 6 defenders"
    ]
  }
}
```

### Calculate Team Score
```bash
curl -X POST http://localhost:5000/calculate-team-score \
  -H "Content-Type: application/json" \
  -d '{
    "playerIds": ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p12"]
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScore": 542,
    "avgScore": 49.27,
    "playerCount": 11,
    "composition": {
      "goalkeepers": 1,
      "defenders": 3,
      "midfielders": 4,
      "forwards": 3
    },
    "isValid": true,
    "errors": []
  }
}
```

---

## 🧮 Custom Scoring

### Calculate With Custom Formula
```bash
curl -X POST http://localhost:5000/custom-scoring \
  -H "Content-Type: application/json" \
  -d '{
    "stats": {
      "goals": 20,
      "assists": 8,
      "cleanSheets": 0,
      "yellowCards": 2,
      "redCards": 0,
      "appearances": 30
    },
    "formula": {
      "goalsMultiplier": 5,
      "assistsMultiplier": 2,
      "cleanSheetsMultiplier": 1,
      "yellowCardsPenalty": 0.5,
      "redCardsPenalty": 2
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fantasyScore": 116,
    "avgScore": 3.87,
    "formula": {
      "goalsMultiplier": 5,
      "assistsMultiplier": 2,
      "cleanSheetsMultiplier": 1,
      "yellowCardsPenalty": 0.5,
      "redCardsPenalty": 2
    }
  }
}
```

---

## ⚙️ System Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "success": true,
  "status": "OK"
}
```

### Clear Cache
```bash
curl -X POST http://localhost:5000/clear-cache
```

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared"
}
```

---

## Example Workflows

### Build a Complete Team

1. **Get all players**
```bash
curl http://localhost:5000/players > players.json
```

2. **Select players manually or filter by position**
```bash
# Get 1 goalkeeper
curl http://localhost:5000/topPlayers?limit=1&position=GK

# Get top 4 defenders
curl http://localhost:5000/topPlayers?limit=4&position=DEF

# Get top 3 midfielders
curl http://localhost:5000/topPlayers?limit=3&position=MID

# Get top 2 forwards
curl http://localhost:5000/topPlayers?limit=2&position=FWD
```

3. **Combine player IDs**
```bash
# Example team: p12, p8, p9, p10, p4, p5, p6, p1, p2, p3, p7
```

4. **Calculate team score**
```bash
curl -X POST http://localhost:5000/calculate-team-score \
  -H "Content-Type: application/json" \
  -d '{"playerIds": ["p12", "p8", "p9", "p10", "p4", "p5", "p6", "p1", "p2", "p3", "p7"]}'
```

### Compare Player Scores

1. **Get specific players**
```bash
curl http://localhost:5000/players/p1
curl http://localhost:5000/players/p2
curl http://localhost:5000/players/p3
```

2. **Compare their fantasy scores**
- Haaland (p2): ~117 points
- Salah (p1): ~88 points
- Kane (p3): ~98 points
- **Winner: Haaland** ⭐

### Experiment with Scoring

1. **Use default formula**
```bash
curl http://localhost:5000/players/p2/fantasyScore
# Result: 117 points
```

2. **Use custom formula (Goals worth more)**
```bash
curl -X POST http://localhost:5000/custom-scoring \
  -H "Content-Type: application/json" \
  -d '{
    "stats": {
      "goals": 27,
      "assists": 5,
      "cleanSheets": 0,
      "yellowCards": 2,
      "redCards": 0,
      "appearances": 31
    },
    "formula": {
      "goalsMultiplier": 6,
      "assistsMultiplier": 2,
      "cleanSheetsMultiplier": 1,
      "yellowCardsPenalty": 0.5,
      "redCardsPenalty": 2
    }
  }'
# Result: 161 points (higher because goals are worth more)
```

---

## Player IDs Reference

| ID  | Name | Position | Club |
|-----|------|----------|------|
| p1  | Mohamed Salah | FWD | Liverpool |
| p2  | Erling Haaland | FWD | Manchester City |
| p3  | Harry Kane | FWD | Bayern Munich |
| p4  | Vinicius Jr | MID | Real Madrid |
| p5  | Rodri | MID | Manchester City |
| p6  | Jude Bellingham | MID | Real Madrid |
| p7  | Florian Wirtz | MID | Bayer Leverkusen |
| p8  | Antonio Rudiger | DEF | Real Madrid |
| p9  | Virgil van Dijk | DEF | Liverpool |
| p10 | Kyle Walker | DEF | Manchester City |
| p11 | Joao Cancelo | DEF | Barcelona |
| p12 | Ederson | GK | Manchester City |
| p13 | Alisson | GK | Liverpool |
| p14 | Gianluigi Donnarumma | GK | PSG |

---

## Error Responses

### Player Not Found
```json
{
  "success": false,
  "error": "Player not found"
}
```

### Invalid Team Composition
```json
{
  "success": false,
  "error": "One or more players not found"
}
```

### Server Error
```json
{
  "success": false,
  "error": "Internal Server Error"
}
```

---

## Caching Behavior

- **Default TTL**: 600 seconds (10 minutes)
- **Endpoints cached**: `/players`, `/topPlayers`, `/players/:id/*`
- **Clear cache**: `POST /clear-cache`

---

## Rate Limiting

Currently no rate limiting implemented. Use responsibly in production!

---

## Performance Tips

1. Use `?limit=10` to reduce data
2. Filter by position first, then sort
3. Cache responses on client side
4. Use POST requests for complex calculations

---

For more information, see [README.md](README.md) and [DEVELOPMENT.md](DEVELOPMENT.md)
