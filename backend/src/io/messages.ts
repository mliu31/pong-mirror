import io from '.';
import { IPlayer } from '../models/Player';
import { IOEvent, IOInviteEvent, IONotificationEvent } from './messageTypes';

const ioMessagePlayer = <T extends IOEvent>(
  player: IPlayer | { _id: string },
  event: T['title'],
  data: T['data']
) => io.to(player._id.toString()).emit(event, data);

export const notifyPlayer = (
  player: IPlayer | { _id: string },
  data: IONotificationEvent['data']
) => {
  ioMessagePlayer(player, 'notification', data);
};

export const invitePlayer = (
  player: IPlayer | { _id: string },
  data: IOInviteEvent['data']
) => {
  ioMessagePlayer(player, 'invite', data);
};
