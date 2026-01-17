import Category from '../../models/Category.js';
import { io } from "../../server.js";
import { uploadToS3 } from "../../utils/s3Uploader.js";

// Controlador para actualizar una categoría existente
const updateCategory = async (req, res, next) => {
  try {
    console.log('🔄 Actualizando categoría ID:', req.params.id);
    console.log('📝 Body recibido:', req.body);
    console.log('📁 Files recibidos:', req.files);

    const category = await Category.findById(req.params.id);
    if (!category) {
      console.log('❌ Categoría no encontrada:', req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: "Categoría no encontrada" 
      });
    }

    console.log('📋 Categoría encontrada:', {
      id: category._id,
      name: category.name,
      iconUrl: category.iconUrl,    // 🔹 Nombres correctos del modelo
      bannerUrl: category.bannerUrl // 🔹 Nombres correctos del modelo
    });

    const updateData = { ...req.body };
    console.log('📦 UpdateData inicial:', updateData);

    // Manejar archivos
    if (req.files) {
      console.log('📂 Procesando archivos...');
      
      // Si req.files es un objeto con campos específicos
      if (req.files.icon && req.files.icon[0]) {
        console.log('🖼️ Procesando icono...');
        const iconUrl = await uploadToS3(req.files.icon[0]);
        updateData.iconUrl = iconUrl; // 🔹 Cambio: icon -> iconUrl
        console.log('✅ Icono URL asignada:', iconUrl);
      }

      if (req.files.banner && req.files.banner[0]) {
        console.log('🖼️ Procesando banner...');
        const bannerUrl = await uploadToS3(req.files.banner[0]);
        updateData.bannerUrl = bannerUrl; // 🔹 Cambio: banner -> bannerUrl
        console.log('✅ Banner URL asignada:', bannerUrl);
      }

      // Si req.files es un array (cuando usas .any())
      if (Array.isArray(req.files)) {
        console.log('📂 req.files es array con', req.files.length, 'archivos');
        
        for (const file of req.files) {
          console.log('📄 Procesando archivo:', file.fieldname);
          
          if (file.fieldname === 'icon') {
            const iconUrl = await uploadToS3(file);
            updateData.iconUrl = iconUrl; // 🔹 Cambio: icon -> iconUrl
            console.log('✅ Icono URL asignada (array):', iconUrl);
          } else if (file.fieldname === 'banner') {
            const bannerUrl = await uploadToS3(file);
            updateData.bannerUrl = bannerUrl; // 🔹 Cambio: banner -> bannerUrl
            console.log('✅ Banner URL asignada (array):', bannerUrl);
          }
        }
      }
    }

    console.log('💾 UpdateData final antes de guardar:', updateData);

    // Actualizar en la base de datos
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    );

    console.log('💿 Categoría actualizada en BD:', {
      id: updatedCategory._id,
      name: updatedCategory.name,
      iconUrl: updatedCategory.iconUrl,     // 🔹 Nombres correctos
      bannerUrl: updatedCategory.bannerUrl  // 🔹 Nombres correctos
    });

    // 🚀 Emitir evento
    io.emit("category:updated", updatedCategory);

    return res.status(200).json({
      success: true,
      message: "Categoría actualizada exitosamente",
      category: updatedCategory,
    });

  } catch (error) {
    console.error("❌ Error completo actualizando categoría:", error);
    next(error);
  }
};

export { updateCategory };