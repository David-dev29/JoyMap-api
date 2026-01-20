import User from "../../models/User.js";
import Business from "../../models/Business.js";

// POST /api/admin/assign-business - Asignar negocio a usuario
export const assignBusiness = async (req, res) => {
  try {
    const { userId, businessId } = req.body;

    // Validar que vengan los IDs
    if (!userId || !businessId) {
      return res.status(400).json({
        success: false,
        message: "userId y businessId son requeridos"
      });
    }

    // Buscar usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Buscar negocio
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado"
      });
    }

    // Verificar si el negocio ya tiene owner
    if (business.owner && business.owner.toString() !== userId) {
      const currentOwner = await User.findById(business.owner).select("name email");
      return res.status(400).json({
        success: false,
        message: `Este negocio ya tiene un owner asignado: ${currentOwner?.name || "Unknown"}`,
        currentOwner
      });
    }

    // Actualizar rol del usuario a business_owner si no lo es
    if (user.role !== "business_owner" && user.role !== "admin") {
      user.role = "business_owner";
    }

    // Asignar businessId al usuario
    user.businessId = businessId;
    await user.save();

    // Asignar owner al negocio
    business.owner = userId;
    await business.save();

    // Obtener datos actualizados para la respuesta
    const updatedUser = await User.findById(userId)
      .select("-password")
      .populate("businessId", "name");

    const updatedBusiness = await Business.findById(businessId)
      .populate("owner", "name email")
      .populate("category", "name type");

    res.json({
      success: true,
      message: "Negocio asignado exitosamente",
      user: updatedUser,
      business: updatedBusiness
    });
  } catch (error) {
    console.error("Error assignBusiness:", error);
    res.status(500).json({
      success: false,
      message: "Error al asignar negocio",
      error: error.message
    });
  }
};

// POST /api/admin/unassign-business - Desasignar negocio de usuario
export const unassignBusiness = async (req, res) => {
  try {
    const { userId, businessId } = req.body;

    if (!userId && !businessId) {
      return res.status(400).json({
        success: false,
        message: "userId o businessId requerido"
      });
    }

    let user, business;

    if (userId) {
      user = await User.findById(userId);
      if (user && user.businessId) {
        business = await Business.findById(user.businessId);
      }
    } else if (businessId) {
      business = await Business.findById(businessId);
      if (business && business.owner) {
        user = await User.findById(business.owner);
      }
    }

    // Limpiar referencias
    if (user) {
      user.businessId = null;
      // Opcional: cambiar rol a customer si ya no tiene negocio
      if (user.role === "business_owner") {
        user.role = "customer";
      }
      await user.save();
    }

    if (business) {
      business.owner = null;
      await business.save();
    }

    res.json({
      success: true,
      message: "Negocio desasignado exitosamente",
      user: user ? { _id: user._id, name: user.name, role: user.role } : null,
      business: business ? { _id: business._id, name: business.name } : null
    });
  } catch (error) {
    console.error("Error unassignBusiness:", error);
    res.status(500).json({
      success: false,
      message: "Error al desasignar negocio",
      error: error.message
    });
  }
};

// GET /api/admin/business-assignments - Ver todas las asignaciones
export const getBusinessAssignments = async (req, res) => {
  try {
    const businesses = await Business.find()
      .select("name isActive owner")
      .populate("owner", "name email phone role")
      .sort({ name: 1 });

    const assignments = businesses.map(b => ({
      business: {
        _id: b._id,
        name: b.name,
        isActive: b.isActive
      },
      owner: b.owner || null,
      hasOwner: !!b.owner
    }));

    const stats = {
      total: businesses.length,
      assigned: assignments.filter(a => a.hasOwner).length,
      unassigned: assignments.filter(a => !a.hasOwner).length
    };

    res.json({
      success: true,
      stats,
      assignments
    });
  } catch (error) {
    console.error("Error getBusinessAssignments:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener asignaciones",
      error: error.message
    });
  }
};
