import Store from '../../models/Store.js';
import Category from '../../models/Category.js';
import Product from '../../models/Product.js';

// Elimina una tienda y todos sus datos asociados (categorías y productos)
const destroyStore = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Encuentra la tienda que se va a eliminar
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Tienda no encontrada'
      });
    }

    // 2. Elimina todos los productos que pertenecen a las categorías de la tienda
    // Usamos el operador $in para encontrar todos los productos cuyo categoryId esté en la lista de categorías de la tienda
    await Product.deleteMany({ categoryId: { $in: store.categories } });

    // 3. Elimina todas las categorías asociadas a la tienda
    await Category.deleteMany({ _id: { $in: store.categories } });

    // 4. Finalmente, elimina la tienda misma
    await Store.findByIdAndDelete(id);

    // 5. Responde con un mensaje de éxito
    return res.status(200).json({
      success: true,
      message: 'Tienda y todos sus datos asociados eliminados correctamente.'
    });
  } catch (error) {
    // Pasa cualquier error al manejador de errores
    next(error);
  }
};

export { destroyStore };
