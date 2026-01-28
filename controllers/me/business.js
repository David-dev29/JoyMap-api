import Business from "../../models/Business.js";

// GET /api/me/business - Obtener mi negocio (solo business_owner)
export const getMyBusiness = async (req, res) => {
  try {
    // Verificar que el usuario tenga un negocio asignado
    if (!req.user.businessId) {
      return res.status(404).json({
        success: false,
        message: "No tienes un negocio asignado"
      });
    }

    const business = await Business.findById(req.user.businessId)
      .populate("category", "name slug icon type")
      .populate("owner", "name email phone");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Negocio no encontrado"
      });
    }

    res.json({
      success: true,
      business
    });
  } catch (error) {
    console.error("Error getMyBusiness:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener negocio",
      error: error.message
    });
  }
};

// PUT /api/me/business - Actualizar mi negocio (solo business_owner)
export const updateMyBusiness = async (req, res) => {
  try {
    if (!req.user.businessId) {
      return res.status(404).json({
        success: false,
        message: "No tienes un negocio asignado"
      });
    }

    const {
      name,
      description,
      isOpen,
      deliveryTime,
      deliveryCost,
      minOrderAmount,
      address,
      paymentMethods,
      brandColor,
      mapIcon,
      iconType,
      iconSvg
    } = req.body;

    // Solo permitir actualizar ciertos campos (no location, category, etc.)
    const allowedUpdates = {};
    if (name) allowedUpdates.name = name;
    if (description !== undefined) allowedUpdates.description = description;
    if (isOpen !== undefined) allowedUpdates.isOpen = isOpen;
    if (deliveryTime) allowedUpdates.deliveryTime = deliveryTime;
    if (deliveryCost !== undefined) allowedUpdates.deliveryCost = deliveryCost;
    if (minOrderAmount !== undefined) allowedUpdates.minOrderAmount = minOrderAmount;
    if (address) allowedUpdates.address = address;
    if (paymentMethods !== undefined) allowedUpdates.paymentMethods = paymentMethods;
    if (brandColor !== undefined) allowedUpdates.brandColor = brandColor;
    if (mapIcon !== undefined) allowedUpdates.mapIcon = mapIcon;
    if (iconType !== undefined) allowedUpdates.iconType = iconType;
    if (iconSvg !== undefined) allowedUpdates.iconSvg = iconSvg;

    const business = await Business.findByIdAndUpdate(
      req.user.businessId,
      allowedUpdates,
      { new: true, runValidators: true }
    ).populate("category", "name slug icon type");

    res.json({
      success: true,
      message: "Negocio actualizado",
      business
    });
  } catch (error) {
    console.error("Error updateMyBusiness:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar negocio",
      error: error.message
    });
  }
};
