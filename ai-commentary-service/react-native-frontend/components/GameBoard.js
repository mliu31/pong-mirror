import React from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { gameStyles } from '../styles/gameStyles';
import {
  PLAYERS,
  PLAYER_POSITIONS,
  CUP_POSITIONS,
  GAME_CONFIG
} from '../utils/constants';

const { width: screenWidth } = Dimensions.get('window');

const GameBoard = ({
  gameState,
  selectedPlayer,
  onPlayerSelect,
  onCupPress,
  boardWidth = Math.min(screenWidth - 40, 400)
}) => {
  const boardHeight = (boardWidth * 250) / 400; // Maintain aspect ratio

  const renderPlayer = (playerId) => {
    const player = PLAYERS[playerId];
    const position = PLAYER_POSITIONS[playerId];
    const isSelected = selectedPlayer === playerId;

    const playerStyle = {
      ...gameStyles.player,
      backgroundColor: player.color,
      left: position.x * boardWidth - GAME_CONFIG.PLAYER_SIZE / 2,
      top: position.y * boardHeight - GAME_CONFIG.PLAYER_SIZE / 2
    };

    return (
      <TouchableOpacity
        key={playerId}
        style={[playerStyle, isSelected && gameStyles.playerSelected]}
        onPress={() => onPlayerSelect(playerId)}
        activeOpacity={0.7}
      >
        <Text style={gameStyles.playerText}>{playerId}</Text>
      </TouchableOpacity>
    );
  };

  const renderCups = (team) => {
    if (!gameState) return null;

    const positions = CUP_POSITIONS[team];
    const cupCounts = {
      full: team === 'red' ? gameState.red_full : gameState.blue_full,
      half: team === 'red' ? gameState.red_half : gameState.blue_half,
      empty: team === 'red' ? gameState.red_empty : gameState.blue_empty
    };

    const cups = [];
    let cupIndex = 0;

    // Render full cups
    for (let i = 0; i < cupCounts.full && cupIndex < positions.length; i++) {
      const position = positions[cupIndex];
      cups.push(
        <TouchableOpacity
          key={`${team}-full-${i}`}
          style={[
            gameStyles.cup,
            gameStyles.cupFull,
            {
              left: position.x * boardWidth - GAME_CONFIG.CUP_SIZE / 2,
              top: position.y * boardHeight - GAME_CONFIG.CUP_SIZE / 2
            }
          ]}
          onPress={() => onCupPress(team, 'full', cupIndex)}
          activeOpacity={0.7}
        />
      );
      cupIndex++;
    }

    // Render half cups
    for (let i = 0; i < cupCounts.half && cupIndex < positions.length; i++) {
      const position = positions[cupIndex];
      cups.push(
        <TouchableOpacity
          key={`${team}-half-${i}`}
          style={[
            gameStyles.cup,
            gameStyles.cupHalf,
            {
              left: position.x * boardWidth - GAME_CONFIG.CUP_SIZE / 2,
              top: position.y * boardHeight - GAME_CONFIG.CUP_SIZE / 2
            }
          ]}
          onPress={() => onCupPress(team, 'half', cupIndex)}
          activeOpacity={0.7}
        />
      );
      cupIndex++;
    }

    // Render empty cups
    for (let i = 0; i < cupCounts.empty && cupIndex < positions.length; i++) {
      const position = positions[cupIndex];
      cups.push(
        <View
          key={`${team}-empty-${i}`}
          style={[
            gameStyles.cup,
            gameStyles.cupEmpty,
            {
              left: position.x * boardWidth - GAME_CONFIG.CUP_SIZE / 2,
              top: position.y * boardHeight - GAME_CONFIG.CUP_SIZE / 2
            }
          ]}
        />
      );
      cupIndex++;
    }

    return cups;
  };

  return (
    <View style={gameStyles.gameBoardContainer}>
      <View
        style={[
          gameStyles.gameBoard,
          {
            width: boardWidth,
            height: boardHeight,
            alignSelf: 'center'
          }
        ]}
      >
        {/* Render all players */}
        {Object.keys(PLAYERS).map(renderPlayer)}

        {/* Render cups for both teams */}
        {renderCups('red')}
        {renderCups('blue')}
      </View>
    </View>
  );
};

export default GameBoard;
