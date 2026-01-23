import Discount from "../../models/Discount.js";

// Obtener todos los descuentos
export const getDiscounts = async (req, res) => {
  try {
    let filter = {};

    // Filtrar según el rol del usuario
    if (req.user.role === "admin") {
      // Admin ve todos los descuentos
      // Puede filtrar por businessId si se pasa como query
      if (req.query.businessId) {
        filter.businessId = req.query.businessId;
      }
    } else if (req.user.role === "business_owner") {
      // business_owner solo ve los de su negocio
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "No tienes un negocio asignado"
        });
      }
      filter.businessId = req.user.businessId;
    } else {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver descuentos"
      });
    }

    const discounts = await Discount.find(filter)
      .populate("businessId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: discounts.length,
      discounts
    });

  } catch (error) {
    console.error("Error obteniendo descuentos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los descuentos",
      error: error.message
    });
  }
};

// Obtener un descuento por ID
export const getDiscountById = async (req, res) => {
  try {
    const { id } = req.params;

    const discount = await Discount.findById(id)
      .populate("businessId", "name");

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Descuento no encontrado"
      });
    }

    // Verificar permisos
    if (req.user.role === "business_owner") {
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "No tienes un negocio asignado"
        });
      }
      // Solo puede ver descuentos de su negocio
      if (discount.businessId && discount.businessId._id.toString() !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para ver este descuento"
        });
      }
    }

    res.status(200).json({
      success: true,
      discount
    });

  } catch (error) {
    console.error("Error obteniendo descuento:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el descuento",
      error: error.message
    });
  }
};
