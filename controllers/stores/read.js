import Store from '../../models/Store.js';

// Obtiene la información completa de la única tienda
const allStores = async (req, res, next) => {
  try {
    // 1. Busca la primera tienda que encuentre en la base de datos
    let store = await Store.findOne()
      .populate({
        path: 'categories', // Trae las categorías asociadas
        populate: {
          path: 'products' // Dentro de cada categoría, trae los productos
        }
      });

    // 2. Si no existe ninguna tienda, crea una por defecto
    if (!store) {
      store = await Store.create({ businessName: 'Mi Negocio' });
    }

    // 3. Responde con toda la información de la tienda
    return res.status(200).json({
      success: true,
      store_data: store
    });
  } catch (error) {
    // Pasa cualquier error al manejador de errores
    next(error);
  }
};

export { allStores };
