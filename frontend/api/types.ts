export interface Game {
  _id: string;
  players: {
    player: Player;
    team: 'RED' | 'BLUE' | null;
  }[];
}

export interface Player {
  _id: string;
  name: string;
  email: string;
  friends: string[];
}
