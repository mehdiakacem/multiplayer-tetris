# Multiplayer Tetris

Real-time multiplayer Tetris built with React, Express, and Socket.IO.

## Overview

This project is a full-stack JavaScript implementation of an online multiplayer Tetris game. Players join a room, the host starts the match, and the server keeps all connected clients in sync over Socket.IO.

## Stack

- React 19
- Vite
- Express 5
- Socket.IO
- Vitest
- ESLint

## Features

- Real-time multiplayer game state updates
- Room-based sessions for players
- Host-controlled game start
- Dedicated server game loop
- Automated tests for game logic and socket handlers

## Getting Started

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

The app reads these variables:

- `PORT`: Express server port. Default: `3000`
- `CLIENT_URL`: allowed browser origin for Socket.IO CORS. Default: `http://localhost:5173`
- `VITE_SOCKET_SERVER_URL`: optional Socket.IO server URL used by the Vite client. Leave it unset when the client and server are deployed on the same origin.

The default local setup uses:

- Client origin: `http://localhost:5173`
- Server URL: `http://localhost:3000`

For production:

- If Express serves the built frontend, do not set `VITE_SOCKET_SERVER_URL`; the client will connect back to the same origin automatically.
- If the frontend and server are deployed on different origins, set `VITE_SOCKET_SERVER_URL` to the public server URL and set `CLIENT_URL` to the public frontend URL.
- On Render, if `CLIENT_URL` is not set, the server falls back to Render's `RENDER_EXTERNAL_URL`.

### Run the app

Start client and server together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:client
npm run dev:server
```

### Deploy

Build the frontend, then start the Node server:

```bash
npm ci
npm run build:client
npm run start:server
```

### Deploy on Render

This repo includes [`render.yaml`](/home/mehdi/Desktop/multiplayer-tetris/render.yaml) for a single Render web service.

1. Push the repository to GitHub.
2. In Render, create a new Blueprint and select this repository.
3. Render will use:
   - Build command: `npm ci && npm run build:client`
   - Start command: `npm run start:server`
   - Node version: `20.19.0`
4. Leave `VITE_SOCKET_SERVER_URL` unset when deploying this as one service on Render.
5. Add `CLIENT_URL` only if you later move the frontend to a different origin.

## Available Scripts

- `npm run dev` starts client and server together
- `npm run dev:client` starts the Vite client
- `npm run dev:server` starts the Express server with Nodemon
- `npm run build:client` builds the client
- `npm run preview:client` previews the client build
- `npm run lint:client` runs ESLint on the client code
- `npm test` starts Vitest in watch mode
- `npm run test:run` runs tests once
- `npm run coverage` runs tests with coverage

## Project Structure

```text
src/
  client/   React application
  server/   Express server, Socket.IO handlers, and game logic
  test/     Test utilities
```
