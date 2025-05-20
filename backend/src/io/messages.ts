import io from '.';
import { IPlayer } from '../models/Player';
import { IOMessage, IONotification } from './messageTypes';

const ioMessagePlayer = (player: IPlayer, message: IOMessage) =>
  io.to(player._id.toString()).emit(message.event, message.data);

export const notifyPlayer = (
  player: IPlayer,
  notification: IONotification['data']
) => {
  ioMessagePlayer(player, { event: 'notification', data: notification });
};
