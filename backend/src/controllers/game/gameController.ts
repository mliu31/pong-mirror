import { isValidTeam } from '../../constants/TEAM';
import Game from '../../models/Game';
import Invite from '../../models/Invite';
import Player, { IPlayer /*, { IPlayer } */ } from '../../models/Player';

export const createGame = (/*loggedInPlayer: IPlayer*/) =>
  Game.create({
    players: [
      // TODO: Uncomment this once frontend login is implemented
      // { player: loggedInPlayer, team: null }
    ]
  });

export const getGame = async (gameId: string) =>
  Game.findById(gameId).populate('players.player');

export const invitePlayers = async (gameid: string, pids: string[]) => {
  const game = await Game.findById(gameid);
  if (!game) {
    throw new Error('Game not found');
  }

  await Invite.deleteMany({ gameId: gameid }); // clear previous invites for game

  // bulk-create new pending invites
  const docs = [];
  for (const pid of pids) {
    const player = await Player.findById(pid);
    if (!player) {
      throw new Error(`Invalid player ID: ${pid}`);
    }
    docs.push({
      gameId: gameid,
      playerId: pid
    });
  }
  await Invite.insertMany(docs);
};

export const getInvites = async (gameid: string) => {
  const invites = await Invite.find({ gameId: gameid });
  return invites;
};

export const addPlayersToGame = async (gameId: string, pids: string[]) => {
  const game = await Game.findById(gameId);
  if (game === null) throw new Error('Game not found');

  for (const pid of pids) {
    const player = await Player.findById(pid);
    if (player === null)
      throw new Error(`Could not find a player with id ${pid}`);
    game.players.push({ player, team: null });
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

export const setGameWinner = async (gameId: string, team: string) => {
  try {
    const game = await Game.findById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    if (isValidTeam(team)) {
      game.winner = team;
    } else {
      throw new Error('Invalid team value');
    }
    await game.save();
    return game;
  } catch (e) {
    throw new Error('Internal server error' + e);
  }
};

export const joinGame = async (gameId: string, player: IPlayer) =>
  addPlayersToGame(gameId, [player._id.toString()]);
