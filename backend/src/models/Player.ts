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
  friends: {
    type: [String]
  }
});

export default mongoose.model('Player', playerSchema);
