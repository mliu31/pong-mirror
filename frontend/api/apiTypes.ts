export interface Game {
  _id: string;
  players: {
    player: {
      _id: string;
      name: string;
      email: string;
    };
    team: 'RED' | 'BLUE' | null;
  }[];
}
