import api from '.';

export interface BeerPongEventRequest {
  playerId: string;
  playerName: string;
  playerLetter: string;
  team: 'red' | 'blue';
  action: 'serve' | 'rally' | 'hit' | 'sink';
  gameState: {
    red_full: number;
    red_half: number;
    red_empty: number;
    blue_full: number;
    blue_half: number;
    blue_empty: number;
  };
  commentary?: string;
  commentator?: string;
}

export interface BeerPongEvent {
  _id: string;
  gameId: string;
  playerId: string;
  playerName: string;
  playerLetter: string;
  team: 'red' | 'blue';
  action: 'serve' | 'rally' | 'hit' | 'sink';
  timestamp: string;
  gameState: {
    red_full: number;
    red_half: number;
    red_empty: number;
    blue_full: number;
    blue_half: number;
    blue_empty: number;
  };
  commentary?: string;
  commentator?: string;
}

export interface BeerPongGameSession {
  gameId: string;
  events: BeerPongEvent[];
  currentState: {
    red_full: number;
    red_half: number;
    red_empty: number;
    blue_full: number;
    blue_half: number;
    blue_empty: number;
  };
  lastAction?: string;
  players: {
    id: string;
    name: string;
    letter: string;
    team: 'red' | 'blue';
  }[];
}

export interface BeerPongStats {
  totalEvents: number;
  serves: number;
  rallies: number;
  hits: number;
  sinks: number;
  gamesPlayed: number;
}

export interface CommentaryResponse {
  commentary?: string;
  commentator?: string;
  event?: BeerPongEvent;
}

// Log a beer pong event
export const logBeerPongEvent = async (
  gameId: string,
  eventData: BeerPongEventRequest
): Promise<BeerPongEvent> => {
  const response = await api.post(
    `/beer-pong/games/${gameId}/events`,
    eventData
  );
  return response.data;
};

// Get all events for a game (for replay)
export const getBeerPongEvents = async (
  gameId: string
): Promise<BeerPongEvent[]> => {
  const response = await api.get(`/beer-pong/games/${gameId}/events`);
  return response.data;
};

// Get beer pong game session (events + current state)
export const getBeerPongGameSession = async (
  gameId: string
): Promise<BeerPongGameSession> => {
  const response = await api.get(`/beer-pong/games/${gameId}/session`);
  return response.data;
};

// Get latest commentary for a game
export const getLatestBeerPongCommentary = async (
  gameId: string
): Promise<CommentaryResponse> => {
  const response = await api.get(
    `/beer-pong/games/${gameId}/commentary/latest`
  );
  return response.data;
};

// Reset beer pong game (delete all events)
export const resetBeerPongGame = async (
  gameId: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/beer-pong/games/${gameId}/events`);
  return response.data;
};

// Get beer pong statistics for a player
export const getPlayerBeerPongStats = async (
  playerId: string
): Promise<BeerPongStats> => {
  const response = await api.get(`/beer-pong/players/${playerId}/stats`);
  return response.data;
};
