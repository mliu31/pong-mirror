import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import Game from './models/Game';
import authRoutes from './routes/auth.js';

mongoose.connect(env.MONGODB_URI);

const app = express();

app.use(cors());

app.use(express.json());

declare module 'express-session' {
  interface SessionData {
    player: { id: string; email: string; username: string };
  }
}

app.use(
  session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
  })
);

app.get('/', async (_, res) => {
  res.send(
    `Hello World!<br><br>Database connection status: ${
      mongoose.connection.readyState === 1 ? 'successful' : 'unsuccessful'
    }`
  );
});

app.use('./auth', authRoutes);

app.post('/games', async (req, res) => {
  if (!req.session.player) {
    return void res.status(401).json({ message: 'Not authenticated'});
  }

  const game = await Game.create({ players: [req.session.player] }); // TODO: the logged in user should be added to the players array
  res.json({ id: game._id });
});

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});
