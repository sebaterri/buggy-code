import React, { useEffect, useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import PlayerCard from '../components/PlayerCard';
import InfluenceCircle from '../components/InfluenceCircle';
import { Loader, Trophy } from 'lucide-react';

interface LeaderboardPageProps {
  onPlayerSelect?: (playerId: string) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onPlayerSelect }) => {
  const { entries, loading, error, fetchLeaderboard } = useLeaderboard();
  const [limit, setLimit] = useState(10);
  const [league, setLeague] = useState<string>('');
  const [position, setPosition] = useState<string>('');

  useEffect(() => {
    fetchLeaderboard(limit, league || undefined, position || undefined);
  }, [limit, league, position]);

  const leagues = ['Premier_League', 'La_Liga', 'Serie_A', 'Bundesliga', 'Ligue_1'];
  const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-10 h-10" />
            Player Leaderboard
          </h1>
          <p className="text-gray-600">Top players ranked by influence score</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Limit</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">League</label>
              <select
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">All Leagues</option>
                {leagues.map((l) => (
                  <option key={l} value={l}>
                    {l.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">All Positions</option>
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setLeague('');
                  setPosition('');
                  setLimit(10);
                }}
                className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading leaderboard...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">❌ {error.error}</p>
          </div>
        )}

        {/* Leaderboard Table */}
        {entries.length > 0 && (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.player.id}
                onClick={() => onPlayerSelect?.(entry.player.id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Rank Badge */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                      entry.rank === 1
                        ? 'bg-yellow-500'
                        : entry.rank === 2
                          ? 'bg-gray-400'
                          : entry.rank === 3
                            ? 'bg-orange-400'
                            : 'bg-blue-500'
                    }`}
                  >
                    {entry.rank}
                  </div>

                  {/* Player Info */}
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{entry.player.name}</h3>
                    <p className="text-sm text-gray-600">
                      {entry.player.position} • {entry.player.club} • {entry.player.nationality}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:grid grid-cols-4 gap-4 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Goals</p>
                      <p className="font-bold text-lg">-</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Assists</p>
                      <p className="font-bold text-lg">-</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Apps</p>
                      <p className="font-bold text-lg">-</p>
                    </div>
                  </div>

                  {/* Influence Score */}
                  <div className="flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Influence</p>
                      <div className="w-20 h-20">
                        <InfluenceCircle
                          score={entry.influence.normalizedInfluence}
                          size="sm"
                          label=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && entries.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No players found with these filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
