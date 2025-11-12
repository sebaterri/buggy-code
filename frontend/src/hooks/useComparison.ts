import { useReducer, useCallback } from 'react';
import { PlayerComparison, ApiError } from '../types';
import { playerApi } from '../api/client';

export interface ComparisonState {
  data: PlayerComparison | null;
  selectedIds: string[];
  loading: boolean;
  error: ApiError | null;
}

type ComparisonAction =
  | { type: 'TOGGLE_PLAYER'; payload: string }
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: PlayerComparison }
  | { type: 'ERROR'; payload: ApiError }
  | { type: 'CLEAR' };

const initialState: ComparisonState = {
  data: null,
  selectedIds: [],
  loading: false,
  error: null,
};

const comparisonReducer = (state: ComparisonState, action: ComparisonAction): ComparisonState => {
  switch (action.type) {
    case 'TOGGLE_PLAYER': {
      const ids = state.selectedIds.includes(action.payload)
        ? state.selectedIds.filter((id) => id !== action.payload)
        : [...state.selectedIds, action.payload];

      return { ...state, selectedIds: ids };
    }
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
};

export const useComparison = () => {
  const [state, dispatch] = useReducer(comparisonReducer, initialState);

  const togglePlayer = useCallback((playerId: string) => {
    dispatch({ type: 'TOGGLE_PLAYER', payload: playerId });
  }, []);

  const compare = useCallback(async (playerIds?: string[]) => {
    const ids = playerIds || state.selectedIds;

    if (ids.length < 2 || ids.length > 5) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'Please select 2-5 players to compare',
          code: 'INVALID_SELECTION',
        },
      });
      return;
    }

    dispatch({ type: 'LOADING' });
    try {
      const data = await playerApi.comparePlayers(ids);
      dispatch({ type: 'SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Failed to compare players',
          code: 'COMPARE_ERROR',
        },
      });
    }
  }, [state.selectedIds]);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return {
    ...state,
    togglePlayer,
    compare,
    clear,
  };
};
