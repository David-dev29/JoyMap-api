
// 1. ACTUALIZAR EL CONTROLADOR DE CREAR CATEGORÍA
// controllers/category/createCategory.js

import CategoryBusiness from "../../models/CategoryBusiness.js";
import slugify from "slugify";

export const createCategoryBusiness = async (req, res) => {
  try {
    const { name, icon, type } = req.body; // ✅ Agregar type

    // Validar que type sea válido
    if (type && !['comida', 'tienda', 'envio'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: "El tipo debe ser: comida, tienda o envio" 
      });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const exists = await CategoryBusiness.findOne({ slug });
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        message: "La categoría ya existe" 
      });
    }

    const category = await CategoryBusiness.create({
      name,
      slug,
      icon: icon || '🍽️',
      type: type || 'comida' // ✅ Default a 'comida'
    });

    res.json({ success: true, response: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Error al crear categoría" 
    });
  }
};