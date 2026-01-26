import Coupon from "../../models/Coupon.js";

// Obtener cupones de un negocio
export const getCouponsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    // Verificar permisos: admin puede ver cualquiera, owner solo los suyos
    if (req.user.role === "business_owner" && req.user.businessId?.toString() !== businessId) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver estos cupones"
      });
    }

    const coupons = await Coupon.find({ businessId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    console.error("Error obteniendo cupones:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener cupón activo de un negocio (para mostrar en cliente - público)
export const getActiveCoupon = async (req, res) => {
  try {
    const { businessId } = req.params;
    const now = new Date();

    const coupon = await Coupon.findOne({
      businessId,
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ maxUses: null }, { $expr: { $lt: ["$usedCount", "$maxUses"] } }] }
      ]
    }).sort({ discount: -1 }); // El de mayor descuento primero

    res.json({
      success: true,
      coupon: coupon || null
    });
  } catch (error) {
    console.error("Error obteniendo cupón activo:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener todos los cupones del negocio del owner autenticado
export const getMyCoupons = async (req, res) => {
  try {
    if (!req.user.businessId) {
      return res.status(404).json({
        success: false,
        message: "No tienes un negocio asignado"
      });
    }

    const coupons = await Coupon.find({ businessId: req.user.businessId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    console.error("Error obteniendo mis cupones:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener cupón por ID
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id).populate("businessId", "name");

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Cupón no encontrado"
      });
    }

    // Verificar permisos
    if (req.user.role === "business_owner" && req.user.businessId?.toString() !== coupon.businessId._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver este cupón"
      });
    }

    res.json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error("Error obteniendo cupón:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
