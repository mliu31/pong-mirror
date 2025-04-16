import {
  getGroup,
  createGroup,
  joinGroup
} from '../controllers/group/groupController';
import { getPlayer } from '../controllers/player/playerController';
import express from 'express';
import Player from '../models/Player';
import Group from '../models/Group';

const router = express.Router();

// GET request for groups
router.get('/:groupid', async (req, res) => {
  try {
    const group = await getGroup(req.params.groupid);
    return void res.json(group);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(404).json({ message: '404 Error group not found' });
    }
  }
});

// PUT request to create a group
router.put('/addGroup/:pid/:groupName', async (req, res) => {
  try {
    Player.findById(req.params.pid);
    try {
      // put the group into the schema
      const group = await createGroup(req.params.groupName, req.params.pid);
      // put the group into the player
      try {
        const groupId = group._id.toString();
        await joinGroup(req.params.pid, groupId);
        return void res.json(group);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(404).json({ message: '404 Error group not found' });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(404).json({ message: '404 Error group not found' });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(404).json({ message: '404 Error player not found' });
    }
  }
});

// join group

router.patch('/addPlayer/:groupId/:playerId', async (req, res) => {
  try {
    // find the player
    Player.findById(req.params.playerId);
    try {
      const group = await getGroup(req.params.groupId);
      console.log(group);
      return void res.json(group);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(404).json({ message: '404 Error player not found' });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(404).json({ message: '404 Error player not found' });
    }
  }
});

export default router;
