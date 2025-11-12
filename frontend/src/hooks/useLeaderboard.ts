import { useReducer, useCallback } from 'react';
import { LeaderboardEntry, ApiError } from '../types';
import { playerApi } from '../api/client';

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: ApiError | null;
  limit: number;
  league?: string;
  position?: string;
}

type LeaderboardAction =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: LeaderboardEntry[] }
  | { type: 'ERROR'; payload: ApiError }
  | { type: 'SET_FILTERS'; payload: { limit?: number; league?: string; position?: string } };

const initialState: LeaderboardState = {
  entries: [],
  loading: false,
  error: null,
  limit: 10,
};

const leaderboardReducer = (state: LeaderboardState, action: LeaderboardAction): LeaderboardState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, entries: action.payload };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_FILTERS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const useLeaderboard = () => {
  const [state, dispatch] = useReducer(leaderboardReducer, initialState);

  const fetchLeaderboard = useCallback(
    async (limit?: number, league?: string, position?: string) => {
      dispatch({ type: 'LOADING' });
      try {
        const data = await playerApi.getLeaderboard(limit || state.limit, league, position);
        dispatch({ type: 'SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'ERROR',
          payload: {
            error: error instanceof Error ? error.message : 'Failed to fetch leaderboard',
            code: 'FETCH_ERROR',
          },
        });
      }
    },
    [state.limit]
  );

  return {
    ...state,
    fetchLeaderboard,
  };
};
