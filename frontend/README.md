# Frontend

<!-- TODO: add sections and organize as in root README.md -->

### Getting started

1. Install [bun](https://bun.sh/)
2. Clone this repo and `bun install`
3. `cd frontend`
4. `bun web` to start a development server in your browser.

> [!WARNING]  
> Currently, there is a bug with Expo + Bun in the frontend - it spawns a Node process under the hood,<br>
> and if it falls back to Bun then Bun will throw some errors during frontend bundling.
>
> Make sure you have Node.JS ≥23 installed - we suggest [`nvm use node`](https://github.com/nvm-sh/nvm).

### Scripts
| Command            | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `bun run android`  | Start a live development build of the app on Android.   |
| `bun run check`    | Check for TypeScript errors.                            |
| `bun run ios`      | Start a live development build of the app on iOS.       |
| `bun run lint`     | Check for code/style errors.                            |
| `bun run lint:fix` | Fix code/style errors.                                  |
| `bun run start`    | Start a live development build of the app.              |
| `bun run test`     | Run tests using Jest.                                   |
| `bun run web`      | Start a live development build of the app in a browser. |
