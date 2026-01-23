import Review from "../../models/Review.js";

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Solo admin puede eliminar reseñas
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Solo los administradores pueden eliminar reseñas"
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Reseña eliminada exitosamente"
    });

  } catch (error) {
    console.error("Error eliminando reseña:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la reseña",
      error: error.message
    });
  }
};
