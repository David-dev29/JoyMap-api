import Product from "../../models/Product.js";

// GET /api/me/products - Obtener productos de mi negocio
export const getMyProducts = async (req, res) => {
  try {
    // Verificar que el usuario tenga un negocio asignado
    if (!req.user.businessId) {
      return res.status(404).json({
        success: false,
        message: "No tienes un negocio asignado"
      });
    }

    const products = await Product.find({ businessId: req.user.businessId })
      .populate("categoryId", "name")
      .populate("subcategoryId", "name")
      .populate("kitchenId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Error getMyProducts:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: error.message
    });
  }
};

// GET /api/me/products/stats - Estadísticas de productos
export const getMyProductsStats = async (req, res) => {
  try {
    if (!req.user.businessId) {
      return res.status(404).json({
        success: false,
        message: "No tienes un negocio asignado"
      });
    }

    const stats = await Product.aggregate([
      { $match: { businessId: req.user.businessId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ["$availability", "Disponible"] }, 1, 0] }
          },
          unavailable: {
            $sum: { $cond: [{ $ne: ["$availability", "Disponible"] }, 1, 0] }
          },
          avgPrice: { $avg: "$price" }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || { total: 0, available: 0, unavailable: 0, avgPrice: 0 }
    });
  } catch (error) {
    console.error("Error getMyProductsStats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
};
