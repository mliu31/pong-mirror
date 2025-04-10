import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: {
    type: [String],
    default: [],
    required: true
  }
});

groupSchema.plugin(AutoIncrement, { inc_field: 'id' });

export default mongoose.model('Group', groupSchema);
