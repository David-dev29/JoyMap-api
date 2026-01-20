import Order from "../../models/Order.js";
import { io } from "../../server.js";

const createOrder = async (req, res, next) => {
  try {
    const { customerId, items, businessId, subtotal, deliveryFee, total, deliveryAddress, notes } = req.body;

    // Validaciones básicas
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "customerId e items son requeridos"
      });
    }

    // Generar número de orden del día
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastOrderToday = await Order.findOne({
      createdAt: { $gte: today }
    }).sort({ orderNumber: -1 });

    const lastNumber = lastOrderToday?.orderNumber || 0;
    const newOrderNumber = lastNumber + 1;

    // Crear orden
    const orderData = {
      customerId,
      businessId: businessId || null,
      items,
      subtotal,
      deliveryFee: deliveryFee || 0,
      total,
      deliveryAddress,
      notes,
      status: "pending",
      orderNumber: newOrderNumber,
      statusHistory: [{ status: "pending", timestamp: new Date() }]
    };

    const newOrder = await Order.create(orderData);

    // Populate para la respuesta
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("customerId", "name phone")
      .populate("businessId", "name");

    // Emitir evento de nueva orden
    io.emit("order:new", populatedOrder);

    return res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
      order: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

export default createOrder;
