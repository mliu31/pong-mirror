import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AutoIncrement = require('mongoose-sequence')(mongoose);

export interface IGroup extends Document {
  name: string;
  members: string[];
}

const groupSchema = new mongoose.Schema<IGroup>({
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

export default mongoose.model<IGroup>('Group', groupSchema);
