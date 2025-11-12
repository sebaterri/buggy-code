import express, { Request, Response, NextFunction } from 'express';
import { footballDataService } from '../services/footballDataApi';
import { influenceScoringService } from '../services/influenceScoring';
import { InfluenceScore, SearchResponse, PlayerComparison, LeaderboardEntry } from '../types';

const router = express.Router();

/**
 * GET /api/players?name=NAME
 * Search for players by name
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Player name is required',
        code: 'INVALID_REQUEST',
      });
    }

    const result = await footballDataService.searchPlayers(name.trim());
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/players/:id/stats
 * Get detailed player stats
 */
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        error: 'Player ID is required and must be a number',
        code: 'INVALID_REQUEST',
      });
    }
      });
    }

    if (!id) {
      return res.status(400).json({
        error: 'Player ID is required',
        code: 'INVALID_REQUEST',
      });
    }

    const playerData = await footballDataService.getPlayerStats(id);
    res.json(playerData);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/players/:id/klout
 * Get influence score for a player
 */
router.get('/:id/klout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { position, league } = req.query;

    if (!id) {
      return res.status(400).json({
        error: 'Player ID is required',
        code: 'INVALID_REQUEST',
      });
    }

    const { profile, stats } = await footballDataService.getPlayerStats(id);

    // Get weights (use query params if provided)
    let weights = undefined;
    if (position && league) {
      weights = influenceScoringService.getCombinedWeights(
        position as string,
        league as string
      );
    } else if (position) {
      weights = influenceScoringService.getWeightsByPosition(position as string);
    }

    // Compute raw influence and normalize against top players
    const topPlayers = await footballDataService.getTopPlayers(10);
    const topInfluences = topPlayers.map((p) =>
      influenceScoringService.computeRawInfluence(p.stats, weights)
    );
    const maxInfluence = Math.max(...topInfluences);

    const influenceScore = influenceScoringService.computeInfluence(
      id,
      profile.name,
      stats,
      weights,
      maxInfluence
    );

    res.json(influenceScore);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/players/leaderboard?limit=10&league=Premier_League&position=Forward
 * Get top players by influence
 */
router.get('/leaderboard/top', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 10, league, position } = req.query;
    const limitNum = Math.min(parseInt(limit as string) || 10, 100);

    const topPlayers = await footballDataService.getTopPlayers(limitNum);

    // Compute influence scores
    let influenceScores: InfluenceScore[] = topPlayers.map((p) => {
      let weights = undefined;
      if (position && league) {
        weights = influenceScoringService.getCombinedWeights(
          position as string,
          league as string
        );
      } else if (position) {
        weights = influenceScoringService.getWeightsByPosition(position as string);
      }

      return influenceScoringService.computeRawInfluence(p.stats, weights);
    });

    // Find max for normalization
    const maxInfluence = Math.max(...influenceScores.map((raw) => raw));

    // Convert raw scores to InfluenceScore objects
    const leaderboard: LeaderboardEntry[] = topPlayers.map((p, idx) => {
      let weights = undefined;
      if (position && league) {
        weights = influenceScoringService.getCombinedWeights(
          position as string,
          league as string
        );
      } else if (position) {
        weights = influenceScoringService.getWeightsByPosition(position as string);
      }

      return {
        rank: idx + 1,
        player: {
          id: p.id,
          name: p.name,
          club: p.club,
          position: p.position,
          nationality: p.nationality,
          age: p.age,
          photo: p.photo,
          shirtNumber: p.shirtNumber,
        },
        influence: influenceScoringService.computeInfluence(
          p.id,
          p.name,
          p.stats,
          weights,
          maxInfluence
        ),
      };
    });

    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/players/compare
 * Compare multiple players side-by-side
 */
router.post('/compare', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { playerIds } = req.body;

    if (!Array.isArray(playerIds) || playerIds.length < 2 || playerIds.length > 5) {
      return res.status(400).json({
        error: 'Please provide 2-5 player IDs for comparison',
        code: 'INVALID_REQUEST',
      });
    }

    // Fetch all players
    const playerPromises = playerIds.map((id: string) =>
      footballDataService.getPlayerStats(id)
    );
    const playersData = await Promise.all(playerPromises);

    // Compute influence scores
    const influenceScores = playersData.map((p) =>
      influenceScoringService.computeInfluence(
        p.profile.id,
        p.profile.name,
        p.stats
      )
    );

    // Find max for normalization
    const allRawInfluences = influenceScores.map((s) => s.influence);
    const maxInfluence = Math.max(...allRawInfluences);

    // Recompute with proper normalization
    const normalizedScores = playersData.map((p) =>
      influenceScoringService.computeInfluence(
        p.profile.id,
        p.profile.name,
        p.stats,
        undefined,
        maxInfluence
      )
    );

    const comparison: PlayerComparison = {
      players: playersData.map((p, idx) => ({
        ...p,
        influenceScore: normalizedScores[idx],
      })),
      maxInfluence: maxInfluence,
    };

    res.json(comparison);
  } catch (error) {
    next(error);
  }
});

export default router;
