import express from 'express';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import Game from './models/Game';
import Player from './models/Player';

Player;

mongoose.connect(env.MONGODB_URI);

const app = express();

app.use(cors());

app.get('/', async (_, res) => {
  res.send(
    `Hello World!<br><br>Database connection status: ${
      mongoose.connection.readyState === 1 ? 'successful' : 'unsuccessful'
    }`
  );
});

app.post('/games', async (_, res) => {
  const game = await Game.create({ players: [] }); // TODO: the logged in user should be added to the players array
  res.json({ id: game._id });
});

app.get('/games/:gameid', async (req, res) => {
  const game = await Game.findById(req.params.gameid).populate(
    'players.player'
  );
  res.json(game);
});

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});
