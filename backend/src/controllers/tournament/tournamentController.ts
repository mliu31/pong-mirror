import Tournament from '../../models/Tournament';
import Player from '../../models/Player';
import Team from '../../models/Team';
import {
  addPlayerTeam,
  calculateElo,
  createTeam
} from '../teams/teamController';

// create tournament
export const createTournament = (tournamentName: string) => {
  const tournament = Tournament.create({
    name: tournamentName,
    teams: []
  });
  return tournament;
};

// get tournament

export const getTournament = (tournamentId: string) =>
  Tournament.findById(tournamentId);

// delete tournament

export const deleteTournament = async (tournamentId: string) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(tournamentId);
    if (!tournament) {
      throw new Error('tournament not found');
    }
  } catch (error) {
    console.error('internal server error', error);
  }
};

// add team

export const addTeam = async (tournamentId: string, playerId: string) => {
  const player = await Player.findById(playerId);
  const tournament = await Tournament.findById(tournamentId);

  if (!player) throw new Error('404 Player not found');

  if (!tournament) throw new Error('404 Tournament not found');

  for (const teamId of tournament.teams) {
    const team = await Team.findById(teamId);
    if (!team) throw new Error('404 Tournament not found');
    if (team.players.includes(playerId))
      throw new Error('Player already in tournament');
  }

  const team = await createTeam(playerId);

  if (!team) throw new Error('Error creating team');

  tournament.teams.push(team.id);

  reseedTeams(tournamentId);

  tournament.save();

  return tournament;
};

// re-seed teams by Elo
export const reseedTeams = async (tournamendId: string) => {
  const tournament = await Tournament.findById(tournamendId);

  if (!tournament) throw new Error('404 Tournament not found');

  // Get all teams and recalculate their Elos
  const teams = await Promise.all(
    tournament.teams.map(async (teamId) => {
      const team = await Team.findById(teamId);
      if (!team) throw new Error(`Team ${teamId} not found`);
      await calculateElo(teamId); // Recalculate Elo for each team
      return team;
    })
  );

  // Sort teams by Elo in descending order
  const sortedTeams = teams.sort((a, b) => b.elo - a.elo);

  // Assign seeds (1 is highest seed)
  for (let i = 0; i < sortedTeams.length; i++) {
    sortedTeams[i].seed = i + 1;
    await sortedTeams[i].save();
  }

  return tournament;
};

// remove tean
export const removeTeam = async (tournamentId: string, teamId: string) => {
  const tournament = await Tournament.findById(tournamentId);

  if (!tournament) throw new Error('404 Tournament not found');

  const team = await Team.findById(teamId);

  if (!team) throw new Error('404 Team not found');

  const teamIndex = tournament.teams.indexOf(teamId);

  tournament.teams.splice(teamIndex, 1);

  await reseedTeams(tournamentId);

  await tournament.save();

  return tournament;
};

// add player to team

export const addPlayer = async (
  tournamentId: string,
  teamId: string,
  playerId: string
) => {
  const tournament = await Tournament.findById(tournamentId);

  if (!tournament) throw new Error('404 Tournament not found');

  const team = await Team.findById(teamId);

  if (!team) throw new Error('404 Team not found');

  const player = await Player.findById(playerId);

  if (!player) throw new Error('404 Player not found');

  if (team.players.length > 1) throw new Error('Team is full');

  for (const teamId of tournament.teams) {
    const t = await Team.findById(teamId);
    if (!t) throw new Error('404 Tournament not found');
    if (t.players.includes(playerId))
      throw new Error('Player already in tournament');
  }

  const newTeam = await addPlayerTeam(teamId, playerId);
  if (!newTeam) throw new Error('Error adding to team');

  await reseedTeams(tournamentId);

  return newTeam;
};

// start tournament

// end tournament

// get all teams in tournament
export const getAllTeams = async (tournamentId: string) => {
  const tournament = await Tournament.findById(tournamentId);

  if (!tournament) throw new Error('404 Tournament not found');

  return tournament.teams;
};
