import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import { io } from "../../server.js";
import { uploadToS3 } from "../../utils/s3Uploader.js";

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) 
      return res.status(404).json({ success: false, message: "Producto no encontrado" });

    const updateData = { ...req.body };

    // ✅ Subir imagen si viene en el request
    if (req.file) {
      const imageUrl = await uploadToS3(req.file);
      updateData.image = imageUrl;
    }

    // ✅ Actualizar categoryId y obtener el nombre de la categoría
    if (updateData.categoryId) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) 
        return res.status(400).json({ success: false, message: "CategoryId inválido" });

      updateData.categoryId = category._id;
      updateData.category = category.name; // 🔥 Agregamos al updateData
      
      console.log(`✅ Actualizando categoría: ${category.name} (${category._id})`);
    }

    // ✅ Actualizar el producto usando findByIdAndUpdate para mejor performance
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { 
        new: true, // Devuelve el documento actualizado
        runValidators: true // Ejecuta validaciones del schema
      }
    ).populate("kitchenId", "name")
     .populate("categoryId", "name");

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Error al actualizar producto" });
    }

    console.log("📦 Producto actualizado:", {
      name: updatedProduct.name,
      category: updatedProduct.category,
      categoryId: updatedProduct.categoryId,
      subcategory: updatedProduct.subcategory,
      subcategoryId: updatedProduct.subcategoryId
    });

    // ✅ Emitir evento a todos los clientes
    io.emit("productUpdated", updatedProduct);

    return res.status(200).json(updatedProduct);

  } catch (error) {
    console.error("❌ Error en updateProduct:", error);
    next(error);
  }
};