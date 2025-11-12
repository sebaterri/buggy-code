# ⚽ Soccer Klout - Player Influence Scoring Web App

A full-stack web application for discovering and comparing soccer players based on their **influence scores**. Similar to Klout for social media, this app calculates player influence from multiple metrics including goals, assists, match appearances, and social media mentions.

## 🎯 Features

### Backend (Node.js + TypeScript + Express)

✅ **Player Search API**
- Search players by name with autocomplete suggestions
- Match scoring algorithm for relevance ranking
- Cached API responses to avoid rate limits

✅ **Player Stats & Profiles**
- Detailed player information (name, club, position, nationality, age)
- Performance stats (goals, assists, appearances, social mentions)
- Real-time stat retrieval with caching

✅ **Influence Score Calculation**
- Formula: `influence = goals × 3 + assists × 2 + appearances × 1 + socialMentions × 0.5`
- Normalized scoring to 0-100 scale
- League-specific and position-specific weight adjustments
- Detailed score breakdown (goals, assists, appearances, social)

✅ **Leaderboard**
- Top 10-50 players ranked by influence
- Filter by league and position
- Dynamic ranking with normalization

✅ **Player Comparison**
- Compare 2-5 players side-by-side
- Visual charts showing influence differences
- Performance radar charts
- Detailed stat breakdowns

✅ **Caching & Performance**
- In-memory caching with configurable TTLs
- Automatic cache expiration
- Graceful error handling
- Support for thousands of requests

### Frontend (React + TypeScript + Tailwind CSS)

✅ **Search Page**
- Live search with debounce
- Autocomplete suggestions
- Result grid with player cards
- Responsive design for mobile/tablet

✅ **Player Profile Page**
- Large influence score circle (0-100)
- Performance stats with visual bars
- Influence breakdown by category
- Call-to-action buttons (Compare, Search More)

✅ **Leaderboard Page**
- Top players ranked with badges
- Filterable by league and position
- Adjustable limit (5, 10, 20, 50)
- Responsive table/card layout

✅ **Comparison Page**
- Multi-player selection (2-5 players)
- Bar charts for influence comparison
- Radar charts for stat comparison
- Side-by-side performance stats
- Visual influence score circles

✅ **State Management**
- useReducer hooks for complex state
- Debounced search for performance
- API response caching
- Error boundaries and fallbacks

✅ **UI/UX**
- Modern gradient design
- Color-coded influence levels
- Mobile-responsive layouts
- Smooth animations and transitions
- Interactive charts (Recharts)
- Lucide icons for visual clarity

## 🏗️ Project Structure

```
soccer-klout/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Express server setup
│   │   ├── types.ts                 # TypeScript types
│   │   ├── services/
│   │   │   ├── cache.ts             # Caching service
│   │   │   ├── footballDataApi.ts   # API client & mock data
│   │   │   └── influenceScoring.ts  # Scoring algorithm
│   │   └── routes/
│   │       └── players.ts           # API endpoints
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── index.tsx                # React entry point
│   │   ├── index.css                # Global styles
│   │   ├── App.tsx                  # Main app component
│   │   ├── types.ts                 # TypeScript types
│   │   ├── api/
│   │   │   └── client.ts            # API client
│   │   ├── hooks/
│   │   │   ├── usePlayer.ts         # Player data hook
│   │   │   ├── useSearch.ts         # Search hook
│   │   │   ├── useLeaderboard.ts    # Leaderboard hook
│   │   │   └── useComparison.ts     # Comparison hook
│   │   ├── components/
│   │   │   ├── InfluenceCircle.tsx  # Circular progress
│   │   │   ├── PlayerCard.tsx       # Player card component
│   │   │   └── StatBar.tsx          # Progress bar
│   │   └── pages/
│   │       ├── SearchPage.tsx       # Main search interface
│   │       ├── PlayerProfilePage.tsx # Player details
│   │       ├── LeaderboardPage.tsx  # Rankings
│   │       └── ComparisonPage.tsx   # Multi-player comparison
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Build TypeScript
npm run build

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# App opens on http://localhost:3000
```

## 📊 API Endpoints

### Search Players
```
GET /api/players?name=NAME
```
Response:
```json
{
  "results": [
    {
      "id": "1",
      "name": "Lionel Messi",
      "club": "Inter Miami CF",
      "position": "Forward",
      "nationality": "Argentina",
      "age": 37,
      "matchScore": 100
    }
  ],
  "totalCount": 1
}
```

### Get Player Stats
```
GET /api/players/:id/stats
```
Response:
```json
{
  "profile": {
    "id": "1",
    "name": "Lionel Messi",
    "club": "Inter Miami CF",
    "position": "Forward",
    "nationality": "Argentina",
    "age": 37
  },
  "stats": {
    "goals": 807,
    "assists": 318,
    "appearances": 1000,
    "socialMentions": 5000000
  }
}
```

