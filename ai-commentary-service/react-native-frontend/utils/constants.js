/**
 * Constants for Beer Pong Commentary App
 */

// Player definitions
export const PLAYERS = {
  A: { id: 'A', name: 'Player A', team: 'red', color: '#FF4444' },
  B: { id: 'B', name: 'Player B', team: 'red', color: '#FF6666' },
  C: { id: 'C', name: 'Player C', team: 'blue', color: '#4444FF' },
  D: { id: 'D', name: 'Player D', team: 'blue', color: '#6666FF' }
};

// Team definitions
export const TEAMS = {
  red: {
    name: 'Red Dragons',
    color: '#FF4444',
    players: ['A', 'B']
  },
  blue: {
    name: 'Blue Warriors',
    color: '#4444FF',
    players: ['C', 'D']
  }
};

// Action types
export const ACTION_TYPES = {
  SERVE: 'serve',
  RALLY: 'rally',
  HIT: 'hit',
  SINK: 'sink'
};

// Cup statuses
export const CUP_STATUS = {
  FULL: 'FULL',
  HALF: 'HALF',
  EMPTY: 'EMPTY'
};

// Game configuration
export const GAME_CONFIG = {
  INITIAL_CUPS_PER_TEAM: 10,
  BOARD_WIDTH: 400,
  BOARD_HEIGHT: 300,
  CUP_SIZE: 25,
  PLAYER_SIZE: 30
};

// Player positions on the game board (relative to board dimensions)
export const PLAYER_POSITIONS = {
  A: { x: 0.1, y: 0.3 }, // Red team left side
  B: { x: 0.1, y: 0.7 }, // Red team left side
  C: { x: 0.9, y: 0.3 }, // Blue team right side
  D: { x: 0.9, y: 0.7 } // Blue team right side
};

// Cup positions for each team (relative to board dimensions)
export const CUP_POSITIONS = {
  red: [
    { x: 0.25, y: 0.2 },
    { x: 0.25, y: 0.4 },
    { x: 0.25, y: 0.6 },
    { x: 0.25, y: 0.8 },
    { x: 0.35, y: 0.3 },
    { x: 0.35, y: 0.5 },
    { x: 0.35, y: 0.7 },
    { x: 0.45, y: 0.25 },
    { x: 0.45, y: 0.5 },
    { x: 0.45, y: 0.75 }
  ],
  blue: [
    { x: 0.75, y: 0.2 },
    { x: 0.75, y: 0.4 },
    { x: 0.75, y: 0.6 },
    { x: 0.75, y: 0.8 },
    { x: 0.65, y: 0.3 },
    { x: 0.65, y: 0.5 },
    { x: 0.65, y: 0.7 },
    { x: 0.55, y: 0.25 },
    { x: 0.55, y: 0.5 },
    { x: 0.55, y: 0.75 }
  ]
};

// Colors
export const COLORS = {
  // Team colors
  RED_TEAM: '#FF4444',
  BLUE_TEAM: '#4444FF',

  // Cup colors
  CUP_FULL: '#FFFFFF',
  CUP_HALF: 'rgba(255, 255, 255, 0.6)',
  CUP_EMPTY: 'rgba(200, 200, 200, 0.3)',

  // UI colors
  BACKGROUND: '#F5F5F5',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  BORDER: '#DDDDDD',

  // Button colors
  BUTTON_PRIMARY: '#4CAF50',
  BUTTON_SECONDARY: '#2196F3',
  BUTTON_DANGER: '#F44336',
  BUTTON_DISABLED: '#CCCCCC',

  // Game board
  BOARD_BACKGROUND: '#8B4513',
  BOARD_BORDER: '#654321'
};

// Test game logs
export const TEST_GAMES = {
  SHORT: 'new_pong_short.json',
  MEDIUM: 'new_pong_medium.json',
  LONG: 'new_pong_long.json'
};

// API endpoints (relative to base URL)
export const API_ENDPOINTS = {
  HEALTH: '/health',
  GAMES: '/api/games',
  GAME_BY_ID: (id) => `/api/games/${id}`,
  GAME_ACTIONS: (id) => `/api/games/${id}/actions`,
  GAME_COMMENTARIES: (id) => `/api/games/${id}/commentaries`,
  LATEST_COMMENTARY: (id) => `/api/games/${id}/latest-commentary`,
  LOAD_LOG: (id) => `/api/games/${id}/load-log`,
  COMMENTARY: '/api/commentary'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'API error. Please try again.',
  GAME_NOT_FOUND: 'Game not found.',
  INVALID_ACTION: 'Invalid action.',
  UNKNOWN_ERROR: 'An unknown error occurred.'
};
