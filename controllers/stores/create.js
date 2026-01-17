import Store from "../../models/Store.js";
import { uploadToS3 } from "../../utils/s3Uploader.js"; // helper para subir a S3
import { io } from "../../server.js"; // socket global

// Crear tienda
const createStore = async (req, res, next) => {
  try {
    // 1. Verificar si ya existe una tienda
    const existingStore = await Store.findOne();
    if (existingStore) {
      return res.status(409).json({
        success: false,
        message: "Ya existe una tienda. Solo se puede administrar una."
      });
    }

    // 2. Subir imagen si se envía
    let imageUrl = null;
    if (req.file) {
      const fileUrl = await uploadToS3(req.file, "stores");
      imageUrl = fileUrl.startsWith("http") ? fileUrl : `https://${fileUrl}`;
    }

    // 3. Crear tienda en DB
    const newStore = await Store.create({
      ...req.body,
      image: imageUrl
    });

    // 4. Emitir evento en tiempo real
    io.emit("storeCreated", newStore);

    return res.status(201).json({
      success: true,
      store: newStore
    });
  } catch (error) {
    next(error);
  }
};

export { createStore };
