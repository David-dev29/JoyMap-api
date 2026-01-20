import Order from "../../models/Order.js";

// Construir filtro según el rol del usuario
const buildFilterByRole = (user) => {
  if (!user) return {};

  switch (user.role) {
    case "admin":
      // Admin ve todo
      return {};

    case "business_owner":
      // Business owner ve solo órdenes de su negocio
      return user.businessId ? { businessId: user.businessId } : { businessId: null };

    case "driver":
      // Driver ve solo entregas asignadas a él
      return { deliveryPerson: user._id };

    case "customer":
      // Customer ve solo sus órdenes
      return { customerId: user._id };

    default:
      return { _id: null }; // No retorna nada
  }
};

// Populate común para órdenes
const orderPopulate = [
  { path: "customerId", select: "name phone" },
  { path: "businessId", select: "name" },
  {
    path: "items.productId",
    select: "name price kitchenId",
    populate: { path: "kitchenId", select: "name" }
  }
];

// Obtener pedidos activos (filtrado por rol)
const activeOrders = async (req, res) => {
  try {
    const roleFilter = buildFilterByRole(req.user);
    const statusFilter = { status: { $in: ["pending", "accepted", "preparing"] } };

    const orders = await Order.find({ ...roleFilter, ...statusFilter })
      .populate(orderPopulate)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error("Error en activeOrders:", err);
    res.status(500).json({
      success: false,
      message: "Error al traer los pedidos activos"
    });
  }
};

// Obtener todos los pedidos (filtrado por rol)
const allOrders = async (req, res) => {
  try {
    const roleFilter = buildFilterByRole(req.user);

    const orders = await Order.find(roleFilter)
      .populate(orderPopulate)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error("Error en allOrders:", err);
    res.status(500).json({
      success: false,
      message: "Error al traer los pedidos"
    });
  }
};

// Obtener orden por ID (con verificación de acceso en middleware)
const orderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(orderPopulate);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

export { activeOrders, allOrders, orderById };
