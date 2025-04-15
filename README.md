# Project Code Name "Carpooling"

![Team Photo](https://github.com/user-attachments/assets/e8ff7122-5bea-4236-9e76-0320ec9af3c5)

<!-- TODO: continue to update short project description, some sample screenshots or mockups -->

Our team is developing an application to support Dartmouth's pong culture.

This addresses the competitive needs of the sport (designing a ranking system to help match players at the same skill level) as well as its social aspects (helping players quickly find partners and track their games).

## Architecture

<!-- TODO: continue to update descriptions of code organization and tools and libraries used -->

We are using MongoDB, Express, Expo, and Bun.

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