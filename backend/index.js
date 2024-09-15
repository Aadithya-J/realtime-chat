import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";

const app = express();
const port = 3000;

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

let active = 0;

io.on("connection", (socket) => {
  console.log("A user connected");
  active++;
  io.emit("active-users", active);

  socket.on("chat-message", (msg) => {
    console.log("Message received:", msg);
    socket.broadcast.emit("chat-message", msg);
    socket.emit("chat-message", { username: "You", text: msg.text });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    active--;
    io.emit("active-users", active);
  });
});

setInterval(() => {
  console.log("Active users:", active);
}, 10000);

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});