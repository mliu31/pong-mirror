import { TeamValue } from '@/constants/TEAM';

export interface Game {
  _id: string;
  players: {
    player: Player;
    team: TeamValue;
  }[];
}

export interface Player {
  _id: string;
  name: string;
  email: string;
  friends: string[];
  elo: number;
}
