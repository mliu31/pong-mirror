import Team from '../../models/Team';
import Player from '../../models/Player';

// create team
export const createTeam = async (playerId: string) => {
  const player = await Player.findById(playerId);

  if (!player) {
    throw new Error('404 player not found');
  }
  const team = await Team.create({
    elo: player.elo,
    players: [playerId],
    seed: 5
  });
  return team;
};

// add player to team
export const addPlayer = async (teamId: string, playerId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error('404 team not found');
  }

  const player = await Player.findById(playerId);
  if (!player) {
    throw new Error('404 player not found');
  }
  if (team.players.length > 1) {
    throw new Error('Team is full');
  }
  if (team.players.includes(playerId)) {
    throw new Error('Player already in team');
  }
  team.players.push(playerId);

  team.save();

  return team;
};

// calculate elo

export const calculateElo = async (teamId: string) => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new Error('404 team not found');
  }
  let totalElo = 0;
  for (const playerId of team.players) {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    totalElo += player.elo;
  }

  team.elo = totalElo / team.players.length;
  await team.save();

  return team;
};

// get team
export const getTeam = async (teamId: string) => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new Error('404 team not found');
  }
  return team;
};
