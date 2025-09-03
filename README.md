# NEED1 - The Pong App

<!-- TODO: continue to update short project description, some sample screenshots or mockups -->
We created a mobile app that facilitates in-person connection through Dartmouth pong. 

Invite friends, host tournaments, view leaderboards, track performance with elo rating, and listen to AI commentary. 

<img width="150" height="340" alt="Signup Page ft Google Auth" src="https://github.com/user-attachments/assets/69f93238-90fb-4191-8d05-dc198e2c2715" />
<img width="150" height="340" alt="Game Page" src="https://github.com/user-attachments/assets/36158222-a608-4d4d-86f6-d6550bec8769" />
<img width="150" height="340" alt="Game Invitation" src="https://github.com/user-attachments/assets/ab3b9790-feec-4909-af5f-6af67bbcdee4" />
<img width="150" height="340" alt="Game Confirmation - Player" src="https://github.com/user-attachments/assets/813646c4-f3fa-4f04-a92a-997005502976" />
<img width="150" height="340" alt="Pending Invites" src="https://github.com/user-attachments/assets/bc1859af-c28d-43d0-998b-63ffc879422e" />
<img width="150" height="340" alt="Game Confirmation - Captain" src="https://github.com/user-attachments/assets/a0a93e51-795c-4384-a356-aa5a89b075a6" />
<img width="150" height="340" alt="Form Teams" src="https://github.com/user-attachments/assets/31af09e7-90fa-4eeb-a5be-d7131c19dd28" />
<img width="150" height="340" alt="Assign Teams" src="https://github.com/user-attachments/assets/971d1037-e80d-459f-8156-fe05c5787105" />
<img width="150" height="340" alt="Record Winner" src="https://github.com/user-attachments/assets/ab7a0490-e9a9-4d3a-abf4-1703d132aa27" />
<img width="150" height="340" alt="Game Summary" src="https://github.com/user-attachments/assets/083ca5ee-0223-44c3-bded-516d3a4491f5" />
<img width="150" height="340" alt="Leaderboard" src="https://github.com/user-attachments/assets/b45b1f83-b72d-4276-ba9b-38fea07c6a0a" />
<img width="150" height="340" alt="Profile Page incl Elo, Game History" src="https://github.com/user-attachments/assets/0eabc1fb-d334-4627-a1bc-2be06119acc1" />

---
### Figma Designs
<img width="150" height="340" alt="Log In Screen" src="https://github.com/user-attachments/assets/0fabd639-76de-4a03-a557-005b4ac66cde" />
<img width="150" height="340" alt="New Game" src="https://github.com/user-attachments/assets/011f2798-616b-40ad-8e91-fd03119a98f6" />
<img width="150" height="340" alt="Add Players" src="https://github.com/user-attachments/assets/d1c715db-fc64-43c1-9f68-86561f43ab6d" />
<img width="150" height="340" alt="Join Game (1)" src="https://github.com/user-attachments/assets/10587474-15fb-4b82-b342-8acfe3c5f998" />
<img width="150" height="340" alt="Assign Teams" src="https://github.com/user-attachments/assets/f276cf5a-ad9e-4a62-9e96-5eb7de778e52" />
<img width="150" height="340" alt="Confirm Team Assignment" src="https://github.com/user-attachments/assets/1fe69d62-72e1-47a3-82ba-aa91a5c9e42c" />
<img width="150" height="340" alt="Game Started" src="https://github.com/user-attachments/assets/74787ad9-02b3-4f6d-bd28-f18834be11f2" />
<img width="150" height="340" alt="Record Results" src="https://github.com/user-attachments/assets/19627d61-f8d5-4dc7-a449-9c2b49ca3c57" />
<img width="150" height="340" alt="Confirm Results" src="https://github.com/user-attachments/assets/ecaf0d28-1da3-41da-980f-493cc0b7f865" />
<img width="150" height="340" alt="Wait for Results Confirmation" src="https://github.com/user-attachments/assets/62985154-f992-447a-9676-9d38ee9c8bcc" />
<img width="150" height="340" alt="Summary" src="https://github.com/user-attachments/assets/d200bcdf-876a-4b10-94fe-6e779c353225" />
<img width="150" height="340" alt="Leaderboard" src="https://github.com/user-attachments/assets/bdb46cdb-d27e-4ce9-846e-05c18a301b5f" />
<img width="150" height="340" alt="Community" src="https://github.com/user-attachments/assets/967d9ad0-7ea0-45dd-bb49-fe878f296ec1" />
<img width="150" height="340" alt="Edit Groups (3)" src="https://github.com/user-attachments/assets/6d6c4ca4-79b7-4c05-a406-e000b566bf81" />
<img width="150" height="340" alt="Edit Friends" src="https://github.com/user-attachments/assets/d10267f2-c9d7-4595-a35e-08c4cc14b0d3" />
<img width="150" height="1250" alt="Profile" src="https://github.com/user-attachments/assets/8f8a722e-a895-4f96-8d7f-97ff50c9440a" style="vertical-align: top;"/>


