import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import Game from './models/Game';
import authRoutes from './routes/auth.js';

// if we can't connect to the database, exit immediately - don't let Express start listening.
// this handler must be registered before calling mongoose.connect.
mongoose.connection.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

await mongoose.connect(env.MONGODB_URI);

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json());

declare module 'express-session' {
  interface SessionData {
    player: { id: string; email: string; username: string };
  }
}

const key = process.env.SECRET_KEY;

if (!key) {
  throw new Error('SECRET_KEY is not set');
}

app.use(
  session({
    secret: key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.get('/', async (_, res) => {
  res.send(`Hello World!`);
});

app.use('./auth', authRoutes);

app.post('/games', async (req, res) => {
  if (!req.session.player) {
    return void res.status(401).json({ message: 'Not authenticated' });
  }

  const game = await Game.create({ players: [req.session.player] }); // TODO: the logged in user should be added to the players array
  res.json({ id: game._id });
});

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
