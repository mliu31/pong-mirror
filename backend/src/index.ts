import express from 'express';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import Game from './models/Game';
import Player from './models/Player';

void Player;

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

app.put('/games/:gameid/players/:pid/team/:team', async (req, res) => {
  const { gameid, pid, team } = req.params;
  try {
    const game = await Game.findById(gameid);

    if (!game) {
      res.status(404).send({ message: 'Game not found' });
      return;
    }

    const player = game.players.find((playerTeamEntry) =>
      playerTeamEntry.player._id.equals(pid)
    );
    if (!player) {
      res.status(404).send({ message: 'Player not found' });
      return;
    }
    if (team === 'RED' || team === 'BLUE' || team === null) {
      player.team = team;
    } else {
      res.status(400).send({ message: 'Invalid team value' });
      return;
    }
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
    return;
  }
});
