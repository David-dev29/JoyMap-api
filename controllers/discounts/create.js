import Discount from "../../models/Discount.js";

export const createDiscount = async (req, res) => {
  try {
    const { code, type, value, businessId, minOrder, maxUses, startDate, endDate, isActive } = req.body;

    // Validar campos requeridos
    if (!code || !type || value === undefined || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Campos requeridos: code, type, value, startDate, endDate"
      });
    }

    // Determinar businessId según el rol
    let finalBusinessId = null;

    if (req.user.role === "admin") {
      // Admin puede crear descuentos globales (null) o para cualquier negocio
      finalBusinessId = businessId || null;
    } else if (req.user.role === "business_owner") {
      // business_owner solo puede crear para su negocio
      if (!req.user.businessId) {
        return res.status(403).json({
          success: false,
          message: "No tienes un negocio asignado"
        });
      }
      finalBusinessId = req.user.businessId;

      // No puede crear descuentos para otro negocio
      if (businessId && businessId !== req.user.businessId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Solo puedes crear descuentos para tu negocio"
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para crear descuentos"
      });
    }

    // Verificar que el código no exista
    const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un descuento con ese código"
      });
    }

    const discount = new Discount({
      code: code.toUpperCase(),
      type,
      value,
      businessId: finalBusinessId,
      minOrder: minOrder || 0,
      maxUses: maxUses || null,
      startDate,
      endDate,
      isActive: isActive !== undefined ? isActive : true
    });

    await discount.save();

    const populatedDiscount = await Discount.findById(discount._id)
      .populate("businessId", "name");

    res.status(201).json({
      success: true,
      message: "Descuento creado exitosamente",
      discount: populatedDiscount
    });

  } catch (error) {
    console.error("Error creando descuento:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el descuento",
      error: error.message
    });
  }
};
