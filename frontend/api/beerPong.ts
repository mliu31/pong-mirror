// frontend/api/beerPong.ts
import axios from 'axios';

// Create a separate API instance for beer pong backend
const beerPongApi = axios.create({
  baseURL: 'http://localhost:8000', // Your beer pong backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface BeerPongAction {
  type: 'serve' | 'rally' | 'hit' | 'sink';
  player: string; // A, B, C, D
  timestamp: number;
}

export interface BeerPongGameState {
  red_full: number;
  red_half: number;
  red_empty: number;
  blue_full: number;
  blue_half: number;
  blue_empty: number;
}

export interface Commentary {
  commentary: string;
  commentator: string;
  timestamp: number;
}

export interface BeerPongGame {
  id: string;
  created_at: string;
  actions: BeerPongAction[];
  commentaries: Commentary[];
  current_state: BeerPongGameState;
}

export interface CommentaryResponse {
  commentary: string | null;
  commentator: string | null;
  timestamp: number;
}

// Create a new beer pong game
export const createBeerPongGame = async (): Promise<BeerPongGame> => {
  const response = await beerPongApi.post('/api/games');
  return response.data;
};

// Add an action to the game
export const addBeerPongAction = async (
  gameId: string,
  action: BeerPongAction
): Promise<BeerPongAction> => {
  const response = await beerPongApi.post(
    `/api/games/${gameId}/actions`,
    action
  );
  return response.data;
};

// Get current game state
export const getBeerPongGameState = async (
  gameId: string
): Promise<BeerPongGame> => {
  const response = await beerPongApi.get(`/api/games/${gameId}`);
  return response.data;
};

// Get latest commentary
export const getLatestCommentary = async (
  gameId: string
): Promise<CommentaryResponse> => {
  const response = await beerPongApi.get(
    `/api/games/${gameId}/latest-commentary`
  );
  return response.data;
};

// Load test game data
export const loadTestGame = async (gameId: string, gameType: string) => {
  const response = await beerPongApi.post(
    `/api/games/${gameId}/load-log?file_path=test_game_logs/${gameType}`
  );
  return response.data;
};

// Health check
export const checkBeerPongHealth = async () => {
  const response = await beerPongApi.get('/health');
  return response.data;
};

export default beerPongApi;
