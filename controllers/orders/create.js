import Order from "../../models/Order.js";
import { io } from "../../server.js";

const createOrder = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastOrderToday = await Order.findOne({
      createdAt: { $gte: today }
    }).sort({ orderNumber: -1 });

    // Si no hay orderNumber, usamos 0 como base
    const lastNumber = lastOrderToday?.orderNumber || 0;
    const newOrderNumber = lastNumber + 1;

    const orderData = {
      ...req.body,
      status: "pending",
      orderNumber: newOrderNumber,
    };

    const newOrder = await Order.create(orderData);
    const populatedOrder = await newOrder.populate('customerId', 'name phone');

    io.emit("order:new", populatedOrder);

    return res.status(201).json({ response: populatedOrder });
  } catch (error) {
    next(error);
  }
};

export default createOrder;
