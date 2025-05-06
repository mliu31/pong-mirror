import { InviteValue } from '@/constants/INVITE';
import { TeamValue } from '@/constants/TEAM';

export interface IGame {
  _id: string;
  players: {
    player: IPlayer;
    team: TeamValue;
  }[];
  captain: IPlayer;
}

export interface IPlayer {
  _id: string;
  name: string;
  email: string;
  friends: string[];
  elo: number;
  rank: number;
  groups: string[];
  gamesPlayed: number;
  wins: number;
}

export interface IInvite {
  gameId: string;
  playerId: string;
  status: InviteValue;
  createdAt: Date;
  respondedAt: Date | null;
}
