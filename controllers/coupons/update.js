import Coupon from "../../models/Coupon.js";

// Actualizar cupón
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      discount,
      discountType,
      description,
      minOrder,
      maxUses,
      isActive,
      startsAt,
      expiresAt
    } = req.body;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Cupón no encontrado"
      });
    }

    // Verificar permisos: admin puede editar cualquiera, owner solo los suyos
    if (req.user.role === "business_owner" && req.user.businessId?.toString() !== coupon.businessId.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para editar este cupón"
      });
    }

    // Preparar datos a actualizar
    const updateData = {};
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (discount !== undefined) updateData.discount = discount;
    if (discountType !== undefined) updateData.discountType = discountType;
    if (description !== undefined) updateData.description = description;
    if (minOrder !== undefined) updateData.minOrder = minOrder;
    if (maxUses !== undefined) updateData.maxUses = maxUses;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (startsAt !== undefined) updateData.startsAt = startsAt;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Cupón actualizado",
      coupon: updatedCoupon
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Este código ya existe para este negocio"
      });
    }
    console.error("Error actualizando cupón:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
