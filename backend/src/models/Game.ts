import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  players: {
    type: Array,
    required: true
  }
});

export default mongoose.model('Game', gameSchema);
