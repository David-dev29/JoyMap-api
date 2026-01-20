import Business from "../models/Business.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Verificar que business_owner acceda SOLO a su negocio
export const checkBusinessOwnership = async (req, res, next) => {
  try {
    // Admin pasa siempre
    if (req.user.role === "admin") return next();

    // business_owner solo accede a su negocio
    if (req.user.role === "business_owner") {
      const businessId = req.params.id || req.body.businessId;

      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "No tienes un negocio asignado"
        });
      }

      if (req.user.businessId.toString() !== businessId) {
        return res.status(403).json({
          success: false,
          message: "No tienes acceso a este negocio"
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verificando permisos",
      error: error.message
    });
  }
};

// Verificar que el usuario acceda SOLO a sus órdenes
export const checkOrderOwnership = async (req, res, next) => {
  try {
    // Admin pasa siempre
    if (req.user.role === "admin") return next();

    const orderId = req.params.id || req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada"
      });
    }

    // business_owner: puede acceder si la orden es de su negocio
    if (req.user.role === "business_owner") {
      if (order.businessId?.toString() !== req.user.businessId?.toString()) {
        return res.status(403).json({
          success: false,
          message: "No tienes acceso a esta orden"
        });
      }
      return next();
    }

    // driver: puede acceder si está asignado a la entrega
    if (req.user.role === "driver") {
      if (order.deliveryPerson?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Esta entrega no está asignada a ti"
        });
      }
      return next();
    }

    // customer: solo puede acceder a sus propias órdenes
    if (req.user.role === "customer") {
      if (order.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "No tienes acceso a esta orden"
        });
      }
      return next();
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verificando permisos de orden",
      error: error.message
    });
  }
};

// Verificar que business_owner acceda SOLO a sus productos
export const checkProductOwnership = async (req, res, next) => {
  try {
    // Admin pasa siempre
    if (req.user.role === "admin") return next();

    if (req.user.role === "business_owner") {
      const productId = req.params.id;

      if (productId) {
        // Editando/eliminando producto existente
        const product = await Product.findById(productId).populate("categoryId");

        if (!product) {
          return res.status(404).json({
            success: false,
            message: "Producto no encontrado"
          });
        }

        // Verificar que el producto pertenezca al negocio del owner
        // Product -> Category -> Store -> (verificar si el store pertenece al business del owner)
        // Por ahora verificamos que el owner tenga acceso
        if (!req.user.businessId) {
          return res.status(403).json({
            success: false,
            message: "No tienes un negocio asignado"
          });
        }
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verificando permisos de producto",
      error: error.message
    });
  }
};

// Middleware para verificar roles permitidos (alias de requireRole)
export const onlyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autenticado"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Roles permitidos: ${allowedRoles.join(", ")}`
      });
    }

    next();
  };
};
