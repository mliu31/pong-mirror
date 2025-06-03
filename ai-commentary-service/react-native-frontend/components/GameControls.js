import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { gameStyles } from '../styles/gameStyles';
import { PLAYERS, ACTION_TYPES, TEST_GAMES } from '../utils/constants';

const GameControls = ({
  selectedPlayer,
  onPlayerSelect,
  onAction,
  onLoadTestGame,
  loading,
  gameId
}) => {
  const PlayerButton = ({ playerId }) => {
    const player = PLAYERS[playerId];
    const isSelected = selectedPlayer === playerId;

    return (
      <TouchableOpacity
        style={[
          gameStyles.playerButton,
          { backgroundColor: player.color },
          isSelected && gameStyles.playerButtonSelected
        ]}
        onPress={() => onPlayerSelect(playerId)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={gameStyles.playerButtonText}>{playerId}</Text>
      </TouchableOpacity>
    );
  };

  const ActionButton = ({ action, title }) => (
    <TouchableOpacity
      style={[
        gameStyles.actionButton,
        (loading || !gameId) && gameStyles.actionButtonDisabled
      ]}
      onPress={() => onAction(action)}
      disabled={loading || !gameId}
      activeOpacity={0.7}
    >
      <Text style={gameStyles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const TestGameButton = ({ gameType, title }) => (
    <TouchableOpacity
      style={[
        gameStyles.testGameButton,
        (loading || !gameId) && gameStyles.actionButtonDisabled
      ]}
      onPress={() => onLoadTestGame(gameType)}
      disabled={loading || !gameId}
      activeOpacity={0.7}
    >
      <Text style={gameStyles.testGameButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={gameStyles.controlsContainer}>
      {/* Player Selection */}
      <View style={gameStyles.controlsRow}>
        <Text style={gameStyles.playerSelectorLabel}>Select Player:</Text>
        <View style={gameStyles.playerSelector}>
          {Object.keys(PLAYERS).map((playerId) => (
            <PlayerButton key={playerId} playerId={playerId} />
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={gameStyles.actionButtonsContainer}>
        <ActionButton action={ACTION_TYPES.SERVE} title="Serve" />
        <ActionButton action={ACTION_TYPES.RALLY} title="Rally" />
        <ActionButton action={ACTION_TYPES.HIT} title="Hit" />
        <ActionButton action={ACTION_TYPES.SINK} title="Sink" />
      </View>

      {/* Test Game Loading */}
      <View style={gameStyles.testGameContainer}>
        <TestGameButton gameType={TEST_GAMES.SHORT} title="Short Game" />
        <TestGameButton gameType={TEST_GAMES.MEDIUM} title="Medium Game" />
        <TestGameButton gameType={TEST_GAMES.LONG} title="Long Game" />
      </View>
    </View>
  );
};

export default GameControls;
