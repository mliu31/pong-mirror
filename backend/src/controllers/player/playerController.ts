import Player from '../../models/Player';

// A function to create a new player with a unique userID
export const newPlayer = async (name: string, email: string) => {
  const existingPlayer = await Player.findOne({ email });
  if (existingPlayer) {
    throw new Error('Player already exists');
  }

  // TODO: switch to using Mongo ids
  const lastPlayer = await Player.findOne().sort({ userID: -1 });
  let newPlayerID = 1;
  if (lastPlayer) {
    newPlayerID = lastPlayer.userID + 1;
  }

  const newPlayer = new Player({
    userID: newPlayerID,
    name: name,
    email: email,
    friends: [],
    elo: 1000, // default TODO: default? read from playe rmodel
    rank: 0 // start
  });

  await newPlayer.save();
  return newPlayer;
};

export const getAllPlayers = () => Player.find();

export const getPlayer = (pid: string) => Player.findById(pid);

// export const getFriends = (pid: string) => {
//   const toReturn = Player.findById(pid);
//   return toReturn.friends;
// };
