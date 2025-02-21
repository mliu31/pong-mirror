import express from 'express';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import gamesRouter from './routes/gamesRouter';
import { getAllPlayers } from './controllers/player/playerController';

void Player;

mongoose.connect(env.MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (_, res) => {
  res.send(
    `Hello World!<br><br>Database connection status: ${
      mongoose.connection.readyState === 1 ? 'successful' : 'unsuccessful'
    }`
  );
});

app.use('/games', gamesRouter);

app.get('/players', async (_, res) => {
  res.json(await getAllPlayers());
});

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});
