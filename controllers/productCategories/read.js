import ProductCategory from "../../models/ProductCategory.js";

// Obtener todas las categorías de productos (admin)
export const getProductCategories = async (req, res) => {
  try {
    // Solo admin puede ver todas
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver todas las categorías"
      });
    }

    let filter = {};

    // Filtros opcionales
    if (req.query.businessId) {
      filter.businessId = req.query.businessId;
    }
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    const categories = await ProductCategory.find(filter)
      .populate("businessId", "name")
      .sort({ businessId: 1, order: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });

  } catch (error) {
    console.error("Error obteniendo categorías de productos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      error: error.message
    });
  }
};

// Obtener categorías de un negocio específico
export const getProductCategoriesByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { populate, includeInactive } = req.query;

    let filter = { businessId };

    // Por defecto solo mostrar activas (excepto para admin/owner)
    if (includeInactive !== 'true') {
      if (!req.user || (req.user.role !== 'admin' &&
          (req.user.role !== 'business_owner' || req.user.businessId?.toString() !== businessId))) {
        filter.isActive = true;
      }
    }

    let query = ProductCategory.find(filter)
      .populate("businessId", "name")
      .sort({ order: 1, name: 1 });

    // Populate productos si se solicita
    if (populate === 'products') {
      query = query.populate({
        path: 'products',
        match: { availability: 'Disponible' },
        options: { sort: { name: 1 } }
      });
    }

    const categories = await query;

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });

  } catch (error) {
    console.error("Error obteniendo categorías del negocio:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      error: error.message
    });
  }
};

// Obtener una categoría por ID
export const getProductCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;

    let query = ProductCategory.findById(id)
      .populate("businessId", "name");

    if (populate === 'products') {
      query = query.populate({
        path: 'products',
        options: { sort: { name: 1 } }
      });
    }

    const category = await query;

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    // Verificar permisos si es business_owner
    if (req.user.role === "business_owner") {
      if (!req.user.businessId || category.businessId._id.toString() !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para ver esta categoría"
        });
      }
    }

    res.status(200).json({
      success: true,
      category
    });

  } catch (error) {
    console.error("Error obteniendo categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la categoría",
      error: error.message
    });
  }
};
