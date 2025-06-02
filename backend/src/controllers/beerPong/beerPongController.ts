import BeerPongEvent, { IBeerPongEvent } from '../../models/BeerPongEvent';
import Game from '../../models/Game';
import Player from '../../models/Player';
import mongoose from 'mongoose';
import {
  CommentaryService,
  BeerPongAction,
  GameState,
  Commentary
} from '../../services/commentaryService';

// Initialize commentary service
const commentaryService = new CommentaryService();

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

export interface BeerPongGameSession {
  gameId: string;
  events: IBeerPongEvent[];
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

// Log a beer pong event with automatic commentary generation
export const logBeerPongEvent = async (
  gameId: string,
  eventData: BeerPongEventRequest
): Promise<{ event: IBeerPongEvent; commentary?: Commentary }> => {
  // Verify game exists
  const game = await Game.findById(gameId);
  if (!game) {
    throw new Error(`Game with ID ${gameId} not found`);
  }

  // Verify player exists
  const player = await Player.findById(eventData.playerId);
  if (!player) {
    throw new Error(`Player with ID ${eventData.playerId} not found`);
  }

  // Generate commentary for this action
  const action: BeerPongAction = {
    timestamp: Date.now() / 1000,
    type: eventData.action,
    player: eventData.playerLetter,
    playerName: eventData.playerName
  };

  const gameState: GameState = eventData.gameState;

  let commentary: Commentary | null = null;
  try {
    commentary = await commentaryService.generateCommentary(action, gameState);
  } catch (error) {
    console.error('Failed to generate commentary:', error);
  }

  // Create the event with generated commentary
  const beerPongEvent = new BeerPongEvent({
    gameId: new mongoose.Types.ObjectId(gameId),
    playerId: new mongoose.Types.ObjectId(eventData.playerId),
    playerName: eventData.playerName,
    playerLetter: eventData.playerLetter,
    team: eventData.team,
    action: eventData.action,
    gameState: eventData.gameState,
    commentary: commentary?.commentary || eventData.commentary,
    commentator: commentary?.commentator || eventData.commentator
  });

  await beerPongEvent.save();

  return {
    event: beerPongEvent,
    commentary: commentary || undefined
  };
};

// Generate commentary for a specific action (standalone)
export const generateCommentaryForAction = async (
  action: BeerPongAction,
  gameState: GameState
): Promise<Commentary | null> => {
  try {
    return await commentaryService.generateCommentary(action, gameState);
  } catch (error) {
    console.error('Failed to generate commentary:', error);
    return null;
  }
};

// Get all events for a game (for replay)
export const getBeerPongEvents = async (
  gameId: string
): Promise<IBeerPongEvent[]> => {
  const events = await BeerPongEvent.find({ gameId })
    .populate('playerId', 'name')
    .sort({ timestamp: 1 }); // Chronological order

  return events;
};

// Get beer pong game session (current state + events)
export const getBeerPongGameSession = async (
  gameId: string
): Promise<BeerPongGameSession> => {
  const events = await getBeerPongEvents(gameId);

  // Get game and players
  const game = await Game.findById(gameId).populate('players.player', 'name');
  if (!game) {
    throw new Error(`Game with ID ${gameId} not found`);
  }

  // Calculate current state from events
  let currentState = {
    red_full: 10,
    red_half: 0,
    red_empty: 0,
    blue_full: 10,
    blue_half: 0,
    blue_empty: 0
  };

  if (events.length > 0) {
    // Get the latest game state from the most recent event
    const latestEvent = events[events.length - 1];
    currentState = latestEvent.gameState;
  }

  // Map players to beer pong format
  const players = game.players.map((playerGame, index: number) => {
    const populatedPlayer = playerGame.player as unknown as {
      _id: string;
      name: string;
    };
    return {
      id: populatedPlayer._id.toString(),
      name: populatedPlayer.name,
      letter: String.fromCharCode(65 + index), // A, B, C, D
      team: index < 2 ? ('red' as const) : ('blue' as const) // First 2 players red, last 2 blue
    };
  });

  const lastAction =
    events.length > 0
      ? `${events[events.length - 1].playerName} - ${events[events.length - 1].action.toUpperCase()}`
      : undefined;

  return {
    gameId,
    events,
    currentState,
    lastAction,
    players
  };
};

// Get latest commentary for a game
export const getLatestCommentary = async (
  gameId: string
): Promise<{
  commentary?: string;
  commentator?: string;
  event?: IBeerPongEvent;
}> => {
  const latestEventWithCommentary = await BeerPongEvent.findOne({
    gameId,
    commentary: { $exists: true, $ne: null }
  }).sort({ timestamp: -1 });

  if (!latestEventWithCommentary) {
    return {};
  }

  return {
    commentary: latestEventWithCommentary.commentary,
    commentator: latestEventWithCommentary.commentator,
    event: latestEventWithCommentary
  };
};

// Delete all events for a game (reset/cleanup)
export const resetBeerPongGame = async (gameId: string): Promise<void> => {
  await BeerPongEvent.deleteMany({ gameId });
};

// Get beer pong statistics for a player
export const getPlayerBeerPongStats = async (playerId: string) => {
  const events = await BeerPongEvent.find({ playerId });

  const stats = {
    totalEvents: events.length,
    serves: events.filter((e) => e.action === 'serve').length,
    rallies: events.filter((e) => e.action === 'rally').length,
    hits: events.filter((e) => e.action === 'hit').length,
    sinks: events.filter((e) => e.action === 'sink').length,
    gamesPlayed: new Set(events.map((e) => e.gameId.toString())).size
  };

  return stats;
};
