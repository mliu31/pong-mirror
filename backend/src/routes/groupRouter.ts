import {
  getGroup
  //   createGroup,
  //   joinGroup
} from '../controllers/group/groupController';
// import { getPlayer } from '../controllers/player/playerController';
import express from 'express';

const router = express.Router();

// GET request for groups
router.get('/:groupid', async (req, res) => {
  const group = await getGroup(req.params.groupid);
  return void res.json(group);
  //   try {
  //     const group = await getGroup(req.params.gid);
  //     return void res.json(group);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       res.status(500).json({ message: error.message });
  //     } else {
  //       res.status(404).json({ message: '404 Error group not found' });
  //     }
  //   }
});

// PUT request to create a group
// router.put('/addGroup/:pid/:groupName', async (req, res) => {
//   try {
//     const player = await getPlayer(req.params.pid);
//     try {
//       // put the group into the schema
//       createGroup(req.params.groupName, req.params.pid);
//       const group = await getGroup()
//       player?.groups.push(req.params.)
//     } catch (error) {
//       if (error instanceof Error) {
//         res.status(500).json({ message: error.message });
//       } else {
//         res.status(404).json({ message: '404 Error group not found' });
//       }
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: error.message });
//     } else {
//       res.status(404).json({ message: '404 Error player not found' });
//     }
//   }
// });

export default router;
