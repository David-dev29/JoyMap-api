import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import Business from "../../models/Business.js";
import { io } from "../../server.js";
import { createNotification } from "../notifications.js";

const createOrder = async (req, res, next) => {
  try {
    const {
      customerId,
      items,
      businessId,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      paymentMethod,
      notes
    } = req.body;

    // Determinar customerId: si es customer usa su propio ID, si es admin puede especificar
    let finalCustomerId = customerId;

    if (req.user.role === "customer") {
      // Customer siempre usa su propio ID
      finalCustomerId = req.user._id;
    } else if (req.user.role === "admin") {
      // Admin debe especificar customerId
      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "customerId es requerido para crear orden como admin"
        });
      }
    }

    // Validaciones básicas
    if (!finalCustomerId) {
      return res.status(400).json({
        success: false,
        message: "customerId es requerido"
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items es requerido y debe tener al menos un producto"
      });
    }

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "businessId es requerido"
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "deliveryAddress es requerido"
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

    // Enriquecer items con datos del producto (snapshot al momento de la compra)
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select("_id name price image");
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    const enrichedItems = items.map(item => {
      const product = productMap.get(item.productId?.toString() || item.productId);
      return {
        productId: item.productId,
        name: item.name || product?.name,
        price: item.price ?? product?.price,
        quantity: item.quantity,
        image: item.image || product?.image || null, // Prioridad: frontend > producto > null
        status: "pending"
      };
    });

    // Crear orden
    const orderData = {
      customerId: finalCustomerId,
      businessId,
      items: enrichedItems,
      subtotal: subtotal || 0,
      deliveryFee: deliveryFee || 0,
      total: total || 0,
      deliveryAddress,
      paymentMethod: paymentMethod || "cash",
      notes,
      status: "pending",
      orderNumber: newOrderNumber,
      statusHistory: [{ status: "pending", timestamp: new Date() }]
    };

    const newOrder = await Order.create(orderData);

    // Populate para la respuesta
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("customerId", "name phone email")
      .populate("businessId", "name address")
      .populate("items.productId", "name price image");

    // Emitir evento de nueva orden
    io.emit("order:new", populatedOrder);

    // Emitir también al room del negocio específico
    if (businessId) {
      io.to(`business:${businessId}`).emit("order:new", populatedOrder);

      // Notificar al owner del negocio
      const business = await Business.findById(businessId);
      if (business && business.owner) {
        await createNotification({
          userId: business.owner,
          type: "order",
          title: "¡Nuevo pedido!",
          message: `Tienes un nuevo pedido #${newOrderNumber} por $${total || 0}`,
          data: { orderId: newOrder._id },
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
      order: populatedOrder
    });
  } catch (error) {
    console.error("Error creando orden:", error);
    next(error);
  }
};

export default createOrder;
