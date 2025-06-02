import Tournament from '../../models/Tournament';
import Player from '../../models/Player';
import Team from '../../models/Team';
import Game from '../../models/Game';
import {
  addPlayerTeam,
  calculateElo,
  createTeam
} from '../teams/teamController';

// create tournament
export const createTournament = (tournamentName: string, adminId: string) => {
  const tournament = Tournament.create({
    name: tournamentName,
    teams: [],
    admin: adminId
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

export const addTeam = async (
  tournamentId: string,
  playerId: string,
  playerName: string
) => {
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

  const team = await createTeam(playerId, playerName);

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
export const startTournament = async (tournamentId: string) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) throw new Error('404 Tournament not found');

  // Get all teams and sort by seed
  const teams = await Promise.all(
    tournament.teams.map(async (teamId) => {
      const team = await Team.findById(teamId);
      if (!team) throw new Error(`Team ${teamId} not found`);
      return team;
    })
  );

  const sortedTeams = teams.sort((a, b) => a.seed - b.seed);
  const numTeams = sortedTeams.length;

  // Find closest power of 2
  const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(numTeams)));
  const numByes = nextPowerOf2 - numTeams;

  // Initialize first round matches
  const firstRoundMatches = [];

  // Assign byes to top seeds
  for (let i = 0; i < numByes; i++) {
    const team = sortedTeams[i];
    const players = await Promise.all(
      team.players.map(async (playerId) => {
        const player = await Player.findById(playerId);
        if (!player) throw new Error(`Player ${playerId} not found`);
        return player;
      })
    );

    // Create a game for the bye
    const game = await Game.create({
      players: players.map((player) => ({ player, team: null })),
      winner: 'LEFT' // Automatically set winner for bye
    });

    firstRoundMatches.push({
      team1: team._id.toString(),
      team2: null,
      winner: team._id.toString(),
      bye: true,
      gameId: game.id
    });
  }

  // Create remaining matches
  const remainingTeams = sortedTeams.slice(numByes);
  const numMatches = remainingTeams.length / 2;

  for (let i = 0; i < numMatches; i++) {
    const team1 = remainingTeams[i];
    const team2 = remainingTeams[remainingTeams.length - 1 - i];

    // Get players from both teams
    const [team1Players, team2Players] = await Promise.all([
      Promise.all(
        team1.players.map(async (playerId) => {
          const player = await Player.findById(playerId);
          if (!player) throw new Error(`Player ${playerId} not found`);
          return player;
        })
      ),
      Promise.all(
        team2.players.map(async (playerId) => {
          const player = await Player.findById(playerId);
          if (!player) throw new Error(`Player ${playerId} not found`);
          return player;
        })
      )
    ]);

    // Create a game for the match
    const game = await Game.create({
      players: [
        ...team1Players.map((player) => ({ player, team: 'LEFT' })),
        ...team2Players.map((player) => ({ player, team: 'RIGHT' }))
      ],
      winner: null
    });

    firstRoundMatches.push({
      team1: team1._id.toString(),
      team2: team2._id.toString(),
      winner: null,
      bye: false,
      gameId: game.id
    });
  }

  // Initialize tournament bracket
  tournament.bracket = [
    {
      round: 1,
      matches: firstRoundMatches
    }
  ];

  tournament.status = 'IN_PROGRESS';
  tournament.currentRound = 1;

  await tournament.save();
  return tournament;
};

// end tournament

// get all teams in tournament
export const getAllTeams = async (tournamentId: string) => {
  const tournament = await Tournament.findById(tournamentId);

  if (!tournament) throw new Error('404 Tournament not found');

  return tournament.teams;
};

export const getTeam = async (teamId: string) => {
  const team = await Team.findById(teamId);
  if (!team) throw new Error('404 Team not found');
  return team;
};

export const updateMatchWinner = async (
  tournamentId: string,
  matchId: string,
  side: 'LEFT' | 'RIGHT'
) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) throw new Error('404 Tournament not found');

  let foundMatch = null;
  for (const round of tournament.bracket) {
    const match = round.matches.find((match) => {
      return match._id.toString() === matchId;
    });
    if (match) {
      foundMatch = match;
      break;
    }
  }
  if (!foundMatch) throw new Error('404 Match not found');

  if (side === 'LEFT') {
    foundMatch.winner = 'LEFT';
    console.log(foundMatch);
    console.log('winner');
  } else {
    foundMatch.winner = 'RIGHT';
  }

  await tournament.save();
  return tournament;
};
