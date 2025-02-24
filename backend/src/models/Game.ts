import mongoose from 'mongoose';
import TEAM from '../constants/team';

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
  ]
});

export default mongoose.model('Game', gameSchema);
