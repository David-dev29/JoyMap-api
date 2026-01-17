import Order from "../../models/Order.js";
import { io } from "../../server.js"; // ✨ CAMBIO 1: Importa 'io' igual que en update.js

const deleteOrder = async (req, res, next) => {
  try {
    const orderDeleted = await Order.findByIdAndDelete(req.params.id);

    if (!orderDeleted) return res.status(404).json({ message: "Order not found" });

     // ✨ CAMBIO 2: Usa la instancia 'io' importada, no req.io
     io.emit("order:delete", { id: req.params.id });

    return res.status(200).json({ response: "Order deleted" });
  } catch (error) {
    next(error);
  }
};

export default deleteOrder;
