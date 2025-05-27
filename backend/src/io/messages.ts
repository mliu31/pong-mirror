import io from '.';
import { IPlayer } from '../models/Player';
import { IOEvent, IONotificationEvent } from './messageTypes';

const ioMessagePlayer = <T extends IOEvent>(
  player: IPlayer,
  event: T['title'],
  data: T['data']
) => io.to(player._id.toString()).emit(event, data);

export const notifyPlayer = (
  player: IPlayer,
  data: IONotificationEvent['data']
) => {
  ioMessagePlayer(player, 'notification', data);
};
