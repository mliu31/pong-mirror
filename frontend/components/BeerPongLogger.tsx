import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, Animated, ScrollView, Text } from 'react-native';
import { Button, ButtonText } from './ui/button';
import { Box } from './ui/box';
import { VStack } from './ui/vstack';
import { Badge, BadgeText } from './ui/badge';
import { IPlayer } from '@/api/types';
import {
  ChevronUp,
  ChevronDown,
  Play,
  Target,
  Zap,
  Trophy,
  MessageCircle
} from 'lucide-react-native';
import {
  logBeerPongEvent,
  getBeerPongGameSession,
  getLatestBeerPongCommentary,
  BeerPongGameSession,
  CommentaryResponse
} from '../api/mainBackendBeerPong';

interface BeerPongLoggerProps {
  leftTeam: IPlayer[];
  rightTeam: IPlayer[];
  gameId: string;
  isVisible?: boolean;
}

type ActionType = 'serve' | 'rally' | 'hit' | 'sink';

const BeerPongLogger: React.FC<BeerPongLoggerProps> = ({
  leftTeam,
  rightTeam,
  gameId,
  isVisible = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [gameSession, setGameSession] = useState<BeerPongGameSession | null>(
    null
  );
  const [gameState, setGameState] = useState({
    red_full: 10,
    red_half: 0,
    red_empty: 0,
    blue_full: 10,
    blue_half: 0,
    blue_empty: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const [commentary, setCommentary] = useState<string>('');
  const [commentator, setCommentator] = useState<string>('');
  const [showCommentary, setShowCommentary] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  // Load existing game session when component mounts
  useEffect(() => {
    if (isVisible && gameId && leftTeam.length > 0 && rightTeam.length > 0) {
      loadGameSession();
    }
  }, [isVisible, gameId, leftTeam.length, rightTeam.length]);

  // Animate widget expansion
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [isExpanded]);

  const loadGameSession = async () => {
    try {
      const session = await getBeerPongGameSession(gameId);
      setGameSession(session);
      setGameState(session.currentState);
      setLastAction(session.lastAction || '');
      console.log('Beer Pong game session loaded:', session);
    } catch (error) {
      console.error('Failed to load beer pong game session:', error);
      // Initialize with default state if no session exists
      setGameState({
        red_full: 10,
        red_half: 0,
        red_empty: 0,
        blue_full: 10,
        blue_half: 0,
        blue_empty: 0
      });
    }
  };

  const fetchCommentary = async () => {
    if (!gameId) return;

    try {
      const commentaryResponse = await getLatestBeerPongCommentary(gameId);
      if (commentaryResponse.commentary) {
        setCommentary(commentaryResponse.commentary);
        setCommentator(commentaryResponse.commentator || 'AI Commentator');
        setShowCommentary(true);
      }
    } catch (error) {
      console.error('Failed to fetch commentary:', error);
    }
  };

  const handleAction = async (actionType: ActionType) => {
    if (!selectedPlayer || !gameId) return;

    setIsLoading(true);
    try {
      const playerLetter = getPlayerLetter(selectedPlayer);
      const team = getPlayerTeam(selectedPlayer);

      // Update game state based on action (simplified logic)
      const newGameState = { ...gameState };
      if (actionType === 'sink') {
        if (team === 'red') {
          newGameState.blue_full = Math.max(0, newGameState.blue_full - 1);
        } else {
          newGameState.red_full = Math.max(0, newGameState.red_full - 1);
        }
      }

      await logBeerPongEvent(gameId, {
        playerId: selectedPlayer,
        playerName: getPlayerName(selectedPlayer),
        playerLetter,
        team,
        action: actionType,
        gameState: newGameState
      });

      // Reload the game session to get updated data
      await loadGameSession();

      setLastAction(
        `${getPlayerName(selectedPlayer)} - ${actionType.toUpperCase()}`
      );

      // Fetch commentary after a short delay
      setTimeout(() => {
        fetchCommentary();
      }, 1000);

      // Auto-collapse removed - keep the logger open when buttons are pressed
    } catch (error) {
      console.error('Failed to log action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlayerLetter = (playerId: string): string => {
    const allPlayers = [...leftTeam, ...rightTeam];
    const playerIndex = allPlayers.findIndex((p) => p._id === playerId);
    return String.fromCharCode(65 + playerIndex); // A, B, C, D
  };

  const getPlayerName = (playerId: string): string => {
    const allPlayers = [...leftTeam, ...rightTeam];
    const player = allPlayers.find((p) => p._id === playerId);
    return player?.name || 'Unknown';
  };

  const getPlayerTeam = (playerId: string): 'red' | 'blue' => {
    return leftTeam.some((p) => p._id === playerId) ? 'red' : 'blue';
  };

  const ActionButton = ({
    action,
    icon: Icon,
    color
  }: {
    action: ActionType;
    icon: any;
    color: string;
  }) => (
    <Button
      size="sm"
      variant="solid"
      className={`${color} flex-1 mx-1`}
      onPress={() => handleAction(action)}
      disabled={!selectedPlayer || isLoading}
    >
      <ButtonText className="text-xs font-semibold text-white">
        <Icon size={12} className="mr-1" />
        {action.toUpperCase()}
      </ButtonText>
    </Button>
  );

  const PlayerButton = ({ player }: { player: IPlayer }) => {
    const isSelected = selectedPlayer === player._id;
    const team = getPlayerTeam(player._id);
    const teamColor = team === 'red' ? 'bg-red-200' : 'bg-blue-200';

    return (
      <Pressable
        onPress={() => setSelectedPlayer(isSelected ? '' : player._id)}
        className={`p-2 rounded-lg border-2 ${
          isSelected
            ? `${teamColor} border-gray-600`
            : 'bg-gray-100 border-gray-400'
        }`}
      >
        <Text style={{ color: '#000000', fontSize: 12, fontWeight: '500' }}>
          {player.name}
        </Text>
      </Pressable>
    );
  };

  if (!isVisible || leftTeam.length === 0 || rightTeam.length === 0)
    return null;

  return (
    <>
      {/* Backdrop overlay when expanded */}
      {isExpanded && (
        <View className="absolute inset-0 bg-black bg-opacity-50 z-[9998]" />
      )}

      {/* Main widget container with highest z-index */}
      <View className="absolute bottom-0 left-0 right-0 z-[9999]">
        {/* Commentary Popup - positioned above the widget */}
        {showCommentary && commentary && (
          <View className="bg-white border-2 border-gray-400 mx-2 mb-2 p-4 rounded-lg shadow-2xl">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: 4
                  }}
                >
                  🎙️ {commentator}
                </Text>
                <Text
                  style={{ color: '#000000', fontSize: 14, lineHeight: 20 }}
                >
                  {commentary}
                </Text>
              </View>
              <Pressable
                onPress={() => setShowCommentary(false)}
                className="ml-3 p-1 bg-gray-200 rounded-full"
              >
                <Text
                  style={{ color: '#000000', fontWeight: 'bold', fontSize: 18 }}
                >
                  ✕
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Collapsed Header */}
        <Pressable
          onPress={() => {
            // Only toggle when user explicitly clicks the header
            setIsExpanded(!isExpanded);
          }}
          className="bg-white border-t-4 border-gray-400 px-4 py-3 flex-row items-center justify-between shadow-2xl"
        >
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
            <Text
              style={{ color: '#000000', fontWeight: 'bold', fontSize: 16 }}
            >
              Beer Pong Logger
            </Text>
            {lastAction && (
              <Badge className="ml-2 bg-gray-200 border border-gray-400">
                <BadgeText
                  style={{ color: '#000000' }}
                  className="text-xs font-semibold"
                >
                  {lastAction}
                </BadgeText>
              </Badge>
            )}
          </View>

          <View className="flex-row items-center">
            {commentary && (
              <Pressable
                onPress={() => setShowCommentary(!showCommentary)}
                className="mr-3 p-1 bg-gray-200 rounded-full"
              >
                <MessageCircle size={16} color="#000000" />
              </Pressable>
            )}
            {isExpanded ? (
              <ChevronDown size={24} color="#000000" />
            ) : (
              <ChevronUp size={24} color="#000000" />
            )}
          </View>
        </Pressable>

        {/* Expanded Content */}
        <Animated.View
          style={{
            height: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 320]
            }),
            overflow: 'hidden'
          }}
          className="bg-white border-t-2 border-gray-400 shadow-2xl"
        >
          <ScrollView className="flex-1">
            <Box className="p-4 bg-white">
              {/* Player Selection */}
              <VStack className="mb-4">
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: 8
                  }}
                >
                  Select Player:
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[...leftTeam, ...rightTeam].map((player) => (
                    <PlayerButton key={player._id} player={player} />
                  ))}
                </View>
                {selectedPlayer && (
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 14,
                      fontWeight: '500',
                      marginTop: 8,
                      backgroundColor: '#f3f4f6',
                      padding: 8,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: '#d1d5db'
                    }}
                  >
                    Selected: {getPlayerName(selectedPlayer)} (
                    {getPlayerTeam(selectedPlayer).toUpperCase()} team)
                  </Text>
                )}
              </VStack>

              {/* Action Buttons */}
              <VStack className="mb-2">
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: 8
                  }}
                >
                  Log Action:
                </Text>
                <View className="flex-row mb-2">
                  <ActionButton
                    action="serve"
                    icon={Play}
                    color="bg-green-600"
                  />
                  <ActionButton
                    action="rally"
                    icon={Zap}
                    color="bg-yellow-600"
                  />
                </View>
                <View className="flex-row">
                  <ActionButton
                    action="hit"
                    icon={Target}
                    color="bg-orange-600"
                  />
                  <ActionButton
                    action="sink"
                    icon={Trophy}
                    color="bg-red-600"
                  />
                </View>
              </VStack>

              {/* Status */}
              {isLoading && (
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 14,
                    fontWeight: '500',
                    textAlign: 'center',
                    backgroundColor: '#f3f4f6',
                    padding: 8,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#d1d5db'
                  }}
                >
                  Logging action...
                </Text>
              )}

              {/* Game ID for debugging */}
              {gameId && (
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 12,
                    textAlign: 'center',
                    marginTop: 8,
                    backgroundColor: '#f3f4f6',
                    padding: 8,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#d1d5db'
                  }}
                >
                  Game ID: {gameId}
                </Text>
              )}
            </Box>
          </ScrollView>
        </Animated.View>
      </View>
    </>
  );
};

export default BeerPongLogger;
