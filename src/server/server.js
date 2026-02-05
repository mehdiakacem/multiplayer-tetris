import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // later restrict this
  },
});

const __dirname = new URL(".", import.meta.url).pathname;

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

export { app, server, io };
