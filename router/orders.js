import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
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

// GET - Protegido (solo ver tus órdenes)
router.get("/active", verifyToken, activeOrders);
router.get("/", verifyToken, allOrders);
router.get("/:id", verifyToken, orderById);

// POST - Protegido
router.post("/create", verifyToken, createOrder);

// PUT - Protegido
router.put("/update/:id", verifyToken, updateOrder);
router.put("/:id/cancel", verifyToken, cancelOrder);
router.post("/:id/register-payment", verifyToken, registerPayment);
router.put("/:orderId/items/:itemId", verifyToken, updateOrderItemStatus);

// DELETE - Protegido
router.delete("/:id", verifyToken, deleteOrder);

export default router;
