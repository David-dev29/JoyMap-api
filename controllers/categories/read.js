import Category from '../../models/Category.js';

// Controlador para leer todas las categorías
const allCategories = async (req, res, next) => {
  try {
    const populateProducts = req.query.populate === 'products';

    let query = Category.find();
    if (populateProducts) query = query.populate('products');

    const categories = await query;

    return res.status(200).json({
      success: true,
      response: categories,
    });
  } catch (error) {
    next(error);
  }
};




// Controlador para leer una categoría por su ID
const oneCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate('products');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      response: category,
    });
  } catch (error) {
    next(error);
  }
};

export { allCategories, oneCategory };
