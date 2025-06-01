import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { gameStyles } from '../styles/gameStyles';
import { PLAYERS } from '../utils/constants';
import ApiService from '../services/ApiService';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameStats from './GameStats';
import CommentaryBox from './CommentaryBox';

const BeerPongGame = () => {
  // Game state
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState('A');

  // Commentary state
  const [commentary, setCommentary] = useState('');
  const [commentator, setCommentator] = useState('');
  const [commentaryTimestamp, setCommentaryTimestamp] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentaryLoading, setCommentaryLoading] = useState(false);

  // Create a new game
  const createGame = async () => {
    setLoading(true);
    setError('');

    try {
      const game = await ApiService.createGame();
      setGameId(game.id);
      setGameState(game.current_state);
      setCommentary('');
      setCommentator('');
      setCommentaryTimestamp(null);

      Alert.alert('Success', 'New game created!');
    } catch (err) {
      console.error('Failed to create game:', err);
      setError('Failed to create game. Please check your connection.');
      Alert.alert('Error', 'Failed to create game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add an action to the game
  const addAction = async (actionType) => {
    if (!gameId) {
      Alert.alert('Error', 'No active game. Please create a game first.');
      return;
    }

    setLoading(true);
    setCommentaryLoading(true);
    setError('');

    try {
      // Add the action
      await ApiService.addAction(gameId, {
        type: actionType,
        player: selectedPlayer
      });

      // Fetch updated game state
      const updatedGame = await ApiService.getGame(gameId);
      setGameState(updatedGame.current_state);

      // Fetch latest commentary (with a small delay to allow backend processing)
      setTimeout(async () => {
        try {
          const commentaryResponse =
            await ApiService.getLatestCommentary(gameId);
          if (commentaryResponse.commentary) {
            setCommentary(commentaryResponse.commentary);
            setCommentator(commentaryResponse.commentator);
            setCommentaryTimestamp(commentaryResponse.timestamp);
          }
        } catch (err) {
          console.error('Failed to fetch commentary:', err);
        } finally {
          setCommentaryLoading(false);
        }
      }, 1000);
    } catch (err) {
      console.error('Failed to add action:', err);
      setError(`Failed to add ${actionType} action. Please try again.`);
      Alert.alert('Error', `Failed to add ${actionType} action.`);
      setCommentaryLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Load a test game
  const loadTestGame = async (gameType) => {
    if (!gameId) {
      Alert.alert('Error', 'No active game. Please create a game first.');
      return;
    }

    setLoading(true);
    setCommentaryLoading(true);
    setError('');

    try {
      const response = await ApiService.loadGameLog(gameId, gameType);
      setGameState(response.game.current_state);

      // Fetch latest commentary
      const commentaryResponse = await ApiService.getLatestCommentary(gameId);
      if (commentaryResponse.commentary) {
        setCommentary(commentaryResponse.commentary);
        setCommentator(commentaryResponse.commentator);
        setCommentaryTimestamp(commentaryResponse.timestamp);
      }

      Alert.alert('Success', `Loaded ${gameType} game!`);
    } catch (err) {
      console.error('Failed to load test game:', err);
      setError('Failed to load test game. Please try again.');
      Alert.alert('Error', 'Failed to load test game.');
    } finally {
      setLoading(false);
      setCommentaryLoading(false);
    }
  };

  // Handle player selection
  const handlePlayerSelect = (playerId) => {
    setSelectedPlayer(playerId);
  };

  // Handle cup press (for interactive gameplay)
  const handleCupPress = (team, cupType, cupIndex) => {
    const playerTeam = PLAYERS[selectedPlayer].team;

    // Only allow interaction with opposing team's cups
    if (playerTeam === team) {
      Alert.alert(
        'Invalid Move',
        "You can only target the opposing team's cups!"
      );
      return;
    }

    // Determine action based on cup type
    if (cupType === 'full') {
      addAction('hit'); // Hit a full cup to make it half
    } else if (cupType === 'half') {
      addAction('sink'); // Sink a half cup to make it empty
    }
  };

  // Error display component
  const ErrorDisplay = () => {
    if (!error) return null;

    return (
      <View style={gameStyles.errorContainer}>
        <Text style={gameStyles.errorText}>{error}</Text>
      </View>
    );
  };

  // Loading display
  if (loading && !gameId) {
    return (
      <View style={gameStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={gameStyles.loadingText}>Creating game...</Text>
      </View>
    );
  }

  return (
    <View style={gameStyles.container}>
      {/* Header */}
      <View style={gameStyles.header}>
        <Text style={gameStyles.headerTitle}>Beer Pong Commentary</Text>
        {gameId && <Text style={gameStyles.gameId}>Game ID: {gameId}</Text>}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Error Display */}
        <ErrorDisplay />

        {/* Create Game Button */}
        {!gameId && (
          <View style={gameStyles.controlsContainer}>
            <TouchableOpacity
              style={[gameStyles.actionButton, { alignSelf: 'center' }]}
              onPress={createGame}
              disabled={loading}
            >
              <Text style={gameStyles.actionButtonText}>
                {loading ? 'Creating...' : 'Create New Game'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Game Content */}
        {gameId && (
          <>
            {/* Game Controls */}
            <GameControls
              selectedPlayer={selectedPlayer}
              onPlayerSelect={handlePlayerSelect}
              onAction={addAction}
              onLoadTestGame={loadTestGame}
              loading={loading}
              gameId={gameId}
            />

            {/* Game Stats */}
            <GameStats gameState={gameState} />

            {/* Game Board */}
            <GameBoard
              gameState={gameState}
              selectedPlayer={selectedPlayer}
              onPlayerSelect={handlePlayerSelect}
              onCupPress={handleCupPress}
            />

            {/* Commentary */}
            <CommentaryBox
              commentary={commentary}
              commentator={commentator}
              timestamp={commentaryTimestamp}
              loading={commentaryLoading}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default BeerPongGame;
