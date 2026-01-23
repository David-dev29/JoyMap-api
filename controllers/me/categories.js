import Category from "../../models/Category.js";
import Product from "../../models/Product.js";

// GET /api/me/categories - Obtener categorías de mi negocio
export const getMyCategories = async (req, res) => {
  try {
    // Verificar que el usuario tenga un negocio asignado
    if (!req.user.businessId) {
      return res.status(404).json({
        success: false,
        message: "No tienes un negocio asignado"
      });
    }

    const { populate } = req.query;

    // Buscar categorías donde storeId = businessId del usuario
    let query = Category.find({ storeId: req.user.businessId });

    // Si se solicita populate de productos
    if (populate === 'products') {
      query = query.populate({
        path: 'products',
        match: { businessId: req.user.businessId },
        options: { sort: { createdAt: -1 } }
      });
    }

    const categories = await query.sort({ name: 1 });

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error("Error getMyCategories:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener categorías",
      error: error.message
    });
  }
};

// GET /api/me/categories/:id - Obtener una categoría específica
export const getMyCategoryById = async (req, res) => {
  try {
    if (!req.user.businessId) {
      return res.status(404).json({
        success: false,
        message: "No tienes un negocio asignado"
      });
    }

    const { id } = req.params;
    const { populate } = req.query;

    let query = Category.findOne({
      _id: id,
      storeId: req.user.businessId
    });

    if (populate === 'products') {
      query = query.populate({
        path: 'products',
        match: { businessId: req.user.businessId },
        options: { sort: { createdAt: -1 } }
      });
    }

    const category = await query;

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error("Error getMyCategoryById:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener categoría",
      error: error.message
    });
  }
};

// GET /api/me/categories/stats - Estadísticas de categorías
export const getMyCategoriesStats = async (req, res) => {
  try {
    if (!req.user.businessId) {
      return res.status(404).json({
        success: false,
        message: "No tienes un negocio asignado"
      });
    }

    // Obtener categorías con conteo de productos
    const stats = await Product.aggregate([
      { $match: { businessId: req.user.businessId } },
      {
        $group: {
          _id: "$categoryId",
          productCount: { $sum: 1 },
          availableCount: {
            $sum: { $cond: [{ $eq: ["$availability", "Disponible"] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: "$category.name",
          productCount: 1,
          availableCount: 1
        }
      },
      { $sort: { productCount: -1 } }
    ]);

    res.json({
      success: true,
      totalCategories: stats.length,
      stats
    });
  } catch (error) {
    console.error("Error getMyCategoriesStats:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
};
