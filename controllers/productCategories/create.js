import ProductCategory from "../../models/ProductCategory.js";

export const createProductCategory = async (req, res) => {
  try {
    const { name, description, businessId, icon, image, order, isActive } = req.body;

    // Validar campos requeridos
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "El nombre es requerido"
      });
    }

    // Determinar businessId según el rol
    let finalBusinessId;

    if (req.user.role === "admin") {
      // Admin debe especificar businessId
      if (!businessId) {
        return res.status(400).json({
          success: false,
          message: "businessId es requerido para admin"
        });
      }
      finalBusinessId = businessId;
    } else if (req.user.role === "business_owner") {
      // business_owner usa su negocio asignado
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "No tienes un negocio asignado"
        });
      }
      finalBusinessId = req.user.businessId;

      // No puede crear para otro negocio
      if (businessId && businessId !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Solo puedes crear categorías para tu negocio"
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para crear categorías"
      });
    }

    // Obtener el orden máximo actual para este negocio
    let finalOrder = order;
    if (finalOrder === undefined) {
      const maxOrder = await ProductCategory.findOne({ businessId: finalBusinessId })
        .sort({ order: -1 })
        .select('order');
      finalOrder = maxOrder ? maxOrder.order + 1 : 0;
    }

    const productCategory = new ProductCategory({
      name,
      description: description || '',
      businessId: finalBusinessId,
      icon: icon || '',
      image: image || '',
      order: finalOrder,
      isActive: isActive !== undefined ? isActive : true
    });

    await productCategory.save();

    const populatedCategory = await ProductCategory.findById(productCategory._id)
      .populate("businessId", "name");

    res.status(201).json({
      success: true,
      message: "Categoría de producto creada exitosamente",
      category: populatedCategory
    });

  } catch (error) {
    console.error("Error creando categoría de producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear la categoría de producto",
      error: error.message
    });
  }
};
