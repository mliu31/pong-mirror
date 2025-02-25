import axios, { Axios } from 'axios';

const sendElo = async (color: string, gameId: Number) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/games/updateElo/${gameId}`,
      {
        winningColor: color
      }
    );
    console.log('updated with:', response.data);
  } catch (error) {
    console.error('Error updating:', error);
  }
};

export default sendElo;
