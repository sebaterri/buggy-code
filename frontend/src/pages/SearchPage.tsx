import React, { useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import PlayerCard from '../components/PlayerCard';
import { Search, Loader } from 'lucide-react';

interface SearchPageProps {
  onPlayerSelect?: (playerId: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onPlayerSelect }) => {
  const { query, results, suggestions, loading, error, searched, debouncedSearch, clear } =
    useSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
    setShowSuggestions(true);
  };

  const handlePlayerClick = (playerId: string) => {
    onPlayerSelect?.(playerId);
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    handlePlayerClick(suggestion.id);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚽ Soccer Klout</h1>
          <p className="text-gray-600">Find and compare soccer players by influence score</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a player (e.g., Messi, Ronaldo)..."
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => {
                  clear();
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-64 overflow-y-auto">
              {suggestions.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleSuggestionClick(player)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-800">{player.name}</p>
                    <p className="text-sm text-gray-600">
                      {player.position} • {player.club}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {player.nationality}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">❌ {error.error}</p>
          </div>
        )}

        {/* No Results */}
        {searched && results.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No players found. Try a different search!</p>
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Found {results.length} player{results.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerClick(player.id)}
                  className="text-left"
                >
                  <PlayerCard player={player} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        {!searched && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
            <p className="text-gray-700">
              Start typing a player name above to search. Try popular players like{' '}
              <span className="font-semibold text-blue-600">Messi, Ronaldo, Haaland</span>, or{' '}
              <span className="font-semibold text-blue-600">Mbappé</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
