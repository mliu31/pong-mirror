import INVITE, { InviteValue } from '../../constants/INVITE';
import { invitePlayer } from '../../io/messages';
import Game from '../../models/Game';
import Invite from '../../models/Invite';
import Player from '../../models/Player';

export const invitePlayers = async (gameid: string, pids: string[]) => {
  // find game
  const game = await Game.findById(gameid);
  if (!game) {
    throw new Error('Game not found');
  }

  // find preexisting invites
  const existingInvites = await Invite.find({
    gameId: gameid,
    playerId: { $in: pids }
  });

  const existingPlayerIds = new Set(
    existingInvites.map((invite) => invite.playerId.toString())
  );

  // clear previous invites that don't match existing invite
  await Invite.deleteMany({ gameId: gameid, playerId: { $nin: pids } });

  // bulk-create new invites
  const docs = [];
  for (const pid of pids) {
    if (!existingPlayerIds.has(pid)) {
      const player = await Player.findById(pid);
      if (!player) {
        throw new Error(`Invalid player ID: ${pid}`);
      }
      docs.push({
        gameId: gameid,
        playerId: pid
      });
      const captain = await Player.findById(game.captain);
      invitePlayer(player, { captainName: captain?.name ?? 'A player' });
    }
  }
  await Invite.insertMany(docs);
};

export const getGameInvites = async (gameid: string) =>
  await Invite.find({ gameId: gameid });

export const getPlayerInvites = async (pid: string) => {
  const invites = await Invite.find({ playerId: pid, status: INVITE.PENDING })
    .populate({
      path: 'gameId',
      populate: { path: 'captain', model: 'Player' }
    })
    .exec();
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
