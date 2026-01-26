import Coupon from "../../models/Coupon.js";

// Validar cupón (público - para checkout)
export const validateCoupon = async (req, res) => {
  try {
    const { code, businessId, orderTotal } = req.body;

    if (!code || !businessId) {
      return res.status(400).json({
        success: false,
        message: "Se requiere código y businessId"
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      businessId
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Cupón no encontrado"
      });
    }

    const validation = coupon.isValid();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.reason
      });
    }

    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `El pedido mínimo para este cupón es $${coupon.minOrder}`
      });
    }

    // Calcular descuento
    let discountAmount;
    if (coupon.discountType === "percentage") {
      discountAmount = (orderTotal * coupon.discount) / 100;
    } else {
      discountAmount = Math.min(coupon.discount, orderTotal); // No puede descontar más del total
    }

    res.json({
      success: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        description: coupon.description
      },
      discountAmount: Math.round(discountAmount * 100) / 100,
      newTotal: Math.round((orderTotal - discountAmount) * 100) / 100
    });
  } catch (error) {
    console.error("Error validando cupón:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Incrementar uso del cupón (llamar cuando se complete una orden)
export const useCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Cupón no encontrado"
      });
    }

    // Verificar que aún es válido antes de usarlo
    const validation = coupon.isValid();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.reason
      });
    }

    coupon.usedCount += 1;
    await coupon.save();

    res.json({
      success: true,
      message: "Uso de cupón registrado",
      coupon
    });
  } catch (error) {
    console.error("Error usando cupón:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
