import Business from "../../models/Business.js";
import { uploadToS3 } from "../../utils/s3Uploader.js";
import { io } from "../../server.js";

const updateBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      isActive,
      isOpen,
      mapIcon,
      emoji, // Alias de mapIcon (el dashboard envía "emoji")
      iconType,
      iconSvg,
      deliveryTime,
      deliveryCost,
      minOrderAmount,
      coordinates,
      address,
      paymentMethods,
      brandColor,
      bankInfo,
    } = req.body;

    // Verificar que el negocio existe
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado",
      });
    }

    // Preparar datos a actualizar
    const updateData = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (mapIcon || emoji) updateData.mapIcon = mapIcon || emoji;
    if (iconType !== undefined) updateData.iconType = iconType;
    if (iconSvg !== undefined) updateData.iconSvg = iconSvg;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isOpen !== undefined) updateData.isOpen = isOpen;
    if (deliveryCost !== undefined) updateData.deliveryCost = deliveryCost;
    if (minOrderAmount !== undefined) updateData.minOrderAmount = minOrderAmount;
    if (address) updateData.address = address;
    if (paymentMethods !== undefined) updateData.paymentMethods = paymentMethods;
    if (brandColor !== undefined) updateData.brandColor = brandColor;

    // Parsear bankInfo (viene como string JSON del FormData)
    if (bankInfo !== undefined) {
      updateData.bankInfo = typeof bankInfo === "string"
        ? JSON.parse(bankInfo)
        : bankInfo;
    }

    // Actualizar deliveryTime si se envía (puede venir como string de FormData o como objeto)
    if (deliveryTime) {
      updateData.deliveryTime = typeof deliveryTime === "string"
        ? JSON.parse(deliveryTime)
        : deliveryTime;
    }

    // Actualizar coordenadas si se envían (puede venir como string de FormData o como array)
    if (coordinates) {
      const coords = typeof coordinates === "string"
        ? JSON.parse(coordinates)
        : coordinates;
      if (Array.isArray(coords) && coords.length === 2) {
        updateData.location = {
          type: "Point",
          coordinates: coords,
        };
      }
    }

    // 🔹 Manejar múltiples archivos (logo y banner)
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        const logoUrl = await uploadToS3(req.files.logo[0]);
        updateData.logo = logoUrl;
      }

      if (req.files.banner && req.files.banner[0]) {
        const bannerUrl = await uploadToS3(req.files.banner[0]);
        updateData.banner = bannerUrl;
      }
    }

    // 🔹 También manejar el caso de un solo archivo
    if (req.file) {
      if (req.file.fieldname === "logo") {
        const logoUrl = await uploadToS3(req.file);
        updateData.logo = logoUrl;
      } else if (req.file.fieldname === "banner") {
        const bannerUrl = await uploadToS3(req.file);
        updateData.banner = bannerUrl;
      }
    }

    // Actualizar el negocio
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // 🚀 Emitir evento en tiempo real
    io.emit("business:updated", updatedBusiness);

    return res.status(200).json({
      success: true,
      message: "Negocio actualizado exitosamente",
      business: updatedBusiness,
    });

  } catch (error) {
    console.error("Error actualizando negocio:", error);
    next(error);
  }
};

export { updateBusiness };