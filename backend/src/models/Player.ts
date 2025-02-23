import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number
  }
});

export default mongoose.model('Player', playerSchema);
