// Simple test script to verify beer pong API connection
// Run this with: node test-beer-pong.js

const axios = require('axios');

const BEER_PONG_API_URL = 'http://localhost:8000';

async function testBeerPongAPI() {
  console.log('🍺 Testing Beer Pong API Connection...');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BEER_PONG_API_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test creating a game
    console.log('2. Testing game creation...');
    const gameResponse = await axios.post(`${BEER_PONG_API_URL}/api/games`);
    console.log('✅ Game created:', gameResponse.data.id);

    const gameId = gameResponse.data.id;

    // Test adding an action
    console.log('3. Testing action addition...');
    const actionResponse = await axios.post(
      `${BEER_PONG_API_URL}/api/games/${gameId}/actions`,
      {
        type: 'serve',
        player: 'A',
        timestamp: Date.now() / 1000
      }
    );
    console.log('✅ Action added:', actionResponse.data);

    // Test getting game state
    console.log('4. Testing game state retrieval...');
    const stateResponse = await axios.get(
      `${BEER_PONG_API_URL}/api/games/${gameId}`
    );
    console.log('✅ Game state:', stateResponse.data.current_state);

    console.log('🎉 All tests passed! Beer Pong API is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log(
        '💡 Make sure your beer pong backend is running on http://localhost:8000'
      );
      console.log('   Run: cd ai-commentary-service && python main.py');
    }
  }
}

testBeerPongAPI();
