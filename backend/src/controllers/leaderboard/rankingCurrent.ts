// Maintains current state of leaderboard

// updateLeaderboard.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define the schema for leaderboard entries
const leaderboardSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  score: { type: Number, required: true },
  rank: { type: Number }
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

// Function to recalculate ranks for all users
async function updateRanks() {
  // Get all users sorted by score descending
  const users = await Leaderboard.find().sort({ score: -1 });
  // Update each user's rank (1-indexed)
  for (let i = 0; i < users.length; i++) {
    users[i].rank = i + 1;
    await users[i].save();
  }
  console.log('Leaderboard ranks updated.');
}

// Function to add a new user or update an existing user's score
async function upsertUser(userId, username, score) {
  await Leaderboard.findOneAndUpdate(
    { userId },
    { username, score },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  console.log(`User ${username} has been inserted/updated.`);
  // Update ranks after each change
  await updateRanks();
}

// Export the model and functions so they can be used elsewhere
module.exports = {
  Leaderboard,
  upsertUser,
  updateRanks
};
