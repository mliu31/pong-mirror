import mongoose from 'mongoose';

export interface IPlayer extends Document {
  userID: number;
  name: string;
  email: string;
  friends: string[];
  elo: number;
  rank: number;
  score: number;
}

const playerSchema = new mongoose.Schema<IPlayer>({
  userID: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    required: true,
    unique: true
  },
  elo: {
    type: Number,
    required: true,
    default: 1000
  },
  friends: {
    type: [String],
    required: true
  }
});

export default mongoose.model<IPlayer>('Player', playerSchema);
