import mongoose from 'mongoose';

export interface ITournament extends Document {
  name: string;
  teams: string[];
}

const tournamentSchema = new mongoose.Schema<ITournament>({
  name: {
    type: String,
    required: true
  },
  teams: {
    type: [String],
    default: [],
    required: true
  }
});

export default mongoose.model<ITournament>('Tournament', tournamentSchema);