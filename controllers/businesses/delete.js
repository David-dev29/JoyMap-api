import Business from "../../models/Business.js";
import { io } from "../../server.js";

const deleteBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que el negocio existe
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado",
      });
    }

    // Eliminar el negocio
    await Business.findByIdAndDelete(id);

    // 🚀 Emitir evento en tiempo real
    io.emit("business:deleted", { businessId: id });

    return res.status(200).json({
      success: true,
      message: "Negocio eliminado exitosamente",
      businessId: id,
    });

  } catch (error) {
    console.error("Error eliminando negocio:", error);
    next(error);
  }
};

// Alternativa: Soft Delete (desactivar en lugar de eliminar)
const softDeleteBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que el negocio existe
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado",
      });
    }

    // Desactivar el negocio en lugar de eliminarlo
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    // 🚀 Emitir evento en tiempo real
    io.emit("business:deactivated", updatedBusiness);

    return res.status(200).json({
      success: true,
      message: "Negocio desactivado exitosamente",
      business: updatedBusiness,
    });

  } catch (error) {
    console.error("Error desactivando negocio:", error);
    next(error);
  }
};

export { deleteBusiness, softDeleteBusiness };