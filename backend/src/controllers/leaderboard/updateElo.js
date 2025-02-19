// Controller for updating the elo score
import express from 'express';
import Player from '../models/Player.ts';
import mongoose from 'mongoose';
import Game from '../models/Game.ts';

const app = express();

app.use(express.json());

const mongoURI =
  'mongodb+srv://ethan:ethancs98@cluster1.20kz5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    // eslint-disable-next-line no-undef
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    // eslint-disable-next-line no-undef
    console.error('MongoDB connection error:', err);
  });
// need to get color instead of playerId
// get the winners from the players
// get the losers from the players that didn't win
export const updateElo = async (winningColor, gameId) => {
  if (!winningColor || !gameId) {
    return { status: 400, message: 'Invalid parameters provided.' };
  }
  const foundGame = await Game.findbyId(gameId);
  // array of winning players
  const winningPlayers = foundGame.players.filter(
    (player) => player.team === winningColor
  );
  // array of losing players
  const losingPlayers = foundGame.players.filter(
    (player) => player.team != winningColor
  );

  try {
    const addElo = 
      { $inc: {elo: 1} };
    const subtractElo = 
      { $inc: {elo: -1 }};

    // iterate over winning players --> increment elo by 1
    for (let i = 0; i < winningPlayers.length, i++){
      const updatedWonPlayer = await Player.findByIdAndUpdate(winningPlayers[i].player.id, addElo);
    }

    // iterate over losing players --> decrement elo by 1
    for (let j = 0; i < winningPlayers.length, j++){
      const updatedLostPlayer = await Player.findByIdAndUpdate(losingPlayers[i].player.id, subtractElo);
    }
  
    return { status: 200, updatedPlayer };
  } catch (error) {
    // eslint-disable-next-line no-undef
    console.error(error);
    return { status: 500, message: 'Internal Server Error' };
  }
};
