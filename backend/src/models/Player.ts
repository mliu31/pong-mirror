import mongoose from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  email: string;
  friends: string[];
  elo: number;
  rank: number;
}

const playerSchema = new mongoose.Schema<IPlayer>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
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
  },
  rank: {
    type: Number
  }
});

export default mongoose.model<IPlayer>('Player', playerSchema);
