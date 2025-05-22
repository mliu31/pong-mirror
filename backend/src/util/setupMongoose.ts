// if we can't connect to the database, exit immediately - don't let Express start listening.

import mongoose from 'mongoose';
import env from './env';

// this handler must be registered before calling mongoose.connect.
mongoose.connection.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

export default await mongoose.connect(env.MONGODB_URI);
