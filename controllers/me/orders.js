import Order from "../../models/Order.js";

// Populate común para órdenes
const orderPopulate = [
  { path: "customerId", select: "name phone" },
  { path: "businessId", select: "name" },
  {
    path: "items.productId",
    select: "name price image",
    populate: { path: "kitchenId", select: "name" }
  }
];

// GET /api/me/orders - Obtener mis órdenes (filtrado por rol)
export const getMyOrders = async (req, res) => {
  try {
    let filter = {};
    const { status, limit = 50, page = 1 } = req.query;

    // Filtrar según el rol
    switch (req.user.role) {
      case "business_owner":
        if (!req.user.businessId) {
          return res.status(404).json({
            success: false,
            message: "No tienes un negocio asignado"
          });
        }
        filter.businessId = req.user.businessId;
        break;

      case "driver":
        filter.deliveryPerson = req.user._id;
        break;

      case "customer":
        filter.customerId = req.user._id;
        break;

      case "admin":
        // Admin ve todo, no aplica filtro
        break;

      default:
        return res.status(403).json({
          success: false,
          message: "Rol no válido"
        });
    }

    // Filtro opcional por status
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate(orderPopulate)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders
    });
  } catch (error) {
    console.error("Error getMyOrders:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener órdenes",
      error: error.message
    });
  }
};

// GET /api/me/orders/active - Obtener órdenes activas
export const getMyActiveOrders = async (req, res) => {
  try {
    let filter = {
      status: { $in: ["pending", "accepted", "preparing", "onTheWay"] }
    };

    // Filtrar según el rol
    switch (req.user.role) {
      case "business_owner":
        if (!req.user.businessId) {
          return res.status(404).json({
            success: false,
            message: "No tienes un negocio asignado"
          });
        }
        filter.businessId = req.user.businessId;
        break;

      case "driver":
        filter.deliveryPerson = req.user._id;
        break;

      case "customer":
        filter.customerId = req.user._id;
        break;

      case "admin":
        // Admin ve todo
        break;
    }

    const orders = await Order.find(filter)
      .populate(orderPopulate)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Error getMyActiveOrders:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener órdenes activas",
      error: error.message
    });
  }
};

// GET /api/me/orders/stats - Estadísticas de órdenes
export const getMyOrdersStats = async (req, res) => {
  try {
    let matchFilter = {};

    if (req.user.role === "business_owner" && req.user.businessId) {
      matchFilter.businessId = req.user.businessId;
    } else if (req.user.role === "customer") {
      matchFilter.customerId = req.user._id;
    } else if (req.user.role === "driver") {
      matchFilter.deliveryPerson = req.user._id;
    }

    const stats = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          preparing: { $sum: { $cond: [{ $eq: ["$status", "preparing"] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, "$total", 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        total: 0,
        pending: 0,
        preparing: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0
      }
    });
  } catch (error) {
    console.error("Error getMyOrdersStats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
};
