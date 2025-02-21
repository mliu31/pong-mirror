import { ObjectId } from 'mongoose';
import Game from '../../models/Game';
import Player from '../../models/Player';

// TODO: the logged-in user should be added to the players array
export const createGame = () => Game.create({ players: [] });

export type PlayerUpdateRecord = Record<string, boolean>;
export const updatePlayersInGame = async (
  gameId: string,
  playerUpdates: PlayerUpdateRecord
) => {
  const game = await Game.findById(gameId);
  if (game === null) throw new Error('Game not found');

  for (const [playerId, isPlaying] of Object.entries(playerUpdates)) {
    const matchedPlayerIndex = game.players.findIndex(
      (playerEntry) => playerEntry.player._id.toString() === playerId
    );
    if (matchedPlayerIndex === -1) {
      if (isPlaying) {
        // player is not in the game, but they should be.
        const player = await Player.findById(playerId);
        if (player === null)
          throw new Error(`Could not find a player with id ${playerId}`);
        game.players.push({ player, team: null });
      }
    } else if (!isPlaying) {
      // player is in the game, but they should not be.
      game.players.splice(matchedPlayerIndex, 1);
    }
  }
  await game.save();
  return game.players;
};

export const setPlayerTeam = async (
  gameid: string,
  pid: string,
  team: string
) => {
  try {
    const game = await Game.findById(gameid);

    if (!game) {
      throw new Error('Game not found');
    }

    const player = game.players.find((playerTeamEntry) =>
      playerTeamEntry.player._id.equals(pid)
    );
    if (!player) {
      throw new Error('Player not found');
    }
    if (team === 'RED' || team === 'BLUE' || team === null) {
      player.team = team;
    } else {
      throw new Error('Invalid team value');
    }
    await game.save();
    return game;
  } catch (e) {
    throw new Error('Internal server error' + e);
  }
};
