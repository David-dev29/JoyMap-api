import Review from "../../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { businessId, orderId, rating, comment } = req.body;

    // Solo customers pueden crear reseñas
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Solo los clientes pueden crear reseñas"
      });
    }

    // Validar campos requeridos
    if (!businessId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Campos requeridos: businessId, rating"
      });
    }

    // Validar rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "El rating debe estar entre 1 y 5"
      });
    }

    // Verificar si ya existe una reseña para esta orden
    if (orderId) {
      const existingReview = await Review.findOne({
        customerId: req.user._id,
        orderId
      });
      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: "Ya has dejado una reseña para este pedido"
        });
      }
    }

    const review = new Review({
      businessId,
      customerId: req.user._id,
      orderId: orderId || null,
      rating,
      comment: comment || ''
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate("businessId", "name")
      .populate("customerId", "name email")
      .populate("orderId", "orderNumber");

    res.status(201).json({
      success: true,
      message: "Reseña creada exitosamente",
      review: populatedReview
    });

  } catch (error) {
    console.error("Error creando reseña:", error);

    // Error de índice único (reseña duplicada)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Ya has dejado una reseña para este pedido"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al crear la reseña",
      error: error.message
    });
  }
};
