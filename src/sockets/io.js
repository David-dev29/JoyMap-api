// socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Ajusta según tu frontend
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on("connection", (socket) => {
    console.log("⚡ Cliente conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Cliente desconectado:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("⚠️ Socket.IO no ha sido inicializado.");
  }
  return io;
};
