import Discount from "../../models/Discount.js";

export const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, type, value, businessId, minOrder, maxUses, startDate, endDate, isActive } = req.body;

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
      // Solo puede editar descuentos de su negocio
      if (discount.businessId && discount.businessId.toString() !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para editar este descuento"
        });
      }
      // No puede cambiar el businessId a otro negocio
      if (businessId && businessId !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "No puedes asignar el descuento a otro negocio"
        });
      }
    }

    // Si se cambia el código, verificar que no exista
    if (code && code.toUpperCase() !== discount.code) {
      const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
      if (existingDiscount) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un descuento con ese código"
        });
      }
    }

    // Actualizar campos
    if (code) discount.code = code.toUpperCase();
    if (type) discount.type = type;
    if (value !== undefined) discount.value = value;
    if (minOrder !== undefined) discount.minOrder = minOrder;
    if (maxUses !== undefined) discount.maxUses = maxUses;
    if (startDate) discount.startDate = startDate;
    if (endDate) discount.endDate = endDate;
    if (isActive !== undefined) discount.isActive = isActive;

    // Solo admin puede cambiar businessId
    if (req.user.role === "admin" && businessId !== undefined) {
      discount.businessId = businessId || null;
    }

    await discount.save();

    const updatedDiscount = await Discount.findById(id)
      .populate("businessId", "name");

    res.status(200).json({
      success: true,
      message: "Descuento actualizado exitosamente",
      discount: updatedDiscount
    });

  } catch (error) {
    console.error("Error actualizando descuento:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el descuento",
      error: error.message
    });
  }
};
