import axios from 'axios';
import {
  SearchResponse,
  PlayerWithStats,
  InfluenceScore,
  LeaderboardEntry,
  PlayerComparison,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const playerApi = {
  /**
   * Search for players by name
   */
  async searchPlayers(name: string): Promise<SearchResponse> {
    const response = await client.get('/players', {
      params: { name },
    });
    return response.data;
  },

  /**
   * Get player stats
   */
  async getPlayerStats(playerId: string): Promise<PlayerWithStats> {
    const response = await client.get(`/players/${playerId}/stats`);
    return response.data;
  },

  /**
   * Get player influence score
   */
  async getPlayerInfluence(
    playerId: string,
    position?: string,
    league?: string
  ): Promise<InfluenceScore> {
    const response = await client.get(`/players/${playerId}/klout`, {
      params: { position, league },
    });
    return response.data;
  },

  /**
   * Get top players leaderboard
   */
  async getLeaderboard(
    limit: number = 10,
    league?: string,
    position?: string
  ): Promise<LeaderboardEntry[]> {
    const response = await client.get('/players/leaderboard/top', {
      params: { limit, league, position },
    });
    return response.data;
  },

  /**
   * Compare multiple players
   */
  async comparePlayers(playerIds: string[]): Promise<PlayerComparison> {
    const response = await client.post('/players/compare', {
      playerIds,
    });
    return response.data;
  },
};

export default client;
