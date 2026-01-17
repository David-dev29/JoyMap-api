import Subcategory from "../../models/Subcategory.js";

const getAllSubcategories = async (req, res, next) => {
  try {
    // 1️⃣ Traer todas las subcategorías y popular los productos
    const subcategories = await Subcategory.find()
      .populate({
        path: "products",
        select: "name price image available stock subcategory", // Campos útiles
      })
      .populate({
        path: "categoryId",
        select: "name iconUrl bannerUrl", // Info de la categoría
      });

    if (!subcategories.length) {
      return res.status(404).json({
        success: false,
        message: "No hay subcategorías registradas",
      });
    }

    // 2️⃣ Agrupar subcategorías por categoría
    const groupedByCategory = {};

    subcategories.forEach((subcat) => {
      const category = subcat.categoryId?._id?.toString();
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = {
          categoryId: subcat.categoryId?._id,
          categoryName: subcat.categoryId?.name,
          categoryBanner: subcat.categoryId?.bannerUrl,
          categoryIcon: subcat.categoryId?.iconUrl,
          subcategories: [],
        };
      }

      groupedByCategory[category].subcategories.push({
        _id: subcat._id,
        name: subcat.name,
        description: subcat.description,
        products: subcat.products,
      });
    });

    // 3️⃣ Convertir el objeto en array para facilidad en frontend
    const result = Object.values(groupedByCategory);

    return res.status(200).json({
      success: true,
      message: "Subcategorías agrupadas por categoría",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default getAllSubcategories;
