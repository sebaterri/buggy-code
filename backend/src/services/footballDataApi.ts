import axios, { AxiosError } from 'axios';
import { cacheService } from './cache';
import {
  PlayerProfile,
  FootballDataPlayer,
  FootballDataPlayerStats,
  FootballDataTeam,
  PlayerStats,
  ApiError,
  SearchResponse,
} from '../types';

const FOOTBALL_DATA_API = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_DATA_API_KEY || 'demo'; // Demo key has rate limits
const CACHE_TTL = {
  PLAYER_DATA: 600, // 10 minutes
  SEARCH: 3600, // 1 hour
  STATS: 1800, // 30 minutes
};

/**
 * Mock data for demo purposes when API key is 'demo'
 */
const MOCK_PLAYERS: Record<string, PlayerProfile & { stats: PlayerStats }> = {
  messi: {
    id: '1',
    name: 'Lionel Messi',
    club: 'Inter Miami CF',
    position: 'Forward',
    nationality: 'Argentina',
    age: 37,
    photo: 'https://crests.football-data.org/1.svg',
    shirtNumber: 10,
    stats: {
      goals: 807,
      assists: 318,
      appearances: 1000,
      socialMentions: 5000000,
    },
  },
  ronaldo: {
    id: '2',
    name: 'Cristiano Ronaldo',
    club: 'Al-Nassr',
    position: 'Forward',
    nationality: 'Portugal',
    age: 39,
    photo: 'https://crests.football-data.org/2.svg',
    shirtNumber: 7,
    stats: {
      goals: 890,
      assists: 270,
      appearances: 1150,
      socialMentions: 6000000,
    },
  },
  haaland: {
    id: '3',
    name: 'Erling Haaland',
    club: 'Manchester City',
    position: 'Forward',
    nationality: 'Norway',
    age: 24,
    photo: 'https://crests.football-data.org/3.svg',
    shirtNumber: 9,
    stats: {
      goals: 186,
      assists: 45,
      appearances: 278,
      socialMentions: 2500000,
    },
  },
  mbappé: {
    id: '4',
    name: 'Kylian Mbappé',
    club: 'Paris Saint-Germain',
    position: 'Forward',
    nationality: 'France',
    age: 25,
    photo: 'https://crests.football-data.org/4.svg',
    shirtNumber: 7,
    stats: {
      goals: 312,
      assists: 95,
      appearances: 456,
      socialMentions: 3500000,
    },
  },
  neymar: {
    id: '5',
    name: 'Neymar Jr',
    club: 'Al-Hilal',
    position: 'Forward',
    nationality: 'Brazil',
    age: 32,
    photo: 'https://crests.football-data.org/5.svg',
    shirtNumber: 11,
    stats: {
      goals: 140,
      assists: 102,
      appearances: 312,
      socialMentions: 4000000,
    },
  },
};

class FootballDataService {
  /**
   * Search for players by name
   */
  async searchPlayers(name: string): Promise<SearchResponse> {
    const cacheKey = `search:${name.toLowerCase()}`;

    // Check cache first
    const cached = cacheService.get<SearchResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Use mock data for demo
      if (API_KEY === 'demo') {
        return this.searchMockPlayers(name);
      }

      // Real API implementation would go here
      // For now, we'll use mock data
      const response = this.searchMockPlayers(name);
      cacheService.set(cacheKey, response, CACHE_TTL.SEARCH);
      return response;
    } catch (error) {
      console.error('Player search failed:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get detailed player stats
   */
  async getPlayerStats(playerId: string): Promise<{ profile: PlayerProfile; stats: PlayerStats }> {
    const cacheKey = `player:${playerId}`;

    // Check cache
    const cached = cacheService.get<{ profile: PlayerProfile; stats: PlayerStats }>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Mock implementation
      const mockPlayer = Object.values(MOCK_PLAYERS).find((p) => p.id === playerId);
      if (mockPlayer) {
        const result = {
          profile: {
            id: mockPlayer.id,
            name: mockPlayer.name,
            club: mockPlayer.club,
            position: mockPlayer.position,
            nationality: mockPlayer.nationality,
            age: mockPlayer.age,
            photo: mockPlayer.photo,
            shirtNumber: mockPlayer.shirtNumber,
          },
          stats: mockPlayer.stats,
        };
        cacheService.set(cacheKey, result, CACHE_TTL.PLAYER_DATA);
        return result;
      }

      throw {
        code: 'PLAYER_NOT_FOUND',
        message: `Player with ID ${playerId} not found`,
        statusCode: 404,
      } as ApiError;
    } catch (error) {
      console.error('Failed to fetch player stats:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get top players by stats
   */
  async getTopPlayers(limit: number = 10): Promise<(PlayerProfile & { stats: PlayerStats })[]> {
    const cacheKey = `top-players:${limit}`;

    const cached = cacheService.get<(PlayerProfile & { stats: PlayerStats })[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const players = Object.values(MOCK_PLAYERS).slice(0, limit);
      cacheService.set(cacheKey, players, CACHE_TTL.SEARCH);
      return players;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Private helper: Search in mock data
   */
  private searchMockPlayers(name: string): SearchResponse {
    const query = name.toLowerCase();
    const results = Object.values(MOCK_PLAYERS)
      .filter((p) => p.name.toLowerCase().includes(query))
      .map((p) => ({
        id: p.id,
        name: p.name,
        club: p.club,
        position: p.position,
        nationality: p.nationality,
        age: p.age,
        photo: p.photo,
        shirtNumber: p.shirtNumber,
        matchScore: this.calculateMatchScore(p.name, query),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    return {
      results,
      totalCount: results.length,
    };
  }

  /**
   * Calculate string match score (simple fuzzy matching)
   */
  private calculateMatchScore(playerName: string, query: string): number {
    const name = playerName.toLowerCase();
    const nameParts = name.split(' ');

    // Exact match
    if (name === query) return 100;

    // Starts with query
    if (name.startsWith(query)) return 90;

    // Any part starts with query
    if (nameParts.some((part) => part.startsWith(query))) return 80;

    // Contains query
    if (name.includes(query)) return 70;

    return 50;
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      return {
        code: 'API_ERROR',
        message: axiosError.response?.data?.message || axiosError.message || 'API request failed',
        statusCode: axiosError.response?.status || 500,
      };
    }

    if (error && typeof error === 'object' && 'code' in error) {
      return error as ApiError;
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      statusCode: 500,
    };
  }
}

export const footballDataService = new FootballDataService();
