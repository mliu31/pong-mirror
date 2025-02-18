// Controller for updating the elo score

import Player from '../models/Player.ts';
const app = express();


// this needs to:
// take in player ID
// get the game ID -->
// update the elo of the player that's been sent over.

const updateElo = async (playerID, gameID) => {
    try{
        const response = await axios.put('game/' + gameID, playerID,
            {
                headers: {
                    "Content-Type": "application/json"
                },
            }
        )
    }

    find
    
}

axios.get("Whatever the URL Is").then( response => {
    console.log(response.data);
});

app.post('path/to/API', (req, res) => {
  const playerID = parseInt(req.playerID);
  const gameID = parseInt(req.gameID);

  if (!playerID) {
    return res.status(404).json({ message: 'player not found' });
  }

  if (!gameID) {
    return res.status(404).json({ message: 'player not found' });
  }

  
});
