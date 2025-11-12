import { PlayerStats, InfluenceScore, InfluenceWeights, PlayerProfile } from '../types';

/**
 * Default influence weights
 * Can be adjusted per league or position
 */
const DEFAULT_WEIGHTS: InfluenceWeights = {
  goals: 3,
  assists: 2,
  appearances: 1,
  socialMentions: 0.5,
};

class InfluenceScoringService {
  /**
   * Compute raw influence score
   */
  computeRawInfluence(stats: PlayerStats, weights?: InfluenceWeights): number {
    const w = weights || DEFAULT_WEIGHTS;

    return (
      stats.goals * w.goals +
      stats.assists * w.assists +
      stats.appearances * w.appearances +
      stats.socialMentions * w.socialMentions
    );
  }

  /**
   * Compute influence score with detailed breakdown
   */
  computeInfluence(
    playerId: string,
    playerName: string,
    stats: PlayerStats,
    weights?: InfluenceWeights,
    maxInfluence?: number
  ): InfluenceScore {
    const w = weights || DEFAULT_WEIGHTS;

    const breakdown = {
      goalsScore: stats.goals * w.goals,
      assistsScore: stats.assists * w.assists,
      appearancesScore: stats.appearances * w.appearances,
      socialScore: stats.socialMentions * w.socialMentions,
    };

    const influence = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

    // Normalize to 0-100 scale
    let normalizedInfluence = 0;
    if (maxInfluence && maxInfluence > 0) {
      normalizedInfluence = (influence / maxInfluence) * 100;
    } else {
      // Fallback normalization using a reference scale
      normalizedInfluence = this.normalizeScore(influence);
    }

    return {
      playerId,
      playerName,
      influence,
      normalizedInfluence: Math.min(100, Math.max(0, normalizedInfluence)), // Clamp to 0-100
      breakdown,
    };
  }

  /**
   * Normalize scores to 0-100 scale using logarithmic function
   * This handles the large variation in raw scores
   */
  private normalizeScore(score: number): number {
    // Using log scale to compress large values
    // Reference: Messi's influence is around 4000+
    const logScore = Math.log10(Math.max(1, score));
    const logMax = Math.log10(4500); // Expected max
    return (logScore / logMax) * 100;
  }

  /**
   * Rank players by influence score
   */
  rankPlayers(influenceScores: InfluenceScore[]): InfluenceScore[] {
    return influenceScores
      .sort((a, b) => b.normalizedInfluence - a.normalizedInfluence)
      .map((score, index) => ({
        ...score,
        rank: index + 1,
      }));
  }

  /**
   * Get influence weights for specific league
   */
  getWeightsByLeague(league: string): InfluenceWeights {
    // Different weights for different leagues
    const leagueWeights: Record<string, InfluenceWeights> = {
      Premier_League: { goals: 3.5, assists: 2.2, appearances: 1, socialMentions: 0.4 },
      La_Liga: { goals: 3, assists: 2, appearances: 1, socialMentions: 0.6 },
      Serie_A: { goals: 2.8, assists: 1.8, appearances: 1.2, socialMentions: 0.3 },
      Bundesliga: { goals: 3.2, assists: 2, appearances: 0.9, socialMentions: 0.5 },
      Ligue_1: { goals: 3, assists: 2.1, appearances: 1, socialMentions: 0.7 },
    };

    return leagueWeights[league] || DEFAULT_WEIGHTS;
  }

  /**
   * Get influence weights for specific position
   */
  getWeightsByPosition(position: string): InfluenceWeights {
    // Different weights for different positions
    const positionWeights: Record<string, InfluenceWeights> = {
      Forward: { goals: 4, assists: 2.5, appearances: 1, socialMentions: 0.6 },
      Midfielder: { goals: 2.5, assists: 3, appearances: 1.2, socialMentions: 0.5 },
      Defender: { goals: 1.5, assists: 1.5, appearances: 2, socialMentions: 0.3 },
      Goalkeeper: { goals: 0, assists: 0, appearances: 3, socialMentions: 0.2 },
    };

    return positionWeights[position] || DEFAULT_WEIGHTS;
  }

  /**
   * Get combined weights for position and league
   */
  getCombinedWeights(position: string, league?: string): InfluenceWeights {
    const posWeights = this.getWeightsByPosition(position);
    const leagueWeights = league ? this.getWeightsByLeague(league) : DEFAULT_WEIGHTS;

    // Average the weights
    return {
      goals: (posWeights.goals + leagueWeights.goals) / 2,
      assists: (posWeights.assists + leagueWeights.assists) / 2,
      appearances: (posWeights.appearances + leagueWeights.appearances) / 2,
      socialMentions: (posWeights.socialMentions + leagueWeights.socialMentions) / 2,
    };
  }

  /**
   * Compute comparison metrics between players
   */
  getComparisonMetrics(scores: InfluenceScore[]) {
    if (scores.length === 0) {
      return null;
    }

    const maxInfluence = Math.max(...scores.map((s) => s.normalizedInfluence));
    const minInfluence = Math.min(...scores.map((s) => s.normalizedInfluence));
    const avgInfluence = scores.reduce((sum, s) => sum + s.normalizedInfluence, 0) / scores.length;

    const bestBreakdown = {
      byGoals: scores.sort((a, b) => b.breakdown.goalsScore - a.breakdown.goalsScore)[0],
      byAssists: scores.sort((a, b) => b.breakdown.assistsScore - a.breakdown.assistsScore)[0],
      byAppearances: scores.sort((a, b) => b.breakdown.appearancesScore - a.breakdown.appearancesScore)[0],
      bySocial: scores.sort((a, b) => b.breakdown.socialScore - a.breakdown.socialScore)[0],
    };

    return {
      maxInfluence,
      minInfluence,
      avgInfluence,
      bestBreakdown,
    };
  }
}

export const influenceScoringService = new InfluenceScoringService();
