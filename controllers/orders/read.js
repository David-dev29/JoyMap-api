import Order from '../../models/Order.js';
import Product from "../../models/Product.js"; 
import User from '../../models/User.js';

// ✨ NUEVA FUNCIÓN para obtener solo pedidos activos
const activeOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ['pending', 'accepted', 'preparing'] }
    })
      .populate('customerId', 'name phone') // info del cliente
      .populate({
        path: 'items.productId',
        select: 'name price kitchenId', // traemos lo que importa
        populate: {
          path: 'kitchenId',
          select: 'name' // opcional: nombre de la cocina
        }
      })
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    console.error("Error en activeOrders:", err);
    res.status(500).json({ message: "Error al traer los pedidos activos" });
  }
};

const allOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name phone')
      .populate({
        path: 'items.productId',
        select: 'name price kitchenId',
        populate: { path: 'kitchenId', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    console.error("Error en allOrders:", err);
    res.status(500).json({ message: "Error al traer los pedidos" });
  }
};

const orderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name phone')
      .populate({
        path: 'items.productId',
        select: 'name price kitchenId',
        populate: { path: 'kitchenId', select: 'name' }
      });

    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ response: order });
  } catch (error) {
    next(error);
  }
};

export { activeOrders, allOrders, orderById };
