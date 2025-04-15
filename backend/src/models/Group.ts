import mongoose from 'mongoose';

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

export default mongoose.model<IGroup>('Group', groupSchema);
