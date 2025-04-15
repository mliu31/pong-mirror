# Backend

The frontend is built on [Expo](https://expo.dev/), a React Native application framework.

We use Bun as our runtime and package manager.

<!-- TODO: add sections and organize as in root README.md -->

### Getting started
1. Install [bun](https://bun.sh/)
2. Clone this repo and `bun install`
3. `cd backend`
4. `cp .env.sample .env` and fill in your environment variables.
5. `bun run dev` to start a local live server.

### Scripts
| Command            | Description                           |
| ------------------ | ------------------------------------- |
| `bun run build`    | Build the server (for deployment).    |
| `bun run check`    | Check for TypeScript errors.          |
| `bun run dev`      | Start the server with live reloading. |
| `bun run lint`     | Check for code/style errors.          |
| `bun run lint:fix` | Fix code/style errors.                |
| `bun run preview`  | Start the built server.               |

### Environment Variables
| Variable      | Required or default | Description                |
| ------------- | ------------------- | -------------------------- |
| `MONGODB_URI` | Required            | MongoDB connection URI.    |
| `PORT`        | `3000`              | Port to run the server on. |

