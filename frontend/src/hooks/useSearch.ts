import { useReducer, useCallback, useRef, useEffect } from 'react';
import { PlayerProfile, SearchResponse, ApiError } from '../types';
import { playerApi } from '../api/client';

export interface SearchState {
  query: string;
  results: PlayerProfile[];
  suggestions: PlayerProfile[];
  loading: boolean;
  error: ApiError | null;
  searched: boolean;
}

type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SEARCH_LOADING' }
  | { type: 'SEARCH_SUCCESS'; payload: SearchResponse }
  | { type: 'SEARCH_ERROR'; payload: ApiError }
  | { type: 'SET_SUGGESTIONS'; payload: PlayerProfile[] }
  | { type: 'CLEAR' };

const initialState: SearchState = {
  query: '',
  results: [],
  suggestions: [],
  loading: false,
  error: null,
  searched: false,
};

const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SEARCH_LOADING':
      return { ...state, loading: true, error: null };
    case 'SEARCH_SUCCESS':
      return {
        ...state,
        loading: false,
        results: action.payload.results,
        suggestions: action.payload.results.slice(0, 5),
        searched: true,
      };
    case 'SEARCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
};

export const useSearch = () => {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      dispatch({ type: 'CLEAR' });
      return;
    }

    dispatch({ type: 'SET_QUERY', payload: query });
    dispatch({ type: 'SEARCH_LOADING' });

    try {
      const response = await playerApi.searchPlayers(query);
      dispatch({
        type: 'SEARCH_SUCCESS',
        payload: response,
      });
    } catch (error) {
      dispatch({
        type: 'SEARCH_ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Search failed',
          code: 'SEARCH_ERROR',
        },
      });
    }
  }, []);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      search(query);
    }, 300);
  }, [search]);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    ...state,
    search,
    debouncedSearch,
    clear,
  };
};
