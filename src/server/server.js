import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const corsOrigin = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
  },
});

const __dirname = new URL(".", import.meta.url).pathname;

app.use(express.static(path.join(__dirname, "../../dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

export { app, server, io };
