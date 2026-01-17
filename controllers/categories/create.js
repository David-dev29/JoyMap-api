import Category from '../../models/Category.js';
import Store from '../../models/Store.js';
import { io } from "../../server.js";
import { uploadToS3 } from "../../utils/s3Uploader.js";

// Controlador para crear una nueva categoría
const createCategory = async (req, res, next) => {
  try {
    const { name, storeId } = req.body;

    if (!storeId) {
      return res.status(400).json({ 
        success: false, 
        message: "El ID de la tienda es requerido." 
      });
    }

    // Preparar datos de la categoría
    const categoryData = {
      name,
      storeId,
      products: [],
    };

    // 🔹 Manejar múltiples archivos (icon y banner)
    if (req.files) {
      // Si se subió un icono
      if (req.files.icon && req.files.icon[0]) {
        const iconUrl = await uploadToS3(req.files.icon[0]);
        categoryData.icon = iconUrl;
      }

      // Si se subió un banner
      if (req.files.banner && req.files.banner[0]) {
        const bannerUrl = await uploadToS3(req.files.banner[0]);
        categoryData.banner = bannerUrl;
      }
    }

    // 🔹 También manejar el caso de un solo archivo (por compatibilidad)
    if (req.file) {
      if (req.file.fieldname === 'icon') {
        const iconUrl = await uploadToS3(req.file);
        categoryData.icon = iconUrl;
      } else if (req.file.fieldname === 'banner') {
        const bannerUrl = await uploadToS3(req.file);
        categoryData.banner = bannerUrl;
      }
    }

    // Crear la nueva categoría
    const newCategory = await Category.create(categoryData);

    // Actualizar la tienda agregando la categoría
    await Store.findByIdAndUpdate(storeId, {
      $push: { categories: newCategory._id },
    });

    // 🚀 Emitir evento en tiempo real
    io.emit("category:created", newCategory);

    return res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      category: newCategory,
    });

  } catch (error) {
    console.error("Error creando categoría:", error);
    next(error);
  }
};

export { createCategory };