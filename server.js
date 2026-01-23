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
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import indexRouter from "./router/index.js";

const app = express();
const server = createServer(app);

// 🔒 ORÍGENES PERMITIDOS
const isDev = process.env.NODE_ENV !== 'production';

// En desarrollo: permite todos los orígenes o usa la lista
// En producción: solo orígenes específicos
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://192.168.100.7:5173',
      'http://192.168.100.7:5174'
    ];

// Configuración de CORS
const corsOptions = {
  origin: isDev ? true : allowedOrigins, // true = permite cualquier origen en dev
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// 🔌 Socket.IO con CORS
const io = new Server(server, {
  cors: corsOptions,
});

// 🔧 Middleware Express
app.use(helmet());
app.use(cors(corsOptions));

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
