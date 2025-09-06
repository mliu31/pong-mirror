# NEED1 - The Pong App

<!-- TODO: continue to update short project description, some sample screenshots or mockups -->
We created a mobile app that facilitates in-person connection through Dartmouth pong. 

Invite friends, host tournaments, view leaderboards, track performance with elo rating, and listen to AI commentary. 

<img width="150" height="340" alt="1" src="https://github.com/user-attachments/assets/1aa7c3e2-4eb6-4756-877b-e92fa47a6e71" />
<img width="150" height="340" alt="2" src="https://github.com/user-attachments/assets/a9251f37-3d21-4ff8-a565-fccebb1ad8c9" />
<img width="150" height="340" alt="3" src="https://github.com/user-attachments/assets/589284b1-03e7-4c43-ad70-3e204610a345" />
<img width="150" height="340" alt="4" src="https://github.com/user-attachments/assets/8a1f6fa8-f8a7-45d9-b823-db50b23eb85d" />
<img width="150" height="340" alt="5" src="https://github.com/user-attachments/assets/921aded4-4aeb-4075-ad07-77aeb49ed1c4" />
<img width="150" height="340" alt="6" src="https://github.com/user-attachments/assets/43e22cec-cc3b-401a-8098-6175c2622725" />
<img width="150" height="340" alt="7" src="https://github.com/user-attachments/assets/e3a9cce9-a9f3-485c-aac7-be12702318a2" />
<img width="150" height="340" alt="8" src="https://github.com/user-attachments/assets/4ad1f683-2048-417b-ba98-4d7ccaa75eca" />
<img width="150" height="340" alt="9" src="https://github.com/user-attachments/assets/9ec9132b-9ba3-4df0-9036-6015177a4ca1" />
<img width="150" height="340" alt="10" src="https://github.com/user-attachments/assets/ef80d400-f73d-4515-96ee-93fb09291995" />
<img width="150" height="340" alt="11" src="https://github.com/user-attachments/assets/6215c27b-7d6b-4cc2-aa99-92639dfb9c35" />
<img width="150" height="340" alt="12" src="https://github.com/user-attachments/assets/75cd3e13-b09c-4e23-a37a-40ebcdc7e076" />


---
### Figma Designs
<img width="150" height="340" alt="1" src="https://github.com/user-attachments/assets/19af3933-96f4-4afa-a134-6190e2d997df" />
<img width="150" height="340" alt="2" src="https://github.com/user-attachments/assets/67631622-904f-443f-8b4f-a611dad28ef6" />
<img width="150" height="340" alt="3" src="https://github.com/user-attachments/assets/0f90c76b-bb3b-4771-9236-efbc49b95f25" />
<img width="150" height="340" alt="4" src="https://github.com/user-attachments/assets/fb0cfbb6-3bf5-4df2-b8dc-c15296876fad" />
<img width="150" height="340" alt="5" src="https://github.com/user-attachments/assets/bcb668b1-650b-4ac0-90b8-02107851d268" />
<img width="150" height="340" alt="6" src="https://github.com/user-attachments/assets/aaafe4d4-68b9-4a00-ae25-d78d3a2a5488" />
<img width="150" height="340" alt="7" src="https://github.com/user-attachments/assets/4a22b43a-1bd3-4dbb-862a-7b2ae64298e0" />
<img width="150" height="340" alt="8" src="https://github.com/user-attachments/assets/bcac100c-74da-45f7-b5a2-c8e5a69118a2" />
<img width="150" height="340" alt="9" src="https://github.com/user-attachments/assets/aba2dae0-503b-4ca4-85a3-5d074d87bd37" />
<img width="150" height="340" alt="10" src="https://github.com/user-attachments/assets/33f72e24-a5a5-450b-aeeb-c60ba1fe636f" />
<img width="150" height="340" alt="11" src="https://github.com/user-attachments/assets/e1813d43-00b6-4bb8-b357-9a2029685f5d" />
<img width="150" height="340" alt="12" src="https://github.com/user-attachments/assets/79f1913d-eeb4-44d5-88ce-f3c36a9ac787" /> 
<img width="150" height="340" alt="13" src="https://github.com/user-attachments/assets/431412fb-5cd9-435d-9933-8b1b13968f4f" />
<img width="150" height="340" alt="14" src="https://github.com/user-attachments/assets/1a97e5ad-4412-4c2c-8e69-4999966f3b84" />
<img width="150" height="1250" alt="15" src="https://github.com/user-attachments/assets/a1225506-a2cb-4e8e-9c37-5ca95fab2ba4" />


## Architecture

<!-- TODO: continue to update descriptions of code organization and tools and libraries used -->

Our stack: MongoDB, Express, Expo, and Bun with TypeScript  

- MongoDB → database (stores users, games, etc.)  
- Express → backend server (routes, controllers)  
- Expo → wrapper for React Native (cross-platform mobile + camera, notifs)  
- Bun → runtime + package manager (runs the server, manages deps)  
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
<img width="500" height="300" alt="First Meeting" src="https://github.com/user-attachments/assets/d2317d9e-0d4e-4e3d-bf39-3ec7c7bb3b58" />
<img width="300" height="300" alt="Last Meeting" src="https://github.com/user-attachments/assets/fef65fc1-eef2-40ba-95ad-78ee222298e9" />

