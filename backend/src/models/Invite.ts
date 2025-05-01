import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;
import INVITE from '../constants/INVITE';

const inviteSchema = new Schema({
  gameId: {
    type: Types.ObjectId,
    ref: 'Game',
    required: true,
    index: true // for fast captain-side lookups
  },
  playerId: {
    type: Types.ObjectId,
    ref: 'Player',
    required: true,
    index: true // part of the compound below
  },
  status: {
    type: String,
    enum: Object.values(INVITE),
    default: INVITE.PENDING,
    index: true
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  respondedAt: {
    type: Date,
    default: null
  }
});

export default model('Invite', inviteSchema);
