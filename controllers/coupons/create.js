import Coupon from "../../models/Coupon.js";

// Crear cupón (Admin o Business Owner)
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      businessId,
      discount,
      discountType,
      description,
      minOrder,
      maxUses,
      startsAt,
      expiresAt
    } = req.body;

    // Si es business_owner, usar su businessId
    const targetBusinessId = req.user.role === "business_owner"
      ? req.user.businessId
      : businessId;

    if (!targetBusinessId) {
      return res.status(400).json({
        success: false,
        message: "Se requiere businessId"
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      businessId: targetBusinessId,
      discount,
      discountType,
      description,
      minOrder,
      maxUses,
      startsAt,
      expiresAt
    });

    res.status(201).json({
      success: true,
      message: "Cupón creado exitosamente",
      coupon
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Este código ya existe para este negocio"
      });
    }
    console.error("Error creando cupón:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
