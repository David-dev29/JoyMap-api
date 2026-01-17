import { Router } from "express";
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

// GET
router.get("/active", activeOrders); 
router.get("/", allOrders);
router.get("/:id", orderById);

// POST
router.post("/create", createOrder);

// PUT
router.put("/update/:id", updateOrder);                  // Actualiza toda la orden
router.put("/:id/cancel", cancelOrder);                  // Cancelar orden
router.post("/:id/register-payment", registerPayment);   // Registrar pago
router.put("/:orderId/items/:itemId", updateOrderItemStatus); // Cambiar estado de un item

// DELETE
router.delete("/:id", deleteOrder);

export default router;
