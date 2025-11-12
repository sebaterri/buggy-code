import React, { useMemo } from 'react';
import { Player } from '../types';
import './StatsDashboard.css';

interface StatsDashboardProps {
  players: Player[];
  selectedPlayers: Player[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ players, selectedPlayers }) => {
  const stats = useMemo(() => {
    if (players.length === 0) {
      return {
        totalPlayers: 0,
        avgFantasyScore: 0,
        topFantasyScore: 0,
        totalGoals: 0,
        selectedCount: 0,
        selectedScore: 0,
      };
    }

    const avgFantasyScore =
      players.reduce((sum, p) => sum + (p.fantasyScore || 0), 0) / players.length;
    const topFantasyScore = Math.max(...players.map((p) => p.fantasyScore || 0));
    const totalGoals = players.reduce((sum, p) => sum + p.stats.goals, 0);
    const selectedScore = selectedPlayers.reduce((sum, p) => sum + (p.fantasyScore || 0), 0);

    return {
      totalPlayers: players.length,
      avgFantasyScore,
      topFantasyScore,
      totalGoals,
      selectedCount: selectedPlayers.length,
      selectedScore,
    };
  }, [players, selectedPlayers]);

  return (
    <div className="stats-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-label">Total Players</span>
            <span className="stat-display">{stats.totalPlayers}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <span className="stat-label">Avg Fantasy Score</span>
            <span className="stat-display">{stats.avgFantasyScore.toFixed(1)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <span className="stat-label">Top Fantasy Score</span>
            <span className="stat-display">{stats.topFantasyScore.toFixed(1)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚽</div>
          <div className="stat-content">
            <span className="stat-label">Total Goals</span>
            <span className="stat-display">{stats.totalGoals}</span>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">👜</div>
          <div className="stat-content">
            <span className="stat-label">Team Players</span>
            <span className="stat-display">{stats.selectedCount}/11</span>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">💎</div>
          <div className="stat-content">
            <span className="stat-label">Team Score</span>
            <span className="stat-display">{stats.selectedScore.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
