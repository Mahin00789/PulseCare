require("dotenv").config();
const express = require("express");
const http = require("http");

const { Server } = require("socket.io");

const app = require("./src/app");
const registerChatSocket = require("./src/sockets/chatSocket");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;//So controller can emit events to clients

registerChatSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
