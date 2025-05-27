import Game from '../../models/Game';
import Player /*, { IPlayer } */ from '../../models/Player';
// import { Types } from 'mongoose';

const getKFactor = (playerElo: number): number => {
  if (playerElo < 1500) {
    return 32; // Newer/lower-rated players get bigger adjustments
  } else if (playerElo < 2000) {
    return 24; // Mid-level players get moderate adjustments
  } else {
    return 16; // High-rated players get smaller adjustments
  }
};

export const updateElo = async (gameid: string, winner: string) => {
  try {
    const foundGame = await Game.findById(gameid);
    if (!foundGame) {
      throw new Error('404 Game not found');
    }

    // Find player ids
    const allPlayers = foundGame.players.map((player) => player._id);
    const winningPlayers = foundGame.players.filter(
      (player) => player.team === winner
    );
    const losingPlayers = foundGame.players.filter(
      (player) => player.team !== winner
    );

    // Fetch player objects
    const allPlayersDoc = await Player.find({ _id: { $in: allPlayers } });
    const winningPlayerDocs = await Player.find({
      _id: { $in: winningPlayers.map((p) => p.player) }
    });
    const losingPlayerDocs = await Player.find({
      _id: { $in: losingPlayers.map((p) => p.player) }
    });

    // Calculate average Elo for each team using the full player documents
    const avgWinnerElo =
      winningPlayerDocs.reduce((sum, p) => sum + p.elo, 0) /
      winningPlayerDocs.length;
    const avgLoserElo =
      losingPlayerDocs.reduce((sum, p) => sum + p.elo, 0) /
      losingPlayerDocs.length;

    // Calculate K-factors for each team (average)
    const avgWinnerK =
      winningPlayerDocs.reduce((sum, p) => sum + getKFactor(p.elo), 0) /
      winningPlayerDocs.length;
    const avgLoserK =
      losingPlayerDocs.reduce((sum, p) => sum + getKFactor(p.elo), 0) /
      losingPlayerDocs.length;

    // Calculate expected scores
    const expectedScoreWinner =
      1 / (1 + Math.pow(10, (avgLoserElo - avgWinnerElo) / 400));
    const expectedScoreLoser = 1 - expectedScoreWinner;

    // Calculate Elo changes using the K-factors
    const winnerEloChange = Math.round(avgWinnerK * (1 - expectedScoreWinner));
    const loserEloChange = Math.round(avgLoserK * (0 - expectedScoreLoser));

    // Update ELO scores in parallel
    const updatedWinners = await Promise.all(
      winningPlayers.map(async (player) => {
        const oldElo = player.oldElo ?? 1200; // TODO: should not need 1200 here
        const newElo = oldElo + winnerEloChange;

        await Player.findByIdAndUpdate(player.player, {
          $inc: { wins: 1, gamesPlayed: 1 },
          $set: { elo: newElo }
        });
        // console.log(`${player.player}: ${oldElo} → ${newElo}`);
        return {
          player: player.player,
          team: player.team,
          oldElo,
          newElo,
          eloHistory: [
            {
              elo: newElo,
              date: new Date()
            }
          ]
        };
      })
    );
    const updatedLosers = await Promise.all(
      losingPlayers.map(async (player) => {
        const oldElo = player.oldElo ?? 1200;
        const newElo = oldElo + loserEloChange;

        await Player.findByIdAndUpdate(player.player, {
          $inc: { gamesPlayed: 1 },
          $set: { elo: newElo }
        });
        // console.log(`${player.player}: ${oldElo} → ${newElo}`);
        return {
          player: player.player,
          team: player.team,
          oldElo,
          newElo,
          eloHistory: [
            {
              elo: newElo,
              date: new Date()
            }
          ]
        };
      })
    );
    foundGame.set('players', [...updatedWinners, ...updatedLosers]);

    await foundGame.save();
    return allPlayersDoc;
  } catch (error) {
    throw new Error('Internal server error: ' + error);
  }
};
