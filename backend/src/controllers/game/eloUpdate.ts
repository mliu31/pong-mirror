import Game from '../../models/Game';
import Player /*, { IPlayer } */ from '../../models/Player';

const getKFactor = (playerElo: number): number => {
  if (playerElo < 1500) {
    return 32; // Newer/lower-rated players get bigger adjustments
  } else if (playerElo < 2000) {
    return 24; // Mid-level players get moderate adjustments
  } else {
    return 16; // High-rated players get smaller adjustments
  }
};

export const updateElo = async (gameid: string, winningColor: string) => {
  try {
    const foundGame = await Game.findById(gameid);
    if (!foundGame) {
      throw new Error('404 Game not found');
    }

    if (winningColor === 'RED' || winningColor === 'BLUE') {
      foundGame.winner = winningColor;
      await foundGame.save();
    } else {
      throw new Error('Invalid winning color');
    }

    // Find player ids
    const winningPlayers = foundGame.players.filter(
      (player) => player.team === winningColor
    );
    const losingPlayers = foundGame.players.filter(
      (player) => player.team !== winningColor
    );

    // Fetch player objects
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
    await Promise.all(
      winningPlayers.map((player) =>
        Player.findByIdAndUpdate(player.player, {
          $inc: { elo: winnerEloChange, wins: 1, gamesPlayed: 1 }
        })
      )
    );

    await Promise.all(
      losingPlayers.map((player) =>
        Player.findByIdAndUpdate(player.player, {
          $inc: { elo: loserEloChange, gamesPlayed: 1 }
        })
      )
    );

    const allPlayers = foundGame.players.map((player) => player._id);
    return Player.find({ _id: { $in: allPlayers } });
  } catch (error) {
    throw new Error('Internal server error: ' + error);
  }
};
