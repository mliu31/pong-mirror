// // Controller for updating the elo score
// import Player from '../models/Player.ts';
// import mongoose from 'mongoose';
// import Game from '../models/Game.ts';

// // in req, we're sending winning color and game

// const updateElo = async (req, res) => {
//   const { id } = req.params

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({error: 'no such player'})
//   }

//   const foundGame = await Game.findById(id);

//   // array of winning players
//   const winningPlayers = foundGame.players.filter(
//     (player) => player.team === winningColor
//   );

//   // array of losing players
//   const losingPlayers = foundGame.players.filter(
//     (player) => player.team != winningColor
//   );

//   // iterate over winning players --> increment elo by 1
//   for (let i = 0; i < (foundGame.players.filter(
//     (player) => player.team === winningColor
//   )).length, i++){
//     const updatedWonPlayer = await Player.findByIdAndUpdate({_id, winningPlayers: foundGame.players.filter(
//         (player) => player.team === winningColor
//       )[i].player.id},
//     { $inc: {elo: 1} }
//     )
//   }

//   for (let i = 0; i < (foundGame.players.filter(
//     (player) => player.team != winningColor
//   )).length, i++){
//     const updatedLostPlayer = await Player.findByIdAndUpdate({_id, losingPlayers: foundGame.players.filter(
//         (player) => player.team != winningColor
//       )[i].player.id},
//     { $inc: { elo: -1} }
//     )
//   }

//   const winnersThenLosers = winningPlayers.concat(losingPlayers);

//   res.status(200).json(winnersThenLosers);

// };

// export default updateElo;

import Player from '../../models/Player.ts';
import mongoose from 'mongoose';
import Game from '../../models/Game.ts';

const updateElo = async (req, res) => {
  try {
    const { gameId, winningColor } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(404).json({ error: 'No such player' });
    }

    const foundGame = await Game.findById(gameId);
    if (!foundGame) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Winning and losing players based on the winningColor
    const winningPlayers = foundGame.players.filter(
      (player) => player.team === winningColor
    );
    const losingPlayers = foundGame.players.filter(
      (player) => player.team !== winningColor
    );

    // Update ELO scores in parallel
    await Promise.all(
      winningPlayers.map((player) =>
        Player.findByIdAndUpdate(player.player.id, { $inc: { elo: 1 } })
      )
    );

    await Promise.all(
      losingPlayers.map((player) =>
        Player.findByIdAndUpdate(player.player.id, { $inc: { elo: -1 } })
      )
    );

    return res.status(200).json([...winningPlayers, ...losingPlayers]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default updateElo;
