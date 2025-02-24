import { TeamValue } from '@/constants/TEAM';

export interface Game {
  _id: string;
  players: {
    player: {
      _id: string;
      name: string;
      email: string;
    };
    team: TeamValue;
  }[];
}
