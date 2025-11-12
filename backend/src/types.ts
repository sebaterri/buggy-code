/**
 * Core TypeScript types for Soccer Klout API
 */

export interface PlayerStats {
  goals: number;
  assists: number;
  appearances: number;
  socialMentions: number;
}

export interface InfluenceWeights {
  goals: number;
  assists: number;
  appearances: number;
  socialMentions: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  club: string;
  position: string;
  nationality: string;
  age: number;
  photo?: string;
  shirtNumber?: number;
}

export interface PlayerWithStats {
  profile: PlayerProfile;
  stats: PlayerStats;
}

export interface InfluenceScore {
  playerId: string;
  playerName: string;
  influence: number;
  normalizedInfluence: number; // 0-100 scale
  breakdown: {
    goalsScore: number;
    assistsScore: number;
    appearancesScore: number;
    socialScore: number;
  };
  rank?: number;
}

export interface LeaderboardEntry {
  rank: number;
  player: PlayerProfile;
  influence: InfluenceScore;
}

export interface PlayerComparison {
  players: (PlayerWithStats & { influenceScore: InfluenceScore })[];
  maxInfluence: number;
}

export interface FootballDataPlayer {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
  shirtNumber: number | null;
  lastUpdated: string;
}

export interface FootballDataTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  founded: number;
  clubColors: string;
  venue: string;
  lastUpdated: string;
}

export interface FootballDataPlayerStats {
  player: FootballDataPlayer;
  team: FootballDataTeam;
  statistics: {
    appearances: number;
    lineups: number;
    minutes: number;
    goals: number;
    assists: number | null;
    offsides: number | null;
    redCards: number;
    yellowCards: number;
    tackling: {
      total: number | null;
      tackles: number | null;
      blocks: number | null;
    };
    duels: {
      total: number | null;
      won: number | null;
    };
    defensive: {
      interceptions: number | null;
      clearances: number | null;
      ownGoals: number | null;
    };
    passing: {
      total: number | null;
      accuracy: number | null;
    };
    shots: {
      total: number | null;
      on: number | null;
    };
    dribbles: {
      attempts: number | null;
      success: number | null;
    };
  };
}

export interface SearchResponse {
  results: (PlayerProfile & { matchScore: number })[];
  totalCount: number;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
