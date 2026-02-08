import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notifications.js";

const router = Router();

// Todas las rutas requieren autenticación
router.get("/", verifyToken, getNotifications);
router.put("/read-all", verifyToken, markAllAsRead);
router.put("/:id/read", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteNotification);

export default router;
