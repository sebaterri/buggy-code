import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { Player } from '../types';
import SearchBar from '../components/SearchBar';
import './PlayerComparison.css';

const PlayerComparison: React.FC = () => {
  const { getPlayers } = useApi();
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const loadPlayers = async () => {
      const players = await getPlayers();
      setAllPlayers(players);
      setFilteredPlayers(players.slice(0, 10));
    };
    loadPlayers();
  }, [getPlayers]);

  useEffect(() => {
    let filtered = allPlayers;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.club.toLowerCase().includes(term)
      );
    }
    setFilteredPlayers(filtered);
  }, [searchTerm, allPlayers]);

  const handleSelectPlayer = (player: Player) => {
    if (selectedPlayers.find((p) => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleRemovePlayer = (id: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== id));
  };

  return (
    <div className="player-comparison">
      <div className="comparison-header">
        <h1 className="page-title">Player Comparison</h1>
        <p className="page-subtitle">Compare up to 4 players side by side</p>
      </div>

      <div className="comparison-container">
        {/* Player Selection */}
        <div className="selection-panel">
          <h2>Select Players</h2>
          <SearchBar onSearch={setSearchTerm} placeholder="Search players..." />

          <div className="players-list">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                onClick={() => handleSelectPlayer(player)}
                className={`player-item ${selectedPlayers.find((p) => p.id === player.id) ? 'selected' : ''}`}
              >
                <img
                  src={player.photo}
                  alt={player.name}
                  className="player-thumb"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/40?text=P';
                  }}
                />
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  <span className="player-club">{player.club}</span>
                </div>
                <span className={`badge badge-${player.position.toLowerCase()}`}>
                  {player.position}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison View */}
        <div className="comparison-panel">
          {selectedPlayers.length === 0 ? (
            <div className="empty-comparison">
              <p>Select players to compare →</p>
            </div>
          ) : (
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Stat</th>
                    {selectedPlayers.map((player) => (
                      <th key={player.id}>
                        <div className="table-header">
                          <img
                            src={player.photo}
                            alt={player.name}
                            className="header-photo"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/60?text=P';
                            }}
                          />
                          <div>
                            <p className="header-name">{player.name}</p>
                            <p className="header-club">{player.club}</p>
                          </div>
                          <button
                            onClick={() => handleRemovePlayer(player.id)}
                            className="remove-btn"
                          >
                            ✕
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="stat-name">Fantasy Score</td>
                    {selectedPlayers.map((player) => (
                      <td key={player.id} className="highlight">
                        <span className="score-badge">
                          {(player.fantasyScore || 0).toFixed(1)}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="stat-name">Goals</td>
                    {selectedPlayers.map((player) => (
                      <td key={player.id}>
                        <div className="bar-chart">
                          <div
                            className="bar"
                            style={{
                              width: `${(player.stats.goals / Math.max(...selectedPlayers.map((p) => p.stats.goals))) * 100}%`,
                            }}
                          />
                          <span>{player.stats.goals}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="stat-name">Assists</td>
                    {selectedPlayers.map((player) => (
                      <td key={player.id}>
                        <div className="bar-chart">
                          <div
                            className="bar"
                            style={{
                              width: `${(player.stats.assists / Math.max(...selectedPlayers.map((p) => p.stats.assists), 1)) * 100}%`,
                            }}
                          />
                          <span>{player.stats.assists}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="stat-name">Clean Sheets</td>
                    {selectedPlayers.map((player) => (
                      <td key={player.id}>
                        <div className="bar-chart">
                          <div
                            className="bar"
                            style={{
                              width: `${(player.stats.cleanSheets / Math.max(...selectedPlayers.map((p) => p.stats.cleanSheets), 1)) * 100}%`,
                            }}
                          />
                          <span>{player.stats.cleanSheets}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="stat-name">Appearances</td>
                    {selectedPlayers.map((player) => (
                      <td key={player.id}>
                        <div className="bar-chart">
                          <div
                            className="bar"
                            style={{
                              width: `${(player.stats.appearances / Math.max(...selectedPlayers.map((p) => p.stats.appearances))) * 100}%`,
                            }}
                          />
                          <span>{player.stats.appearances}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="stat-name">Yellow Cards</td>
                    {selectedPlayers.map((player) => (
                      <td key={player.id} className="warning">
                        <span>{player.stats.yellowCards}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="stat-name">Red Cards</td>
                    {selectedPlayers.map((player) => (
                      <td key={player.id} className="danger">
                        <span>{player.stats.redCards}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="stat-name">Avg Rating</td>
                    {selectedPlayers.map((player) => (
                      <td key={player.id}>
                        <span className="rating">
                          ⭐ {player.stats.avgRating?.toFixed(1) || 'N/A'}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerComparison;
