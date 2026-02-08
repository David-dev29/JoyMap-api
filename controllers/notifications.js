import Notification from "../models/Notification.js";
import { io } from "../server.js";

// GET /api/notifications - Obtener notificaciones del usuario autenticado
export const getNotifications = async (req, res) => {
  try {
    const { read } = req.query;

    const query = { userId: req.user._id };

    if (read !== undefined) {
      query.read = read === "true";
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 });

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ success: false, message: "Error al obtener notificaciones" });
  }
};

// PUT /api/notifications/:id/read - Marcar como leída
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notificación no encontrada" });
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Error al marcar notificación" });
  }
};

// PUT /api/notifications/read-all - Marcar todas como leídas
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    res.json({ success: true, message: "Todas las notificaciones marcadas como leídas" });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ success: false, message: "Error al marcar notificaciones" });
  }
};

// DELETE /api/notifications/:id - Eliminar notificación
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notificación no encontrada" });
    }

    res.json({ success: true, message: "Notificación eliminada" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ success: false, message: "Error al eliminar notificación" });
  }
};

// Función interna para crear notificaciones desde otros servicios
export const createNotification = async ({ userId, type, title, message, data = null, expiresAt = null }) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data,
      expiresAt,
    });

    // Emitir por WebSocket al usuario
    io.to(`user_${userId}`).emit("new-notification", notification);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};
