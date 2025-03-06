import { RequestHandler } from 'express';
import Player from '../../models/Player';
// register a new player
export const registerPlayer: RequestHandler = async (req, res) => {
  try {
    const { name, email } = req.body;
    // check if the player already exists
    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
      res.status(400).json({ message: 'Player already exists' });
      return;
    }
    // create and save player
    const newPlayer = new Player({ name, email });
    await newPlayer.save();
    // respond with the created player details
    res.status(201).json({
      message: 'Player registered successfully',
      player: {
        id: newPlayer._id,
        name: newPlayer.name,
        email: newPlayer.email
      }
    });
  } catch (error) {
    console.error('Error registering player:', error);
    res.status(500).json({ message: 'Server error' });
  }
  return;
};
