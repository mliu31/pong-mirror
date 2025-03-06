import { isValidTeam } from '../../constants/TEAM';
import Game from '../../models/Game';
import Player /*, { IPlayer } */ from '../../models/Player';

export const createGame = (/*loggedInPlayer: IPlayer*/) =>
  Game.create({
    players: [
      // TODO: Uncomment this once frontend login is implemented
      // { player: loggedInPlayer, team: null }
    ]
  });

export const getGame = async (gameId: string) =>
  Game.findById(gameId).populate('players.player');

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
    if (isValidTeam(team)) {
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

// export const updateElo = async (gameid: string, winningColor: string) => {
//   try {
//     const foundGame = await Game.findById(gameid);
//     if (!foundGame) {
//       throw new Error('404 Game not found');
//     }

//     // Winning and losing players based on the winningColor
//     const winningPlayers = foundGame.players.filter(
//       (player) => player.team === winningColor
//     );
//     const losingPlayers = foundGame.players.filter(
//       (player) => player.team !== winningColor
//     );

//     // Update ELO scores in parallel
//     await Promise.all(
//       winningPlayers.map((player) =>
//         Player.findByIdAndUpdate(player._id, { $inc: { elo: 1 } })
//       )
//     );

//     await Promise.all(
//       losingPlayers.map((player) =>
//         Player.findByIdAndUpdate(player._id, { $inc: { elo: -1 } })
//       )
//     );

//     const allPlayers = foundGame.players.map((player) => player._id);
//     return Player.find({ _id: { $in: allPlayers } });
//   } catch (error) {
//     throw new Error('Internal server error: ' + error);
//   }
// };
