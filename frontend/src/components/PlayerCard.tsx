import React from 'react';
import { PlayerProfile } from '../types';
import { Award, Globe, Users } from 'lucide-react';

interface PlayerCardProps {
  player: PlayerProfile;
  onClick?: () => void;
  selected?: boolean;
  showStats?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onClick,
  selected = false,
  showStats = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Player Photo */}
      <div className="mb-3 flex justify-center">
        {player.photo ? (
          <img src={player.photo} alt={player.name} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      {/* Player Info */}
      <h3 className="font-bold text-lg text-center mb-1">{player.name}</h3>

      <div className="text-center text-sm text-gray-600 space-y-1">
        <p className="flex items-center justify-center gap-2">
          <Globe className="w-4 h-4" />
          {player.nationality}
        </p>
        <p className="font-semibold text-blue-600">{player.club}</p>
        <p className="text-gray-500">
          {player.position}
          {player.shirtNumber && ` #${player.shirtNumber}`}
        </p>
        <p className="text-gray-500">Age: {player.age}</p>
      </div>

      {/* Match Score (for search results) */}
      {player.matchScore !== undefined && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Match Score</span>
            <div className="w-full ml-2 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${player.matchScore}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {selected && (
        <div className="mt-2 flex justify-center">
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
            ✓ Selected
          </span>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
