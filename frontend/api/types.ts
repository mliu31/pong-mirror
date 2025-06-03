import { InviteValue } from '@/constants/INVITE';
import { TeamValue } from '@/constants/TEAM';

export interface IGame {
  _id: string;
  players: {
    player: IPlayer;
    team: TeamValue;
    oldElo: number;
    newElo: number;
  }[];
  captain: IPlayer;
  winner: TeamValue;
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
  _id: string;
  gameId: IGame;
  playerId: IPlayer;
  status: InviteValue;
  createdAt: Date;
  respondedAt: Date | null;
}

export interface IGroup {
  _id: string;
  name: string;
  members: string[];
}
