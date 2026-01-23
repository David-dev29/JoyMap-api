import ProductCategory from "../../models/ProductCategory.js";
import Product from "../../models/Product.js";

export const deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { force } = req.query;

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
          message: "No tienes permisos para eliminar esta categoría"
        });
      }
    }

    // Verificar si tiene productos asociados
    const productCount = await Product.countDocuments({ productCategoryId: id });

    if (productCount > 0 && force !== 'true') {
      return res.status(400).json({
        success: false,
        message: `Esta categoría tiene ${productCount} producto(s) asociado(s). Usa ?force=true para eliminar y desasociar los productos.`,
        productCount
      });
    }

    // Si force=true, desasociar productos
    if (productCount > 0 && force === 'true') {
      await Product.updateMany(
        { productCategoryId: id },
        { $set: { productCategoryId: null, category: '' } }
      );
    }

    await ProductCategory.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Categoría eliminada exitosamente",
      productsUnlinked: force === 'true' ? productCount : 0
    });

  } catch (error) {
    console.error("Error eliminando categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la categoría",
      error: error.message
    });
  }
};
