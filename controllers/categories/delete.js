import Category from '../../models/Category.js';
import Product from '../../models/Product.js';
import Store from '../../models/Store.js';
import { io } from "../../server.js";

// Controlador para eliminar una categoría existente
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    }

    // ✅ Borrar todos los productos que tengan esta categoría
    await Product.deleteMany({ categoryId: category._id });

    // Actualizar la tienda para sacar la categoría
    await Store.findByIdAndUpdate(category.storeId, {
      $pull: { categories: id },
    });

    await Category.findByIdAndDelete(id);

    // Emitir evento para frontend
    io.emit("category:deleted", { id });

    return res.status(200).json({
      success: true,
      message: "Categoría y sus productos eliminados exitosamente",
    });
  } catch (error) {
    next(error);
  }
};



export { deleteCategory };
