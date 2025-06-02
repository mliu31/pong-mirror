import mongoose from 'mongoose';

export interface ITournament extends Document {
  name: string;
  admin: string;
  teams: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  currentRound: number;
  bracket: {
    round: number;
    matches: {
      _id: string;
      team1: string | null;
      team2: string | null;
      winner: string | null;
      bye: boolean;
      gameId: string;
    }[];
  }[];
}

const tournamentSchema = new mongoose.Schema<ITournament>({
  name: {
    type: String,
    required: true
  },
  admin: {
    type: String,
    required: true
  },
  teams: {
    type: [String],
    default: [],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING'
  },
  currentRound: {
    type: Number,
    default: 0
  },
  bracket: [
    {
      round: Number,
      matches: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true
          },
          team1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            default: null
          },
          team2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            default: null
          },
          winner: {
            type: mongoose.Schema.Types.String,
            ref: 'Team',
            default: null
          },
          bye: {
            type: Boolean,
            default: false
          },
          gameId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game',
            required: true
          }
        }
      ]
    }
  ]
});

export default mongoose.model<ITournament>('Tournament', tournamentSchema);
