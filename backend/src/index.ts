import express from 'express';
import mongoose from 'mongoose';
import env from './env';

mongoose.connect(env.MONGODB_URI);

const app = express();

app.get('/', async (_, res) => {
  res.send(
    `Hello World!<br><br>Database connection status: ${
      mongoose.connection.readyState === 1 ? 'successful' : 'unsuccessful'
    }`
  );
});

app.listen(env.PORT, () => {
  console.log(`Example app listening on port ${env.PORT}`);
});
