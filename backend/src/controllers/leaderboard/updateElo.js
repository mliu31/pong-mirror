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

export const updateElo = async (playerId, gameId) => {
  if (!playerId || !gameId) {
    return { status: 400, message: 'Invalid parameters provided.' };
  }
  const foundPlayer = await Player.findById(playerId);

  const foundGame = await Game.findbyId(gameId);

  try {
    const eloUpdate =
      foundPlayer.team === foundGame.winner
        ? { $inc: { elo: 1 } }
        : { $inc: { elo: -1 } };
    const updatedPlayer = await Player.findByIdAndUpdate(playerId, eloUpdate, {
      new: true
    });
    if (!updatedPlayer) {
      return { status: 404, message: 'Player Not Found' };
    }
    return { status: 200, updatedPlayer };
  } catch (error) {
    // eslint-disable-next-line no-undef
    console.error(error);
    return { status: 500, message: 'Internal Server Error' };
  }
};
