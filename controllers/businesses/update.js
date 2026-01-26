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
      mapIcon, // 🔥 NUEVO
      deliveryTime,
      deliveryCost,
      minOrderAmount,
      coordinates,
      address,
      paymentMethods,
      brandColor,
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
    if (mapIcon) updateData.mapIcon = mapIcon; // 🔥 NUEVO
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isOpen !== undefined) updateData.isOpen = isOpen;
    if (deliveryCost !== undefined) updateData.deliveryCost = deliveryCost;
    if (minOrderAmount !== undefined) updateData.minOrderAmount = minOrderAmount;
    if (address) updateData.address = address;
    if (paymentMethods !== undefined) updateData.paymentMethods = paymentMethods;
    if (brandColor !== undefined) updateData.brandColor = brandColor;

    // Actualizar deliveryTime si se envía
    if (deliveryTime) {
      updateData.deliveryTime = JSON.parse(deliveryTime);
    }

    // Actualizar coordenadas si se envían
    if (coordinates) {
      const coords = JSON.parse(coordinates);
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