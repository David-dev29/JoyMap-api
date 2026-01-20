import { Router } from "express";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { checkOrderOwnership } from "../middlewares/checkOwnership.js";
import {
  activeOrders,
  allOrders,
  orderById
} from "../controllers/orders/read.js";
import createOrder from "../controllers/orders/create.js";
import {
  updateOrder,
  cancelOrder,
  registerPayment,
  updateOrderItemStatus
} from "../controllers/orders/update.js";
import deleteOrder from "../controllers/orders/delete.js";

const router = Router();

// GET - Filtrado automático por rol en el controller
router.get("/active", verifyToken, activeOrders);
router.get("/", verifyToken, allOrders);
router.get("/:id", verifyToken, checkOrderOwnership, orderById);

// POST - Customer y admin pueden crear órdenes
router.post("/create", verifyToken, requireRole("admin", "customer"), createOrder);

// PUT - Con verificación de ownership
router.put("/update/:id", verifyToken, checkOrderOwnership, updateOrder);
router.put("/:id/cancel", verifyToken, checkOrderOwnership, cancelOrder);
router.post("/:id/register-payment", verifyToken, requireRole("admin", "business_owner"), checkOrderOwnership, registerPayment);
router.put("/:orderId/items/:itemId", verifyToken, requireRole("admin", "business_owner"), updateOrderItemStatus);

// DELETE - Solo admin puede eliminar órdenes
router.delete("/:id", verifyToken, requireRole("admin"), deleteOrder);

export default router;
