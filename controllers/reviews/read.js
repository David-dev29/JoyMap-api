import Review from "../../models/Review.js";

// Obtener todas las reseñas (admin)
export const getReviews = async (req, res) => {
  try {
    // Solo admin puede ver todas las reseñas
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver todas las reseñas"
      });
    }

    let filter = {};

    // Filtros opcionales
    if (req.query.businessId) {
      filter.businessId = req.query.businessId;
    }
    if (req.query.isVisible !== undefined) {
      filter.isVisible = req.query.isVisible === 'true';
    }

    const reviews = await Review.find(filter)
      .populate("businessId", "name")
      .populate("customerId", "name email")
      .populate("orderId", "orderNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.error("Error obteniendo reseñas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las reseñas",
      error: error.message
    });
  }
};

// Obtener reseñas de un negocio específico
export const getReviewsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    let filter = { businessId };

    // Si no es admin, solo mostrar reseñas visibles
    if (!req.user || req.user.role !== "admin") {
      filter.isVisible = true;
    }

    const reviews = await Review.find(filter)
      .populate("businessId", "name")
      .populate("customerId", "name")
      .populate("orderId", "orderNumber")
      .sort({ createdAt: -1 });

    // Calcular promedio de rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: Math.round(avgRating * 10) / 10,
      reviews
    });

  } catch (error) {
    console.error("Error obteniendo reseñas del negocio:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las reseñas",
      error: error.message
    });
  }
};

// Obtener una reseña por ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate("businessId", "name")
      .populate("customerId", "name email")
      .populate("orderId", "orderNumber");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    // Si no es visible y no es admin, no mostrar
    if (!review.isVisible && req.user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      review
    });

  } catch (error) {
    console.error("Error obteniendo reseña:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la reseña",
      error: error.message
    });
  }
};
