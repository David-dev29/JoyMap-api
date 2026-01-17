import Store from "../../models/Store.js";
import { uploadToS3 } from "../../utils/s3Uploader.js";
import { io } from "../../server.js";

export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;

    let store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ 
        success: false,
        message: "Tienda no encontrada" 
      });
    }

    // Actualizamos datos básicos
    if (req.body.businessName) {
      store.businessName = req.body.businessName;
    }

    // ✅ Subida de LOGO a S3
    if (req.files?.logo?.[0]) {
      const logoUrl = await uploadToS3(req.files.logo[0]);
      store.logoUrl = logoUrl;
    }

    // ✅ Subida de BANNER a S3
    if (req.files?.banner?.[0]) {
      const bannerUrl = await uploadToS3(req.files.banner[0]);
      store.bannerUrl = bannerUrl;
    }

    // ✨ NUEVO: Subida de TEXT LOGO a S3
    if (req.files?.textLogo?.[0]) {
      const textLogoUrl = await uploadToS3(req.files.textLogo[0]);
      store.textLogoUrl = textLogoUrl;
    }

    await store.save();

    // Convertimos el store en un objeto limpio de JSON
    const plainStore = store.toObject();

    // 🔥 Emitimos evento a todos los clientes conectados
    io.emit("storeUpdated", {
      ...plainStore,
      logoUrl: store.logoUrl,
      bannerUrl: store.bannerUrl,
      textLogoUrl: store.textLogoUrl, // ✨ NUEVO
    });

    return res.json({
      success: true,
      message: "Tienda actualizada con éxito",
      response: store,
    });
  } catch (error) {
    console.error("Error al actualizar tienda:", error);
    res.status(500).json({ 
      success: false,
      message: "Error en el servidor",
      error: error.message 
    });
  }
};