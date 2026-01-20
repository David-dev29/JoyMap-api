import Business from "../../models/Business.js";
import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import Order from "../../models/Order.js";
import mongoose from "mongoose";

// Middleware para verificar acceso al negocio
export const checkBusinessAccess = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Admin puede acceder a cualquier negocio
    if (req.user.role === "admin") {
      return next();
    }

    // business_owner solo puede acceder a su negocio
    if (req.user.role === "business_owner") {
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "No tienes un negocio asignado"
        });
      }

      if (req.user.businessId.toString() !== id) {
        return res.status(403).json({
          success: false,
          message: "No tienes acceso a este negocio"
        });
      }

      return next();
    }

    // Otros roles no tienen acceso
    return res.status(403).json({
      success: false,
      message: "No tienes permisos para acceder a este recurso"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verificando acceso",
      error: error.message
    });
  }
};

// GET /api/businesses/:id/categories - Categorías de productos del negocio
export const getBusinessCategories = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el negocio existe
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado"
      });
    }

    // Obtener categorías únicas de los productos del negocio
    const categories = await Product.aggregate([
      { $match: { businessId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: "$categoryId",
          name: { $first: "$category" },
          count: { $sum: 1 }
        }
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { name: 1 } }
    ]);

    // Populate categorías con más información
    const populatedCategories = await Category.populate(categories, {
      path: "_id",
      select: "name iconUrl bannerUrl"
    });

    const formattedCategories = populatedCategories.map(cat => ({
      _id: cat._id?._id || cat._id,
      name: cat._id?.name || cat.name || "Sin categoría",
      iconUrl: cat._id?.iconUrl || null,
      bannerUrl: cat._id?.bannerUrl || null,
      productCount: cat.count
    }));

    res.json({
      success: true,
      businessId: id,
      count: formattedCategories.length,
      categories: formattedCategories
    });
  } catch (error) {
    console.error("Error getBusinessCategories:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener categorías",
      error: error.message
    });
  }
};

// GET /api/businesses/:id/products - Productos del negocio
export const getBusinessProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, availability, limit = 100, page = 1 } = req.query;

    // Verificar que el negocio existe
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado"
      });
    }

    // Construir filtro
    let filter = { businessId: id };

    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (availability) {
      filter.availability = availability;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name")
        .populate("subcategoryId", "name")
        .populate("kitchenId", "name")
        .sort({ category: 1, name: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      businessId: id,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      products
    });
  } catch (error) {
    console.error("Error getBusinessProducts:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: error.message
    });
  }
};

// GET /api/businesses/:id/orders - Órdenes del negocio
export const getBusinessOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, limit = 50, page = 1, from, to } = req.query;

    // Verificar que el negocio existe
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado"
      });
    }

    // Construir filtro
    let filter = { businessId: id };

    if (status) {
      filter.status = status;
    }

    // Filtro por fechas
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("customerId", "name phone")
        .populate("deliveryPerson", "name phone")
        .populate({
          path: "items.productId",
          select: "name price image"
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      businessId: id,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders
    });
  } catch (error) {
    console.error("Error getBusinessOrders:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener órdenes",
      error: error.message
    });
  }
};

// GET /api/businesses/:id/stats - Estadísticas del negocio
export const getBusinessStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el negocio existe
    const business = await Business.findById(id).select("name");
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado"
      });
    }

    // Fecha de hoy (inicio del día)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ejecutar todas las consultas en paralelo
    const [
      totalProducts,
      productsByAvailability,
      orderStats,
      ordersToday,
      recentOrders
    ] = await Promise.all([
      // Total de productos
      Product.countDocuments({ businessId: id }),

      // Productos por disponibilidad
      Product.aggregate([
        { $match: { businessId: new mongoose.Types.ObjectId(id) } },
        {
          $group: {
            _id: "$availability",
            count: { $sum: 1 }
          }
        }
      ]),

      // Estadísticas de órdenes
      Order.aggregate([
        { $match: { businessId: new mongoose.Types.ObjectId(id) } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "delivered"] }, "$total", 0]
              }
            },
            pendingOrders: {
              $sum: {
                $cond: [{ $in: ["$status", ["pending", "accepted", "preparing"]] }, 1, 0]
              }
            },
            completedOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "delivered"] }, 1, 0]
              }
            },
            cancelledOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0]
              }
            }
          }
        }
      ]),

      // Órdenes de hoy
      Order.aggregate([
        {
          $match: {
            businessId: new mongoose.Types.ObjectId(id),
            createdAt: { $gte: today }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "delivered"] }, "$total", 0]
              }
            }
          }
        }
      ]),

      // Últimas 5 órdenes
      Order.find({ businessId: id })
        .select("orderNumber status total createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    // Formatear productos por disponibilidad
    const availabilityMap = {};
    productsByAvailability.forEach(item => {
      availabilityMap[item._id || "unknown"] = item.count;
    });

    // Obtener valores de estadísticas (o defaults)
    const stats = orderStats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0
    };

    const todayStats = ordersToday[0] || { count: 0, revenue: 0 };

    res.json({
      success: true,
      businessId: id,
      businessName: business.name,
      stats: {
        products: {
          total: totalProducts,
          available: availabilityMap["Disponible"] || 0,
          unavailable: availabilityMap["No disponible"] || 0,
          soldOut: availabilityMap["Agotado"] || 0
        },
        orders: {
          total: stats.totalOrders,
          pending: stats.pendingOrders,
          completed: stats.completedOrders,
          cancelled: stats.cancelledOrders
        },
        revenue: {
          total: stats.totalRevenue,
          today: todayStats.revenue
        },
        today: {
          orders: todayStats.count,
          revenue: todayStats.revenue
        },
        recentOrders
      }
    });
  } catch (error) {
    console.error("Error getBusinessStats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
};
