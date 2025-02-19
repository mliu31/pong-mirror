import Game from '../../models/Game';
import Player from '../../models/Player';

// TODO: the logged-in user should be added to the players array
export const createGame = () => Game.create({ players: [] });

export const addPlayersToGame = async (gameId: string, playerIds: string[]) => {
  const game = await Game.findById(gameId);
  if (game === null) {
    throw new Error('Game not found');
  }
  const players = await Player.find({ _id: { $in: playerIds } });
  if (playerIds.length !== playerIds.length) {
    throw new Error('Some players were not found');
  }
  game.players.push(players.map((player) => ({ player: player._id })));
  return await game.save();
};
