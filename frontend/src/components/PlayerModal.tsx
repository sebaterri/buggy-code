import React from 'react';
import { Player } from '../types';
import './PlayerModal.css';

interface PlayerModalProps {
  player: Player;
  onClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ player, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <img
            src={player.photo}
            alt={player.name}
            className="modal-photo"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300?text=Player';
            }}
          />
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{player.name}</h2>
          <p className="modal-club">{player.club}</p>

          <div className="position-info">
            <span className={`badge badge-${player.position.toLowerCase()}`}>
              {player.position}
            </span>
            {player.market_value && (
              <span className="market-value">
                💰 ${(player.market_value / 1000000).toFixed(1)}M
              </span>
            )}
          </div>

          <div className="fantasy-section">
            <h3>Fantasy Score</h3>
            <div className="fantasy-value">{(player.fantasyScore || 0).toFixed(1)}</div>
          </div>

          <div className="stats-section">
            <h3>Statistics</h3>
            <div className="stats-list">
              <div className="stats-row">
                <span className="stats-label">Goals</span>
                <span className="stats-value">{player.stats.goals}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Assists</span>
                <span className="stats-value">{player.stats.assists}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Clean Sheets</span>
                <span className="stats-value">{player.stats.cleanSheets}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Appearances</span>
                <span className="stats-value">{player.stats.appearances}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Yellow Cards</span>
                <span className="stats-value warning">{player.stats.yellowCards}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Red Cards</span>
                <span className="stats-value danger">{player.stats.redCards}</span>
              </div>
              {player.stats.avgRating && (
                <div className="stats-row">
                  <span className="stats-label">Avg Rating</span>
                  <span className="stats-value">{player.stats.avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
