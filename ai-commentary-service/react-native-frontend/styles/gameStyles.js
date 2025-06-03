import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, GAME_CONFIG } from '../utils/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const gameStyles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND
  },

  // Header
  header: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    alignItems: 'center'
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY
  },

  gameId: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 5
  },

  // Game controls
  controlsContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 15,
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },

  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },

  playerSelector: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  playerSelectorLabel: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginRight: 10
  },

  playerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: 'transparent'
  },

  playerButtonSelected: {
    borderColor: COLORS.TEXT_PRIMARY
  },

  playerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },

  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },

  actionButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center'
  },

  actionButtonDisabled: {
    backgroundColor: COLORS.BUTTON_DISABLED
  },

  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },

  // Test game buttons
  testGameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER
  },

  testGameButton: {
    backgroundColor: COLORS.BUTTON_SECONDARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center'
  },

  testGameButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },

  // Game stats
  statsContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },

  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },

  teamStats: {
    flex: 1,
    alignItems: 'center'
  },

  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5
  },

  statLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY
  },

  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY
  },

  // Game board
  gameBoardContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden'
  },

  gameBoard: {
    backgroundColor: COLORS.BOARD_BACKGROUND,
    height: 250,
    position: 'relative',
    borderWidth: 5,
    borderColor: COLORS.BOARD_BORDER
  },

  player: {
    position: 'absolute',
    width: GAME_CONFIG.PLAYER_SIZE,
    height: GAME_CONFIG.PLAYER_SIZE,
    borderRadius: GAME_CONFIG.PLAYER_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent'
  },

  playerSelected: {
    borderColor: 'white',
    borderWidth: 3
  },

  playerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },

  cup: {
    position: 'absolute',
    width: GAME_CONFIG.CUP_SIZE,
    height: GAME_CONFIG.CUP_SIZE,
    borderRadius: GAME_CONFIG.CUP_SIZE / 2,
    borderWidth: 2
  },

  cupFull: {
    backgroundColor: COLORS.CUP_FULL,
    borderColor: '#000',
    borderStyle: 'solid'
  },

  cupHalf: {
    backgroundColor: COLORS.CUP_HALF,
    borderColor: '#000',
    borderStyle: 'solid'
  },

  cupEmpty: {
    backgroundColor: COLORS.CUP_EMPTY,
    borderColor: '#777',
    borderStyle: 'dashed'
  },

  // Commentary
  commentaryContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },

  commentaryHeader: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER
  },

  commentaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2'
  },

  commentaryContent: {
    padding: 15,
    minHeight: 80
  },

  commentaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.TEXT_PRIMARY
  },

  commentaryPlaceholder: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic'
  },

  commentaryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER
  },

  commentator: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: 'bold'
  },

  timestamp: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY
  },

  // Loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND
  },

  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 10
  },

  errorContainer: {
    backgroundColor: '#FFEBEE',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336'
  },

  errorText: {
    fontSize: 14,
    color: '#C62828'
  },

  // Utility styles
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  row: {
    flexDirection: 'row'
  },

  spaceBetween: {
    justifyContent: 'space-between'
  },

  marginBottom: {
    marginBottom: 10
  },

  marginTop: {
    marginTop: 10
  },

  textCenter: {
    textAlign: 'center'
  },

  bold: {
    fontWeight: 'bold'
  }
});
