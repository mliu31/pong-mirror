import Tournament from '../../models/Tournament';
import Player from '../../models/Player';
import Team from '../../models/Team';
import Game from '../../models/Game';
import {
  addPlayerTeam,
  calculateElo,
  createTeam
} from '../teams/teamController';
import mongoose from 'mongoose';

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

  await tournament.save();

  return team;
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
  const byeWinners = [];

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
      players: players.map((player) => ({ player, team: 'LEFT' })),
      winner: 'LEFT' // Automatically set winner for bye
    });

    const matchId = new mongoose.Types.ObjectId();
    firstRoundMatches.push({
      _id: matchId.toString(),
      team1: team._id.toString(),
      team2: null,
      winner: 'LEFT',
      bye: true,
      gameId: game.id
    });
    byeWinners.push(team._id.toString());
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

    const matchId = new mongoose.Types.ObjectId();
    firstRoundMatches.push({
      _id: matchId.toString(),
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

  // If we have byes, create the next round immediately
  if (byeWinners.length > 0) {
    const nextRoundMatches = [];
    const allWinners = [...byeWinners];

    // Create matches for the next round
    for (let i = 0; i < allWinners.length; i += 2) {
      const team1 = allWinners[i];
      const team2 = allWinners[i + 1] || null; // Handle odd number of teams

      // Create a game for the match
      const game = await Game.create({
        players: [], // Players will be added when the match is played
        winner: null
      });

      const matchId = new mongoose.Types.ObjectId();
      nextRoundMatches.push({
        _id: matchId.toString(),
        team1,
        team2,
        winner: null as 'LEFT' | 'RIGHT' | null,
        bye: !team2,
        gameId: game.id.toString()
      });
    }

    // Add the next round to the bracket
    tournament.bracket.push({
      round: 2,
      matches: nextRoundMatches
    });

    tournament.currentRound = 2;
  } else {
    tournament.currentRound = 1;
  }

  tournament.status = 'IN_PROGRESS';
  await tournament.save();
  return tournament;
};

// end tournament
export const endTournament = async (tournamentId: string) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) throw new Error('404 Tournament not found');

  // Allow ending if tournament is pending or in progress
  if (tournament.status !== 'PENDING' && tournament.status !== 'IN_PROGRESS') {
    throw new Error('Tournament must be pending or in progress to end it');
  }

  // Update tournament status to completed
  tournament.status = 'COMPLETED';
  await tournament.save();

  return tournament;
};

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
  let currentRoundIndex = -1;
  let currentMatchIndex = -1;

  // Find the match and its position in the bracket
  for (let i = 0; i < tournament.bracket.length; i++) {
    const round = tournament.bracket[i];
    const matchIndex = round.matches.findIndex(
      (match) => match._id.toString() === matchId
    );
    if (matchIndex !== -1) {
      foundMatch = round.matches[matchIndex];
      currentRoundIndex = i;
      currentMatchIndex = matchIndex;
      break;
    }
  }

  if (!foundMatch) throw new Error('404 Match not found');

  // Set the winner
  foundMatch.winner = side;

  // Check if this is the last match of the current round
  const currentRound = tournament.bracket[currentRoundIndex];
  const isLastMatchOfRound =
    currentMatchIndex === currentRound.matches.length - 1;

  // If this is the last match of the round, create the next round
  if (isLastMatchOfRound) {
    const nextRoundNumber = currentRound.round + 1;
    const winners = currentRound.matches
      .map((match) => {
        if (match.winner === 'LEFT') return match.team1;
        if (match.winner === 'RIGHT') return match.team2;
        return null;
      })
      .filter(Boolean);

    // If there's only one winner left, the tournament is complete
    if (winners.length === 1) {
      tournament.status = 'COMPLETED';
      tournament.currentRound = nextRoundNumber;
    } else {
      // Create matches for the next round
      const nextRoundMatches = [];
      for (let i = 0; i < winners.length; i += 2) {
        const team1 = winners[i];
        const team2 = winners[i + 1] || null; // Handle odd number of teams

        // Create a game for the match
        const game = await Game.create({
          players: [], // Players will be added when the match is played
          winner: null
        });

        const matchId = new mongoose.Types.ObjectId();
        nextRoundMatches.push({
          _id: matchId.toString(),
          team1,
          team2,
          winner: null as 'LEFT' | 'RIGHT' | null,
          bye: !team2,
          gameId: game.id.toString()
        });
      }

      // Add the next round to the bracket
      tournament.bracket.push({
        round: nextRoundNumber,
        matches: nextRoundMatches
      });

      tournament.currentRound = nextRoundNumber;
    }
  }

  await tournament.save();
  return tournament;
};

// leave team
export const leaveTeam = async (
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

  // Check if player is in the team
  if (!team.players.includes(playerId)) {
    throw new Error('Player is not in this team');
  }

  // If player is the only member, delete the team
  if (team.players.length === 1) {
    // Remove team from tournament
    const teamIndex = tournament.teams.indexOf(teamId);
    if (teamIndex > -1) {
      tournament.teams.splice(teamIndex, 1);
    }
    // Reseed remaining teams
    await reseedTeams(tournamentId);

    await tournament.save();
    return { message: 'Team deleted' };
  }

  // Otherwise, just remove the player from the team
  team.players = team.players.filter((id) => id !== playerId);
  await team.save();

  // Reseed teams after player removal
  await reseedTeams(tournamentId);

  return team;
};
