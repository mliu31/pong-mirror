import mongoose from 'mongoose';
import TEAM from '../constants/TEAM';

const gameSchema = new mongoose.Schema({
  players: [
    {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      },
      team: {
        type: String,
        enum: Object.values(TEAM),
        default: null
      },
      oldElo: Number,
      newElo: Number
    }
  ],
  winner: {
    type: String,
    enum: Object.values(TEAM),
    default: null
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
    default: null
  },
  eloChanges: [
    {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
      },
      oldElo: {
        type: Number,
        required: true
      },
      newElo: {
        type: Number,
        required: true
      }
    }
  ],
  date: String
});

export default mongoose.model('Game', gameSchema);