---
## Architecture

<!-- TODO: continue to update descriptions of code organization and tools and libraries used -->

Our stack: MongoDB, Express, Expo, and Bun with TypeScript  

- MongoDB → database (stores users, rides, etc.)  
- Express → backend server (routes, APIs, logic)  
- Expo → wrapper for React Native (cross-platform mobile + camera, gps, notifs)  
- Bun → runtime + package manager (runs the server, installs deps)  
- TypeScript → type safety across frontend + backend  


This repository contains a TypeScript monorepo which mirrors the structure of the application.

### Frontend
The [frontend](./frontend) directory contains source code and instructions to build, run, and deploy a static site or mobile application using the Expo framework.

### Backend
The [backend](./backend) directory contains source code and instructions to build, run, and deploy a server application.

This server is built with Express, and connects to a MongoDB database.

## Setup

Install [`bun`](https://bun.sh), then refer to the [frontend](./frontend) and [backend](./backend) directories for specific instructions on how to build, run, and deploy the client and server applications.

> [!WARNING]  
> Currently, there is a bug with Expo + Bun in the frontend - it spawns a Node process under the hood,<br>
> and if it falls back to Bun then Bun will throw some errors during frontend bundling.
>
> Make sure you have Node.JS ≥23 installed - we suggest [`nvm use node`](https://github.com/nvm-sh/nvm).

<!-- ## Deployment -->

<!-- TODO: how to deploy the project -->

## Authors

| Username    | Name              |
| ----------- | ----------------- |
| @jrmann100  | Jordan Mann       |
| @mliu31     | Megan Liu         |
| @JetWavs    | Teddy Wavle       |
| @brianng882 | Brian Chun Yin Ng |
| @etatishev  | Liza Tatishev     |
| @Ebop14     | Ethan Child       |

## Acknowledgments

We are thankful to Professor Vasanta Lakshmi Kommineni (@kvasanta) for her guidance and support throughout the project.

This project was developed with assistance from generative AI models by OpenAI, including GPT-4o, o1, and o3-mini.


### Scripts
| Command                 | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `bun run check`         | Check for TypeScript errors in the entire monorepo.     |
| `bun run lint`          | Check for code/style errors in the entire monorepo.     |
| `bun run lint:fix`      | Fix code/style errors in the entire monorepo.           |
| `bun run lint:root`     | Check for code/style errors in the main project folder. |
| `bun run lint:root:fix` | Fix code/style errors in the main project folder.       |



First --> Last Meetings  
<img width="500" height="300" alt="First Meeting" src="https://github.com/user-attachments/assets/e8ff7122-5bea-4236-9e76-0320ec9af3c5" />
<img width="300" height="300" alt="Last Meeting" src="https://github.com/user-attachments/assets/d30cbc53-38cc-46dd-a4a8-e3a1d90b8105" />
