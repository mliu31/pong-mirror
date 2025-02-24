import express from 'express';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import gamesRouter from './routes/gamesRouter';
import playersRouter from './routes/playersRouter';

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

app.get('/', async (_, res) => {
  res.send(`Hello World!`);
});

app.use('/games', gamesRouter);

app.use('/players', playersRouter);

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
