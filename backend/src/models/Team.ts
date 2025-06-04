import mongoose from 'mongoose';

export interface ITeam extends Document {
  elo: number;
  players: string[];
  seed: number;
  name: string;
}

const teamSchema = new mongoose.Schema<ITeam>({
  elo: {
    type: Number,
    required: true
  },
  players: {
    type: [String],
    default: [],
    required: true
  },
  seed: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

export default mongoose.model<ITeam>('Team', teamSchema);
