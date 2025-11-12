import React, { useEffect } from 'react';
import { useComparison } from '../hooks/useComparison';
import { useSearch } from '../hooks/useSearch';
import PlayerCard from '../components/PlayerCard';
import InfluenceCircle from '../components/InfluenceCircle';
import StatBar from '../components/StatBar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Loader, ArrowLeft, X } from 'lucide-react';

interface ComparisonPageProps {
  initialPlayerIds?: string[];
  onBack?: () => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  initialPlayerIds = [],
  onBack,
}) => {
  const { data, selectedIds, loading, error, togglePlayer, compare, clear } = useComparison();
  const { results, debouncedSearch } = useSearch();

  useEffect(() => {
    if (initialPlayerIds.length > 0) {
      compare(initialPlayerIds);
    }
  }, []);

  const handleCompare = () => {
    compare();
  };

  const chartData =
    data?.players.map((p) => ({
      name: p.profile.name,
      influence: p.influenceScore.normalizedInfluence,
      goals: p.stats.goals,
      assists: p.stats.assists,
      appearances: p.stats.appearances / 100,
    })) || [];

  const radarData =
    data?.players.map((p) => ({
      stat: p.profile.name,
      influence: p.influenceScore.normalizedInfluence,
      goals: (p.stats.goals / Math.max(...(data?.players.map((x) => x.stats.goals) || [1]))) * 100,
      assists: (p.stats.assists / Math.max(...(data?.players.map((x) => x.stats.assists) || [1]))) * 100,
      appearances:
        (p.stats.appearances / Math.max(...(data?.players.map((x) => x.stats.appearances) || [1]))) *
        100,
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Player Comparison</h1>
            <p className="text-gray-600">Select 2-5 players to compare their stats and influence</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Player Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Selected Players ({selectedIds.length}/5)</h2>

          {/* Selected Players Display */}
          {selectedIds.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {selectedIds.map((id) => {
                const playerData = data?.players.find((p) => p.profile.id === id);
                return playerData ? (
                  <div
                    key={id}
                    className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200 relative"
                  >
                    <button
                      onClick={() => togglePlayer(id)}
                      className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="font-semibold text-sm truncate">{playerData.profile.name}</p>
                    <p className="text-xs text-gray-600">{playerData.profile.position}</p>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* Search for Players */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search and add players..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {results.map((player) => (
                <button
                  key={player.id}
                  onClick={() => {
                    if (!selectedIds.includes(player.id) && selectedIds.length < 5) {
                      togglePlayer(player.id);
                    }
                  }}
                  disabled={selectedIds.includes(player.id) || selectedIds.length >= 5}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedIds.includes(player.id)
                      ? 'border-blue-500 bg-blue-50 cursor-default'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 ' +
                        (selectedIds.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')
                  }`}
                >
                  <p className="font-semibold text-sm">{player.name}</p>
                  <p className="text-xs text-gray-600">
                    {player.position} • {player.club}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCompare}
              disabled={selectedIds.length < 2}
              className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                selectedIds.length < 2
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Compare ({selectedIds.length})
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={() => {
                  clear();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-600">Comparing players...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">❌ {error.error}</p>
          </div>
        )}

        {/* Comparison Results */}
        {data && !loading && (
          <div className="space-y-6">
            {/* Influence Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {data.players.map((player) => (
                <div key={player.profile.id} className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="font-bold text-center mb-3">{player.profile.name}</h3>
                  <div className="flex justify-center mb-3">
                    <div className="w-24 h-24">
                      <InfluenceCircle
                        score={player.influenceScore.normalizedInfluence}
                        size="md"
                        label="Influence"
                      />
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-600">{player.profile.position}</p>
                </div>
              ))}
            </div>

            {/* Bar Chart - Influence Comparison */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4">Influence Score Comparison</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="influence" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart - Stat Comparison */}
            {radarData.length > 1 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold mb-4">Performance Radar</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="stat" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {data.players.map((player, idx) => (
                      <Radar
                        key={player.profile.id}
                        name={player.profile.name}
                        dataKey={['influence', 'goals', 'assists', 'appearances'][idx % 4]}
                        stroke={['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][idx % 4]}
                        fill={['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][idx % 4]}
                        fillOpacity={0.25}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.players.map((player) => (
                <div key={player.profile.id} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4">{player.profile.name}</h3>
                  <div className="space-y-3">
                    <StatBar
                      label="Goals"
                      value={player.stats.goals}
                      max={Math.max(...data.players.map((p) => p.stats.goals))}
                      color="bg-red-500"
                    />
                    <StatBar
                      label="Assists"
                      value={player.stats.assists}
                      max={Math.max(...data.players.map((p) => p.stats.assists))}
                      color="bg-green-500"
                    />
                    <StatBar
                      label="Appearances"
                      value={player.stats.appearances / 10}
                      max={Math.max(...data.players.map((p) => p.stats.appearances)) / 10}
                      color="bg-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !data && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">
              Select 2-5 players and click Compare to see detailed comparison charts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonPage;
