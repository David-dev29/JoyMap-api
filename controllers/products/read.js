import Product from "../../models/Product.js";

// GET /api/products - Obtener productos (filtrado opcional por negocio)
export const allProducts = async (req, res) => {
  try {
    const { businessId, categoryId, availability } = req.query;
    let filter = {};

    // Si hay usuario autenticado y es business_owner, filtrar por su negocio
    // A menos que sea una petición pública (sin auth) o admin
    if (req.user) {
      if (req.user.role === "business_owner" && req.user.businessId) {
        // business_owner solo ve sus productos (excepto si viene query param)
        if (!businessId) {
          filter.businessId = req.user.businessId;
        }
      }
      // Admin ve todo
    }

    // Filtros opcionales por query params
    if (businessId) {
      filter.businessId = businessId;
    }
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (availability) {
      filter.availability = availability;
    }

    const products = await Product.find(filter)
      .populate("businessId", "name")
      .populate("categoryId", "name")
      .populate("subcategoryId", "name")
      .populate("kitchenId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    console.error("Error allProducts:", err);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: err.message
    });
  }
};

// GET /api/products/:id - Obtener un producto por ID
export const oneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("businessId", "name logo")
      .populate("categoryId", "name")
      .populate("subcategoryId", "name")
      .populate("kitchenId", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (err) {
    console.error("Error oneProduct:", err);
    res.status(500).json({
      success: false,
      message: "Error al obtener producto",
      error: err.message
    });
  }
};

// GET /api/products/business/:businessId - Obtener productos por negocio (público)
export const productsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { categoryId, availability } = req.query;

    let filter = { businessId };

    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (availability) {
      filter.availability = availability;
    }

    const products = await Product.find(filter)
      .populate("categoryId", "name")
      .populate("subcategoryId", "name")
      .populate("kitchenId", "name")
      .sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: products.length,
      businessId,
      products
    });
  } catch (err) {
    console.error("Error productsByBusiness:", err);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos del negocio",
      error: err.message
    });
  }
};
