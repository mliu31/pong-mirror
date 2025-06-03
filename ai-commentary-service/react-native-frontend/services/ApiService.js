/**
 * API Service for Beer Pong Commentary App
 * Handles all communication with the FastAPI backend
 */

// Configuration
const API_BASE_URL = 'http://localhost:8000'; // Change this for your backend URL

// For React Native development:
// - iOS Simulator: http://localhost:8000
// - Android Emulator: http://10.0.2.2:8000
// - Physical device: http://YOUR_COMPUTER_IP:8000

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log(`API Response: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    return this.request('/health');
  }

  /**
   * Game Management
   */
  async createGame() {
    return this.request('/api/games', {
      method: 'POST'
    });
  }

  async getGames() {
    return this.request('/api/games');
  }

  async getGame(gameId) {
    return this.request(`/api/games/${gameId}`);
  }

  async deleteGame(gameId) {
    return this.request(`/api/games/${gameId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Game Actions
   */
  async addAction(gameId, action) {
    return this.request(`/api/games/${gameId}/actions`, {
      method: 'POST',
      body: JSON.stringify({
        timestamp: Date.now() / 1000,
        type: action.type,
        player: action.player
      })
    });
  }

  /**
   * Commentary
   */
  async getCommentaries(gameId) {
    return this.request(`/api/games/${gameId}/commentaries`);
  }

  async getLatestCommentary(gameId) {
    return this.request(`/api/games/${gameId}/latest-commentary`);
  }

  async generateCommentary(action, gameState) {
    return this.request('/api/commentary', {
      method: 'POST',
      body: JSON.stringify({
        action: {
          timestamp: Date.now() / 1000,
          type: action.type,
          player: action.player
        },
        game_state: gameState
      })
    });
  }

  /**
   * Game Logs
   */
  async loadGameLog(gameId, fileName) {
    const filePath = `test_game_logs/${fileName}`;
    return this.request(`/api/games/${gameId}/load-log?file_path=${filePath}`, {
      method: 'POST'
    });
  }

  /**
   * Convenience methods for common actions
   */
  async serve(gameId, player) {
    return this.addAction(gameId, { type: 'serve', player });
  }

  async rally(gameId, player) {
    return this.addAction(gameId, { type: 'rally', player });
  }

  async hit(gameId, player) {
    return this.addAction(gameId, { type: 'hit', player });
  }

  async sink(gameId, player) {
    return this.addAction(gameId, { type: 'sink', player });
  }
}

// Export singleton instance
export default new ApiService();
