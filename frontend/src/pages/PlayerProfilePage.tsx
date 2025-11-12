import React, { useEffect } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { useComparison } from '../hooks/useComparison';
import InfluenceCircle from '../components/InfluenceCircle';
import StatBar from '../components/StatBar';
import { Loader, ArrowLeft, Trophy } from 'lucide-react';

interface PlayerProfilePageProps {
  playerId: string;
  onBack?: () => void;
  onCompare?: (playerId: string) => void;
}

export const PlayerProfilePage: React.FC<PlayerProfilePageProps> = ({
  playerId,
  onBack,
  onCompare,
}) => {
  const { data, loading, error, fetchPlayer } = usePlayer();

  useEffect(() => {
    fetchPlayer(playerId);
  }, [playerId, fetchPlayer]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading player profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </button>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-medium">❌ {error?.error || 'Player not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { profile, stats, influenceScore } = data;
  const maxStats = Math.max(stats.goals, stats.assists, stats.appearances / 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Player Photo & Basic Info */}
            <div className="flex flex-col items-center justify-center">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              )}
              <h1 className="text-2xl font-bold text-center">{profile.name}</h1>
              <p className="text-gray-600 text-center mt-2">{profile.club}</p>
            </div>

            {/* Influence Score Circle */}
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <InfluenceCircle score={influenceScore.normalizedInfluence} size="lg" />
              </div>
            </div>

            {/* Key Stats */}
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Position</p>
                <p className="text-lg font-bold">{profile.position}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Nationality</p>
                <p className="text-lg font-bold">{profile.nationality}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Age</p>
                <p className="text-lg font-bold">{profile.age}</p>
              </div>
              {profile.shirtNumber && (
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Shirt Number</p>
                  <p className="text-lg font-bold">#{profile.shirtNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Player Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Performance Stats</h2>
            <StatBar
              label="Goals"
              value={stats.goals}
              max={maxStats}
              color="bg-red-500"
              showValue
            />
            <StatBar
              label="Assists"
              value={stats.assists}
              max={maxStats}
              color="bg-green-500"
              showValue
            />
            <StatBar
              label="Appearances"
              value={stats.appearances / 10}
              max={maxStats}
              color="bg-blue-500"
              showValue={false}
            />
            <StatBar
              label="Social Mentions"
              value={stats.socialMentions / 100000}
              max={60}
              color="bg-purple-500"
              showValue={false}
            />
          </div>

          {/* Influence Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Influence Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-700">Goals Score</span>
                <span className="font-bold text-red-600">{Math.round(influenceScore.breakdown.goalsScore)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-700">Assists Score</span>
                <span className="font-bold text-green-600">
                  {Math.round(influenceScore.breakdown.assistsScore)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-700">Appearances Score</span>
                <span className="font-bold text-blue-600">
                  {Math.round(influenceScore.breakdown.appearancesScore)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-700">Social Score</span>
                <span className="font-bold text-purple-600">{Math.round(influenceScore.breakdown.socialScore)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300 bg-gray-50 p-2 rounded">
                <span className="text-lg font-bold">Total Influence</span>
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round(influenceScore.influence)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => onCompare?.(playerId)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Compare with Others
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
          >
            Search More Players
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;