### Get Influence Score
```
GET /api/players/:id/klout?position=Forward&league=Premier_League
```
Response:
```json
{
  "playerId": "1",
  "playerName": "Lionel Messi",
  "influence": 4156.5,
  "normalizedInfluence": 92.3,
  "breakdown": {
    "goalsScore": 2421,
    "assistsScore": 636,
    "appearancesScore": 1000,
    "socialScore": 2500000
  }
}
```

### Get Leaderboard
```
GET /api/players/leaderboard/top?limit=10&league=Premier_League&position=Forward
```

### Compare Players
```
POST /api/players/compare
```
Request body:
```json
{
  "playerIds": ["1", "2", "3"]
}
```

## 📈 Influence Score Algorithm

The influence score is calculated using weighted metrics:

```typescript
influence = 
  goals × 3 +           // Goals are heavily weighted
  assists × 2 +         // Assists are moderately weighted
  appearances × 1 +     // Match appearances count
  socialMentions × 0.5  // Social media presence
```

### Normalization
- Raw scores are normalized to 0-100 scale using logarithmic function
- Reference max: ~4500 (Messi's approx influence)
- Clamped to prevent outliers

### Dynamic Weights
Weights adjust based on:
- **Position**: Forwards emphasize goals (×4), Midfielders emphasize assists (×3)
- **League**: Different leagues have different competitive levels
- **Custom**: API accepts custom weights in query parameters

## 🎨 UI Components

### InfluenceCircle
Circular progress indicator showing 0-100 influence score
- Color-coded: Red (0-40), Amber (40-60), Blue (60-80), Green (80-100)
- Animated stroke animation
- Customizable size (sm, md, lg)

### PlayerCard
Displays player info in a compact card layout
- Player photo/avatar
- Name, club, position, nationality
- Match score progress bar
- Selection indicator

### StatBar
Horizontal progress bar for stat visualization
- Label and value display
- Color-coded bars
- Customizable colors

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
FOOTBALL_DATA_API_KEY=demo
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Caching Configuration
- Standard TTL: 10 minutes for player data
- Search TTL: 1 hour
- Stats TTL: 30 minutes
- Auto-cleanup every 2 minutes

## 💾 Data Sources

Currently using **mock data** for demo purposes:
- Lionel Messi (goals: 807, assists: 318)
- Cristiano Ronaldo (goals: 890, assists: 270)
- Erling Haaland (goals: 186, assists: 45)
- Kylian Mbappé (goals: 312, assists: 95)
- Neymar Jr (goals: 140, assists: 102)

**To integrate real API:**
1. Get API key from [football-data.org](https://www.football-data.org)
2. Update `FOOTBALL_DATA_API_KEY` in .env
3. Implement real API calls in `footballDataApi.ts`

## 🧪 Testing

### Search Functionality
1. Go to Search page
2. Type player name (e.g., "Messi")
3. Click result or press Enter
4. View profile with influence score

### Compare Players
1. Go to Compare page
2. Search and select 2-5 players
3. Click "Compare"
4. View charts and stat breakdowns

### Leaderboard
1. Go to Leaderboard
2. Adjust filters (league, position, limit)
3. View ranked players
4. Click player for profile

## 🎯 Advanced Features (Bonus)

✅ **Player Comparison** - Side-by-side influence & stats charts
✅ **Leaderboard** - Top 10-50 players with dynamic ranking
✅ **In-Memory Caching** - Efficient API response caching
✅ **Position-Based Scoring** - Adjusted weights for defenders, midfielders
✅ **League-Specific Scoring** - Different scales for various leagues
✅ **Responsive UI** - Mobile-friendly grid/card layouts
✅ **Radar Charts** - Multi-dimensional stat visualization

## 📝 Performance Optimizations

1. **Debounced Search** - 300ms delay to reduce API calls
2. **Response Caching** - Configurable TTL with auto-cleanup
3. **Lazy Loading** - Components load on demand
4. **Memoization** - React hooks prevent unnecessary re-renders
5. **Code Splitting** - Page components load separately

## 🐛 Error Handling

- Graceful API error handling with user-friendly messages
- Fallback UI for missing data
- Network error recovery
- Validation of input data

## 🚀 Deployment

### Backend (Heroku)
```bash
cd backend
npm run build
git push heroku main
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

## 📚 Technologies Used

**Backend:**
- Node.js 18+
- Express.js 4
- TypeScript 5
- Axios for HTTP requests
- node-cache for caching

**Frontend:**
- React 18
- React Router v6
- TypeScript 5
- Tailwind CSS 3
- Recharts for visualizations
- Lucide React for icons

## 📄 License

MIT License - Feel free to use this project for learning and development!

## 👨‍💻 Author

Created as a full-stack coding assessment project demonstrating:
- TypeScript best practices
- React state management
- RESTful API design
- Algorithm implementation
- UI/UX design patterns
- Production-ready code structure

---

**⚽ Enjoy discovering soccer player influence! ⚽**
