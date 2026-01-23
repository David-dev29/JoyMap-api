import Discount from "../../models/Discount.js";

export const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const discount = await Discount.findById(id);

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
      // Solo puede eliminar descuentos de su negocio
      if (discount.businessId && discount.businessId.toString() !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para eliminar este descuento"
        });
      }
    }

    await Discount.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Descuento eliminado exitosamente"
    });

  } catch (error) {
    console.error("Error eliminando descuento:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el descuento",
      error: error.message
    });
  }
};
