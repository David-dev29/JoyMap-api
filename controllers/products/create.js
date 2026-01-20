import Product from "../../models/Product.js";
import Business from "../../models/Business.js";
import { uploadToS3 } from "../../utils/s3Uploader.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      businessId,
      kitchenId,
      kitchen,
      availability,
      stockControl,
      categoryId,
      subcategoryId
    } = req.body;

    // Validaciones básicas
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Nombre y precio son requeridos"
      });
    }

    // Determinar businessId según el rol
    let finalBusinessId;

    if (req.user.role === "admin") {
      // Admin puede especificar cualquier businessId
      if (!businessId) {
        return res.status(400).json({
          success: false,
          message: "businessId es requerido para admin"
        });
      }
      finalBusinessId = businessId;
    } else if (req.user.role === "business_owner") {
      // business_owner usa automáticamente su negocio
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "No tienes un negocio asignado"
        });
      }
      finalBusinessId = req.user.businessId;

      // Si intentó especificar otro businessId, ignorarlo o validar
      if (businessId && businessId !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Solo puedes crear productos para tu negocio"
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para crear productos"
      });
    }

    // Verificar que el negocio existe
    const business = await Business.findById(finalBusinessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado"
      });
    }

    // Subir imagen si viene
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    // Crear producto
    const newProduct = new Product({
      name: name.trim(),
      description: description?.trim() || "",
      price: Number(price),
      businessId: finalBusinessId,
      kitchenId: kitchenId || null,
      kitchen: kitchen || "",
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      availability: availability || "Disponible",
      stockControl: stockControl === "true" || stockControl === true,
      image: imageUrl
    });

    await newProduct.save();

    // Populate para la respuesta
    const populatedProduct = await Product.findById(newProduct._id)
      .populate("businessId", "name")
      .populate("categoryId", "name")
      .populate("kitchenId", "name");

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      product: populatedProduct
    });
  } catch (err) {
    console.error("ERROR createProduct:", err);
    res.status(500).json({
      success: false,
      message: "Error al crear producto",
      error: err.message
    });
  }
};
