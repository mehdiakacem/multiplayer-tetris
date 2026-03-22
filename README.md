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

The default setup uses:

- Client: `http://localhost:5173`
- Server: `http://localhost:3000`

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

## Suggested GitHub Description

`Real-time multiplayer Tetris built with React, Express, and Socket.IO.`
