import UserFavorite from "../models/UserFavorite.js";

// GET /api/favorites - Obtener favoritos del usuario
export const getFavorites = async (req, res) => {
  try {
    const favorites = await UserFavorite.find({ userId: req.user._id })
      .populate({
        path: "businessId",
        select: "name logo banner rating category address isOpen mapIcon",
        populate: { path: "category", select: "name slug icon type" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: favorites });
  } catch (error) {
    console.error("Error getting favorites:", error);
    res.status(500).json({ success: false, message: "Error al obtener favoritos" });
  }
};

// POST /api/favorites - Agregar favorito
export const addFavorite = async (req, res) => {
  try {
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({ success: false, message: "businessId es requerido" });
    }

    const favorite = await UserFavorite.create({
      userId: req.user._id,
      businessId,
    });

    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    // Duplicate key = ya es favorito
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Este negocio ya está en favoritos" });
    }
    console.error("Error adding favorite:", error);
    res.status(500).json({ success: false, message: "Error al agregar favorito" });
  }
};

// DELETE /api/favorites/:businessId - Quitar favorito
export const removeFavorite = async (req, res) => {
  try {
    const result = await UserFavorite.findOneAndDelete({
      userId: req.user._id,
      businessId: req.params.businessId,
    });

    if (!result) {
      return res.status(404).json({ success: false, message: "Favorito no encontrado" });
    }

    res.json({ success: true, message: "Favorito eliminado" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ success: false, message: "Error al eliminar favorito" });
  }
};

// GET /api/favorites/check/:businessId - Verificar si es favorito
export const checkFavorite = async (req, res) => {
  try {
    const favorite = await UserFavorite.findOne({
      userId: req.user._id,
      businessId: req.params.businessId,
    });

    res.json({ success: true, isFavorite: !!favorite });
  } catch (error) {
    console.error("Error checking favorite:", error);
    res.status(500).json({ success: false, message: "Error al verificar favorito" });
  }
};
