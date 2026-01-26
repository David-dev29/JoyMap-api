import Coupon from "../../models/Coupon.js";

// Eliminar cupón
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Cupón no encontrado"
      });
    }

    // Verificar permisos: admin puede eliminar cualquiera, owner solo los suyos
    if (req.user.role === "business_owner" && req.user.businessId?.toString() !== coupon.businessId.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar este cupón"
      });
    }

    await Coupon.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Cupón eliminado"
    });
  } catch (error) {
    console.error("Error eliminando cupón:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
