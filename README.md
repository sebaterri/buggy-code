# Interactive Fantasy Soccer Dashboard

This project implements an interactive fantasy soccer dashboard with a Node.js/Express/TypeScript backend and a React/TypeScript/Tailwind CSS frontend. Users can track players, compare stats, and create a "fantasy team" with a visual, interactive UI.

## Features

### Backend
- **Player Endpoints**: API to fetch a list of players, detailed player stats, and calculated fantasy scores.
- **Top Players Endpoint**: An optional endpoint to get a leaderboard of players by fantasy score, with filtering by position and limit.
- **Fantasy Score Calculation**: A formula `(goals*4 + assists*3 + cleanSheets*2 - yellowCards - redCards*3)` is used to calculate player fantasy scores.
- **TypeScript Types**: Strong typing for all data structures.
- **Validation**: Basic validation for player IDs on stat and fantasy score endpoints.
- **Caching**: Simple in-memory caching to optimize API responses and reduce redundant computations.

### Frontend
- **Player Dashboard**: Displays a list of all available players.
- **Search Functionality**: Users can search for players by name.
- **Sortable Table**: Players are displayed in a table that can be sorted by name, club, position, goals, assists, and fantasy score.
- **Fantasy Team Management**: Users can add players from the main list to their fantasy team.
- **Drag-and-Drop Reordering**: Players within the fantasy team can be reordered using drag-and-drop.
- **Player Cards**: Each player in the main list and fantasy team is displayed with their photo, club, position, and full stats (goals, assists, appearances, clean sheets, cards, and fantasy score).
- **Charts / Visuals**:
    - **Pie Chart**: Shows the distribution of player positions within the fantasy team.
    - **Bar Chart**: Compares the fantasy scores of players currently in the fantasy team.
- **State Management**: Uses React's `useReducer` hook for managing the fantasy team's state.
- **Responsive Design**: The layout is responsive, adapting to different screen sizes using Tailwind CSS.

## Technologies Used

### Backend
- Node.js
- Express.js
- TypeScript

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- Chart.js (and react-chartjs-2 for React integration)
- @hello-pangea/dnd (for drag-and-drop functionality)

## Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/sebaterri/cursor.git
cd cursor
```

### 2. Create a new branch (if you haven't already)
```bash
git checkout -b feature/fantasy-soccer-dashboard
```

### 3. Backend Setup
Navigate to the backend directory, install dependencies, and build the project.
```bash
cd ./backend # or the root directory if the backend files are in the root
npm install
npm run build
npm start
# The backend server will run on http://localhost:3000
```

### 4. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies.
```bash
cd ./frontend
npm install
npm start
# The frontend application will run on http://localhost:3001 (or another available port)
```

Once both the backend and frontend servers are running, open your browser and navigate to `http://localhost:3001` (or the port where your React app is running) to access the dashboard.

## API Endpoints

The backend API provides the following endpoints:

-   `GET /players`: Fetches a list of all players (id, name, club, position, photo).
-   `GET /players/:id/stats`: Fetches detailed statistics for a specific player (goals, assists, appearances, clean sheets, yellow/red cards).
-   `GET /players/:id/fantasyScore`: Calculates and returns the fantasy score for a specific player.
-   `GET /topPlayers?limit=10&position=DEF|MID|FWD`: (Optional) Returns a leaderboard of players by fantasy score, with optional `limit` and `position` filters.

## Frontend Components

-   `App.tsx`: The main application component, handling overall state, data fetching, search, sorting, and rendering of other components.
-   `components/PlayerCard.tsx`: Displays individual player information, including stats and fantasy score, with an option to add the player to the fantasy team.
-   `components/FantasyTeamPositionChart.tsx`: Renders a pie chart showing the distribution of player positions in the fantasy team.
-   `components/FantasyScoreBarChart.tsx`: Renders a bar chart comparing the fantasy scores of players in the fantasy team.

## Future Enhancements

-   **Line chart for player performance**: Implement a line chart showing a player's performance over recent matches. This would require historical data, which is not available in the current mock setup.
-   **Team Validation**: Add rules for the fantasy team, such as a maximum of 11 players, at least 1 goalkeeper, and limits per club.
-   **Interactive Filters**: Implement more advanced filters for players (e.g., by league, club) with live updates.
-   **Backend Data Source**: Replace mock data with a real external soccer data API.
-   **User Authentication**: Implement user accounts to save fantasy teams.
-   **Leaderboard**: Create a global leaderboard for top fantasy teams among users (requires persistent storage).
