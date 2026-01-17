// Importar dependencias
import express from "express";
import "dotenv/config";
import "./config/database.js";

// Importar modelos para que Mongoose los registre
import "./models/User.js";
import "./models/Order.js";
import "./models/Product.js";

import path from "path";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import indexRouter from "./router/index.js";

const app = express();
const server = createServer(app);

// 🔒 ORÍGENES PERMITIDOS
const allowedOrigins = [
  "http://192.168.100.7:5173",
  "http://192.168.100.7:5174",
];

// 🔌 Socket.IO con CORS CORRECTO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// 🔧 Middleware Express (MISMO CORS)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve("uploads")));

// Rutas principales
app.use("/api", indexRouter);

// Eventos de sockets
io.on("connection", (socket) => {
  console.log("⚡ Nuevo cliente conectado:", socket.id);

  socket.on("ping", (msg) => {
    console.log("Mensaje recibido:", msg);
    socket.emit("pong", "Hola desde el servidor!");
  });

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

// Escuchar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});

// Exportar io para usarlo en controladores
export { io };
