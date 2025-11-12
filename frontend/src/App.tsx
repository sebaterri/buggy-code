import React, { useState } from 'react';
import SearchPage from './pages/SearchPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ComparisonPage from './pages/ComparisonPage';
import { BarChart3, Search, Users, Trophy } from 'lucide-react';

type PageType = 'search' | 'profile' | 'leaderboard' | 'comparison';

interface AppState {
  currentPage: PageType;
  selectedPlayerId?: string;
  comparisonPlayerIds?: string[];
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'search',
  });

  const handlePlayerSelect = (playerId: string) => {
    setAppState({
      currentPage: 'profile',
      selectedPlayerId: playerId,
    });
  };

  const handleCompare = (playerId: string) => {
    setAppState({
      currentPage: 'comparison',
      comparisonPlayerIds: [playerId],
    });
  };

  const handleBackToSearch = () => {
    setAppState({
      currentPage: 'search',
    });
  };

  const handleNavigate = (page: PageType) => {
    setAppState({
      currentPage: page,
    });
  };

  const renderPage = () => {
    switch (appState.currentPage) {
      case 'profile':
        return (
          <PlayerProfilePage
            playerId={appState.selectedPlayerId || ''}
            onBack={handleBackToSearch}
            onCompare={handleCompare}
          />
        );
      case 'leaderboard':
        return <LeaderboardPage onPlayerSelect={handlePlayerSelect} />;
      case 'comparison':
        return (
          <ComparisonPage
            initialPlayerIds={appState.comparisonPlayerIds}
            onBack={handleBackToSearch}
          />
        );
      case 'search':
      default:
        return <SearchPage onPlayerSelect={handlePlayerSelect} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('search')}>
              <div className="text-2xl">⚽</div>
              <h1 className="text-2xl font-bold text-blue-600">Soccer Klout</h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNavigate('search')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  appState.currentPage === 'search'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>

              <button
                onClick={() => handleNavigate('leaderboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  appState.currentPage === 'leaderboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </button>

              <button
                onClick={() => handleNavigate('comparison')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  appState.currentPage === 'comparison'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{renderPage()}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            ⚽ Soccer Klout - Discover and compare player influence scores
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © 2024 Soccer Klout. Data sourced from football statistics APIs.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
