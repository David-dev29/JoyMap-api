import Discount from "../../models/Discount.js";

export const validateDiscount = async (req, res) => {
  try {
    const { code, businessId, orderTotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "El código es requerido"
      });
    }

    const discount = await Discount.findOne({ code: code.toUpperCase() })
      .populate("businessId", "name");

    if (!discount) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Código de descuento no válido"
      });
    }

    // Verificar si está activo
    if (!discount.isActive) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Este descuento no está activo"
      });
    }

    // Verificar fechas de vigencia
    const now = new Date();
    if (now < new Date(discount.startDate)) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Este descuento aún no está vigente"
      });
    }

    if (now > new Date(discount.endDate)) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Este descuento ha expirado"
      });
    }

    // Verificar límite de usos
    if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Este descuento ha alcanzado el límite de usos"
      });
    }

    // Verificar si aplica al negocio
    if (discount.businessId && businessId) {
      const discountBusinessId = discount.businessId._id ? discount.businessId._id.toString() : discount.businessId.toString();
      if (discountBusinessId !== businessId) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: "Este descuento no aplica para este negocio"
        });
      }
    }

    // Verificar monto mínimo
    const total = orderTotal || 0;
    if (total < discount.minOrder) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `El pedido debe ser de al menos $${discount.minOrder} para aplicar este descuento`
      });
    }

    // Calcular el descuento final
    let finalDiscount = 0;
    if (discount.type === 'percentage') {
      finalDiscount = (total * discount.value) / 100;
    } else {
      // fixed
      finalDiscount = discount.value;
    }

    // El descuento no puede ser mayor al total
    if (finalDiscount > total) {
      finalDiscount = total;
    }

    res.status(200).json({
      success: true,
      valid: true,
      message: "Código de descuento válido",
      discount: {
        _id: discount._id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        minOrder: discount.minOrder,
        businessId: discount.businessId
      },
      finalDiscount: Math.round(finalDiscount * 100) / 100
    });

  } catch (error) {
    console.error("Error validando descuento:", error);
    res.status(500).json({
      success: false,
      valid: false,
      message: "Error al validar el descuento",
      error: error.message
    });
  }
};
