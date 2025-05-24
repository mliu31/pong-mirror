import mongoose from 'mongoose';
import TEAM from '../constants/TEAM';

export interface IGame extends mongoose.Document {
  players: {
    player: mongoose.Types.ObjectId;
    team: 'LEFT' | 'RIGHT' | null;
  }[];
  winner: 'LEFT' | 'RIGHT' | null;
}

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
      }
    }
  ],
  winner: {
    type: String,
    enum: ['LEFT', 'RIGHT', null],
    default: null
  }
});

export default mongoose.model<IGame>('Game', gameSchema);
