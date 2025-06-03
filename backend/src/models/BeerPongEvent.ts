import mongoose from 'mongoose';

export interface IBeerPongEvent extends Document {
  _id: string;
  gameId: mongoose.Types.ObjectId;
  playerId: mongoose.Types.ObjectId;
  playerName: string;
  playerLetter: string; // A, B, C, D
  team: 'red' | 'blue';
  action: 'serve' | 'rally' | 'hit' | 'sink';
  timestamp: Date;
  gameState: {
    red_full: number;
    red_half: number;
    red_empty: number;
    blue_full: number;
    blue_half: number;
    blue_empty: number;
  };
  commentary?: string;
  commentator?: string;
}

const beerPongEventSchema = new mongoose.Schema<IBeerPongEvent>(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      index: true
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    },
    playerName: {
      type: String,
      required: true
    },
    playerLetter: {
      type: String,
      required: true,
      enum: ['A', 'B', 'C', 'D']
    },
    team: {
      type: String,
      required: true,
      enum: ['red', 'blue']
    },
    action: {
      type: String,
      required: true,
      enum: ['serve', 'rally', 'hit', 'sink']
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    },
    gameState: {
      red_full: { type: Number, required: true },
      red_half: { type: Number, required: true },
      red_empty: { type: Number, required: true },
      blue_full: { type: Number, required: true },
      blue_half: { type: Number, required: true },
      blue_empty: { type: Number, required: true }
    },
    commentary: {
      type: String,
      default: null
    },
    commentator: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying
beerPongEventSchema.index({ gameId: 1, timestamp: 1 });

export default mongoose.model<IBeerPongEvent>(
  'BeerPongEvent',
  beerPongEventSchema
);
