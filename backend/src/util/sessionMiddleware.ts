import session from 'express-session';
import env from './env';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import './setupMongoose.ts';

export default session({
  secret: env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({
    clientPromise: Promise.resolve(mongoose.connection.getClient())
  })
});
