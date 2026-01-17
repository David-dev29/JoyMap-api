import Business from "../../models/Business.js";
import { uploadToS3 } from "../../utils/s3Uploader.js";
import { io } from "../../server.js";

const createBusiness = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      isOpen,
      mapIcon, // 🔥 NUEVO
      deliveryTime,
      deliveryCost,
      minOrderAmount,
      coordinates, // [lng, lat] o string
      address,
    } = req.body;

    // 🔹 Validaciones básicas
    if (!name || !category || !coordinates || !address) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: name, category, coordinates, address",
      });
    }

    // 🔹 Normalizar coordinates (string o array)
    let coords = coordinates;

    if (typeof coords === "string") {
      coords = JSON.parse(coords);
    }

    if (
      !Array.isArray(coords) ||
      coords.length !== 2 ||
      isNaN(coords[0]) ||
      isNaN(coords[1])
    ) {
      return res.status(400).json({
        success: false,
        message: "coordinates debe ser un array numérico [lng, lat]",
      });
    }

    // 🔹 Normalizar deliveryTime
    let parsedDeliveryTime = { min: 20, max: 40 };

    if (deliveryTime) {
      parsedDeliveryTime =
        typeof deliveryTime === "string"
          ? JSON.parse(deliveryTime)
          : deliveryTime;
    }

    const businessData = {
      name,
      description,
      category,
      isOpen: isOpen ?? true,
      mapIcon: mapIcon || '📍', // 🔥 NUEVO con fallback
      deliveryTime: {
        min: Number(parsedDeliveryTime.min) || 20,
        max: Number(parsedDeliveryTime.max) || 40,
      },
      deliveryCost: Number(deliveryCost) || 0,
      minOrderAmount: Number(minOrderAmount) || 0,
      location: {
        type: "Point",
        coordinates: [Number(coords[0]), Number(coords[1])],
      },
      address,
    };

    // 🔹 Manejo de imágenes
    if (req.files) {
      if (req.files.logo?.[0]) {
        businessData.logo = await uploadToS3(req.files.logo[0]);
      }
      if (req.files.banner?.[0]) {
        businessData.banner = await uploadToS3(req.files.banner[0]);
      }
    }

    if (req.file) {
      if (req.file.fieldname === "logo") {
        businessData.logo = await uploadToS3(req.file);
      }
      if (req.file.fieldname === "banner") {
        businessData.banner = await uploadToS3(req.file);
      }
    }

    const newBusiness = await Business.create(businessData);

    io.emit("business:created", newBusiness);

    return res.status(201).json({
      success: true,
      message: "Negocio creado exitosamente",
      business: newBusiness,
    });

  } catch (error) {
    console.error("Error creando negocio:", error);
    next(error);
  }
};

export { createBusiness };
