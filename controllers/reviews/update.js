import Review from "../../models/Review.js";

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible } = req.body;

    // Solo admin puede actualizar reseñas (visibilidad)
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Solo los administradores pueden modificar reseñas"
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    // Solo permitir actualizar isVisible
    if (isVisible !== undefined) {
      review.isVisible = isVisible;
    }

    await review.save();

    const updatedReview = await Review.findById(id)
      .populate("businessId", "name")
      .populate("customerId", "name email")
      .populate("orderId", "orderNumber");

    res.status(200).json({
      success: true,
      message: `Reseña ${isVisible ? 'visible' : 'oculta'} exitosamente`,
      review: updatedReview
    });

  } catch (error) {
    console.error("Error actualizando reseña:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la reseña",
      error: error.message
    });
  }
};
