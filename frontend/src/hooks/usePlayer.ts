import { useReducer, useCallback } from 'react';
import { PlayerWithStats, InfluenceScore, ApiError } from '../types';
import { playerApi } from '../api/client';

export interface PlayerState {
  data: (PlayerWithStats & { influenceScore: InfluenceScore }) | null;
  loading: boolean;
  error: ApiError | null;
}

type PlayerAction =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: PlayerWithStats & { influenceScore: InfluenceScore } }
  | { type: 'ERROR'; payload: ApiError }
  | { type: 'RESET' };

const initialState: PlayerState = {
  data: null,
  loading: false,
  error: null,
};

const playerReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const usePlayer = () => {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  const fetchPlayer = useCallback(async (playerId: string, position?: string, league?: string) => {
    dispatch({ type: 'LOADING' });
    try {
      const [profileData, influenceData] = await Promise.all([
        playerApi.getPlayerStats(playerId),
        playerApi.getPlayerInfluence(playerId, position, league),
      ]);

      dispatch({
        type: 'SUCCESS',
        payload: {
          ...profileData,
          influenceScore: influenceData,
        },
      });
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Failed to fetch player',
          code: 'FETCH_ERROR',
        },
      });
    }
  }, []);

  return { ...state, fetchPlayer };
};
