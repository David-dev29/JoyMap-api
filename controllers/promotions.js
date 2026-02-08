import Promotion from "../models/Promotion.js";
import { uploadToS3 } from "../utils/s3Uploader.js";

// GET /api/promotions - Obtener promociones activas (público)
export const getActivePromotions = async (req, res) => {
  try {
    const { type } = req.query;

    const query = { isActive: true };

    if (type) {
      query.type = type;
    }

    // Filtrar por vigencia
    const now = new Date();
    query.$or = [
      { startsAt: null, expiresAt: null },
      { startsAt: { $lte: now }, expiresAt: null },
      { startsAt: null, expiresAt: { $gte: now } },
      { startsAt: { $lte: now }, expiresAt: { $gte: now } },
    ];

    const promotions = await Promotion.find(query).sort({ order: 1 });

    res.json({ success: true, data: promotions });
  } catch (error) {
    console.error("Error getting promotions:", error);
    res.status(500).json({ success: false, message: "Error al obtener promociones" });
  }
};

// GET /api/promotions/admin/all - Obtener todas (admin)
export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: promotions });
  } catch (error) {
    console.error("Error getting all promotions:", error);
    res.status(500).json({ success: false, message: "Error al obtener promociones" });
  }
};

// GET /api/promotions/:id - Obtener una promoción
export const getPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promoción no encontrada" });
    }
    res.json({ success: true, data: promotion });
  } catch (error) {
    console.error("Error getting promotion:", error);
    res.status(500).json({ success: false, message: "Error al obtener promoción" });
  }
};

// POST /api/promotions - Crear promoción (admin)
export const createPromotion = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      type,
      linkType,
      linkValue,
      badge,
      contentOrder,
      backgroundColor,
      textColor,
      isActive,
      order,
      startsAt,
      expiresAt,
    } = req.body;

    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToS3(req.file, "promotions");
    }

    const promotion = new Promotion({
      title,
      subtitle,
      image: imageUrl,
      type: type || "carousel",
      linkType: linkType || "none",
      linkValue,
      badge,
      contentOrder: contentOrder
        ? (typeof contentOrder === "string" ? JSON.parse(contentOrder) : contentOrder)
        : ["title", "badge", "subtitle"],
      backgroundColor,
      textColor,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      startsAt: startsAt || null,
      expiresAt: expiresAt || null,
    });

    await promotion.save();

    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    console.error("Error creating promotion:", error);
    res.status(500).json({ success: false, message: "Error al crear promoción" });
  }
};

// PUT /api/promotions/:id - Actualizar promoción (admin)
export const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promoción no encontrada" });
    }

    const {
      title,
      subtitle,
      type,
      linkType,
      linkValue,
      badge,
      contentOrder,
      backgroundColor,
      textColor,
      isActive,
      order,
      startsAt,
      expiresAt,
    } = req.body;

    if (title !== undefined) promotion.title = title;
    if (subtitle !== undefined) promotion.subtitle = subtitle;
    if (type !== undefined) promotion.type = type;
    if (linkType !== undefined) promotion.linkType = linkType;
    if (linkValue !== undefined) promotion.linkValue = linkValue;
    if (backgroundColor !== undefined) promotion.backgroundColor = backgroundColor;
    if (textColor !== undefined) promotion.textColor = textColor;
    if (isActive !== undefined) promotion.isActive = isActive;
    if (order !== undefined) promotion.order = order;
    if (startsAt !== undefined) promotion.startsAt = startsAt;
    if (expiresAt !== undefined) promotion.expiresAt = expiresAt;
    if (badge !== undefined) promotion.badge = badge;
    if (contentOrder !== undefined) {
      promotion.contentOrder = typeof contentOrder === "string"
        ? JSON.parse(contentOrder)
        : contentOrder;
    }

    if (req.file) {
      promotion.image = await uploadToS3(req.file, "promotions");
    }

    await promotion.save();

    res.json({ success: true, data: promotion });
  } catch (error) {
    console.error("Error updating promotion:", error);
    res.status(500).json({ success: false, message: "Error al actualizar promoción" });
  }
};

// DELETE /api/promotions/:id - Eliminar promoción (admin)
export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promoción no encontrada" });
    }
    res.json({ success: true, message: "Promoción eliminada" });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    res.status(500).json({ success: false, message: "Error al eliminar promoción" });
  }
};

// PUT /api/promotions/reorder - Reordenar promociones (admin)
export const reorderPromotions = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    const updates = orderedIds.map((id, index) =>
      Promotion.findByIdAndUpdate(id, { order: index })
    );

    await Promise.all(updates);

    res.json({ success: true, message: "Orden actualizado" });
  } catch (error) {
    console.error("Error reordering promotions:", error);
    res.status(500).json({ success: false, message: "Error al reordenar" });
  }
};
