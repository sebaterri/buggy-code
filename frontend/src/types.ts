/**
 * Frontend TypeScript types (mirrors backend types)
 */

export interface PlayerProfile {
  id: string;
  name: string;
  club: string;
  position: string;
  nationality: string;
  age: number;
  photo?: string;
  shirtNumber?: number;
  matchScore?: number;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  appearances: number;
  socialMentions: number;
}

export interface InfluenceBreakdown {
  goalsScore: number;
  assistsScore: number;
  appearancesScore: number;
  socialScore: number;
}

export interface InfluenceScore {
  playerId: string;
  playerName: string;
  influence: number;
  normalizedInfluence: number;
  breakdown: InfluenceBreakdown;
  rank?: number;
}

export interface PlayerWithStats {
  profile: PlayerProfile;
  stats: PlayerStats;
}

export interface PlayerWithInfluence extends PlayerWithStats {
  influenceScore: InfluenceScore;
}

export interface SearchResponse {
  results: PlayerProfile[];
  totalCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  player: PlayerProfile;
  influence: InfluenceScore;
}

export interface PlayerComparison {
  players: PlayerWithInfluence[];
  maxInfluence: number;
}

export interface ApiError {
  error: string;
  code: string;
}
