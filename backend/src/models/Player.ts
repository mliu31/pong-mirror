import mongoose, { Document, ObjectId } from 'mongoose';

export interface IPlayer extends Document<ObjectId> {
  name: string; // TODO: customize name from profile page
  email: string;
  friends: string[];
  elo: number;
  rank: number;
  groups: string[];
  gamesPlayed: number;
  wins: number;
  googleID: string;
  eloHistory: { elo: number; date: Date }[];
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
  rank: {
    type: Number,
    required: true,
    default: 0 // call updateRanks() immediately after creating a new player
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
    required: true
  },
  eloHistory: {
    type: [
      {
        elo: { type: Number, required: true, default: 1200 },
        date: { type: Date, required: true }
      }
    ],
    default: []
  }
});

export default mongoose.model<IPlayer>('Player', playerSchema);
