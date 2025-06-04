import {
  getGroup,
  createGroup,
  joinGroup,
  leaveGroup,
  deleteGroup
} from '../controllers/group/groupController';
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

// GET all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
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
      const group = await joinGroup(req.params.playerId, req.params.groupId);
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

router.patch('/removePlayer/:groupId/:playerId', async (req, res) => {
  try {
    Player.findById(req.params.playerId);

    try {
      Group.findById(req.params.groupId);

      try {
        const group = await leaveGroup(req.params.playerId, req.params.groupId);
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
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(404).json({ message: '404 Error player not found' });
    }
  }
});

router.delete('/deleteGroup/:groupId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (group == null) throw new Error('404 Group not found');
    const deleted = deleteGroup(req.params.groupId);
    return void res.json(deleted);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(404).json({ message: '404 Error Group not found' });
    }
  }
});

export default router;
