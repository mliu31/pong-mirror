import mongoose from 'mongoose';

export interface IPlayer extends Document {
  // userID: number;
  name: string;
  email: string;
  friends: string[];
  elo: number;
  rank: number;
  groups: string[];
  gamesPlayed: number;
  wins: number;
  googleID: string;
}

const playerSchema = new mongoose.Schema<IPlayer>({
  // userID: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  //   unique: true
  // },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  rank: {
    type: Number,
    required: false // TODO: set required: true and fix issues
  },
  elo: {
    type: Number,
    required: true,
    default: 1200
  },
  friends: {
    type: [String],
    required: true,
    default: []
  },
  groups: {
    type: [String],
    required: true,
    default: []
  },
  gamesPlayed: {
    type: Number,
    required: true,
    default: 0
  },
  wins: {
    type: Number,
    required: true,
    default: 0
  },
  googleID: {
    type: String,
    required: false
  }
});

export default mongoose.model<IPlayer>('Player', playerSchema);
