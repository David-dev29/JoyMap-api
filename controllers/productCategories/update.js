import ProductCategory from "../../models/ProductCategory.js";

export const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, image, order, isActive } = req.body;

    const category = await ProductCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    // Verificar permisos
    if (req.user.role === "business_owner") {
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "No tienes un negocio asignado"
        });
      }
      if (category.businessId.toString() !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para editar esta categoría"
        });
      }
    }

    // Actualizar campos
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (image !== undefined) category.image = image;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    const updatedCategory = await ProductCategory.findById(id)
      .populate("businessId", "name");

    res.status(200).json({
      success: true,
      message: "Categoría actualizada exitosamente",
      category: updatedCategory
    });

  } catch (error) {
    console.error("Error actualizando categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la categoría",
      error: error.message
    });
  }
};

// Reordenar categorías
export const reorderProductCategories = async (req, res) => {
  try {
    const { categories } = req.body; // Array de { id, order }

    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: "Se requiere un array de categorías con id y order"
      });
    }

    // Verificar permisos para cada categoría
    for (const cat of categories) {
      const category = await ProductCategory.findById(cat.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: `Categoría ${cat.id} no encontrada`
        });
      }

      if (req.user.role === "business_owner") {
        if (!req.user.businessId || category.businessId.toString() !== req.user.businessId.toString()) {
          return res.status(403).json({
            success: false,
            message: "No tienes permisos para reordenar estas categorías"
          });
        }
      }
    }

    // Actualizar órdenes
    const updatePromises = categories.map(cat =>
      ProductCategory.findByIdAndUpdate(cat.id, { order: cat.order })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Categorías reordenadas exitosamente"
    });

  } catch (error) {
    console.error("Error reordenando categorías:", error);
    res.status(500).json({
      success: false,
      message: "Error al reordenar las categorías",
      error: error.message
    });
  }
};
