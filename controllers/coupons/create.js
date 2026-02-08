import Coupon from "../../models/Coupon.js";
import UserFavorite from "../../models/UserFavorite.js";
import Business from "../../models/Business.js";
import { createNotification } from "../notifications.js";

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

    // Notificar a usuarios que tienen este negocio en favoritos
    try {
      const favorites = await UserFavorite.find({ businessId: targetBusinessId });

      if (favorites.length > 0) {
        const business = await Business.findById(targetBusinessId).select("name");
        const discountText = coupon.discountType === "percentage"
          ? `${coupon.discount}% de descuento`
          : `$${coupon.discount} de descuento`;

        for (const fav of favorites) {
          await createNotification({
            userId: fav.userId,
            type: "promo",
            title: `¡Nuevo cupón en ${business?.name || "tu favorito"}!`,
            message: `${discountText} con el código ${coupon.code}`,
            data: { businessId: targetBusinessId, couponId: coupon._id, code: coupon.code },
          });
        }
      }
    } catch (notifError) {
      console.error("Error enviando notificaciones de cupón:", notifError);
    }

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
