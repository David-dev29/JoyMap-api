// 2. ACTUALIZAR EL CONTROLADOR DE UPDATE
// controllers/category/updateCategory.js
// ============================================

import CategoryBusiness from "../../models/CategoryBusiness.js";
import { uploadToS3 } from "../../utils/s3Uploader.js";
import slugify from "slugify";

export const updateCategoryBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, isActive, type } = req.body; // ✅ Agregar type

    const update = {};

    if (name) {
      update.name = name;
      update.slug = slugify(name, { lower: true, strict: true });
    }

    if (icon !== undefined) update.icon = icon;
    if (isActive !== undefined) update.isActive = isActive;
    
    // ✅ Validar y actualizar type
    if (type) {
      if (!['comida', 'tienda', 'envio'].includes(type)) {
        return res.status(400).json({ 
          success: false, 
          message: "El tipo debe ser: comida, tienda o envio" 
        });
      }
      update.type = type;
    }

    if (req.file) {
      update.image = await uploadToS3(req.file, "categoriesBusiness");
    }

    const category = await CategoryBusiness.findByIdAndUpdate(
      id, 
      update, 
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada"
      });
    }

    res.json({ success: true, response: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Error al actualizar categoría" 
    });
  }
};