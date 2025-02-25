import mongoose from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  email: string;
  friends: string[];
  elo: number;
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
    type: Number
  },
  friends: {
    type: [String]
  }
});

export default mongoose.model<IPlayer>('Player', playerSchema);
