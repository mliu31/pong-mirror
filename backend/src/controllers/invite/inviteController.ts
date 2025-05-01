import INVITE, { InviteValue } from '../../constants/INVITE';
import Game from '../../models/Game';
import Invite from '../../models/Invite';
import Player from '../../models/Player';

// PUT /games/:gameid/invite, pids in req body
export const invitePlayers = async (gameid: string, pids: string[]) => {
  const game = await Game.findById(gameid);
  if (!game) {
    throw new Error('Game not found');
  }

  await Invite.deleteMany({ gameId: gameid }); // clear previous invites for game

  // bulk-create new pending invites
  const docs = [];
  for (const pid of pids) {
    const player = await Player.findById(pid);
    if (!player) {
      throw new Error(`Invalid player ID: ${pid}`);
    }
    docs.push({
      gameId: gameid,
      playerId: pid
    });
  }
  await Invite.insertMany(docs);
};

// GET /games/:gameId/invite
export const getGameInvites = async (gameid: string) => {
  const invites = await Invite.find({ gameId: gameid });
  return invites;
};

export const getPlayerInvites = async (pid: string) => {
  const invites = await Invite.find({ playerId: pid, status: INVITE.PENDING });
  return invites;
};

export const setPlayerInvite = async (
  pid: string,
  gameid: string,
  decision: InviteValue
) => {
  const invite = await Invite.findOne({ playerId: pid, gameId: gameid });
  if (!invite) {
    throw new Error('Invite not found');
  }

  invite.status = decision;
  invite.respondedAt = new Date();
  await invite.save();
};
