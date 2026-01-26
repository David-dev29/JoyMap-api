import { Router } from "express";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { createCoupon } from "../controllers/coupons/create.js";
import { getCouponsByBusiness, getActiveCoupon, getMyCoupons, getCouponById } from "../controllers/coupons/read.js";
import { updateCoupon } from "../controllers/coupons/update.js";
import { deleteCoupon } from "../controllers/coupons/delete.js";
import { validateCoupon, useCoupon } from "../controllers/coupons/validate.js";

const router = Router();

// ========== RUTAS PÚBLICAS ==========

// GET /api/coupons/business/:businessId/active - Obtener cupón activo de un negocio (para cliente)
router.get("/business/:businessId/active", getActiveCoupon);

// POST /api/coupons/validate - Validar código de cupón (para checkout)
router.post("/validate", validateCoupon);

// ========== RUTAS PROTEGIDAS ==========

// GET /api/coupons/my - Obtener mis cupones (business_owner)
router.get("/my", verifyToken, requireRole("business_owner"), getMyCoupons);

// POST /api/coupons - Crear cupón (admin o business_owner)
router.post("/", verifyToken, requireRole("admin", "business_owner"), createCoupon);

// GET /api/coupons/business/:businessId - Obtener cupones de un negocio
router.get("/business/:businessId", verifyToken, requireRole("admin", "business_owner"), getCouponsByBusiness);

// GET /api/coupons/:id - Obtener cupón por ID
router.get("/:id", verifyToken, requireRole("admin", "business_owner"), getCouponById);

// PUT /api/coupons/:id - Actualizar cupón
router.put("/:id", verifyToken, requireRole("admin", "business_owner"), updateCoupon);

// DELETE /api/coupons/:id - Eliminar cupón
router.delete("/:id", verifyToken, requireRole("admin", "business_owner"), deleteCoupon);

// POST /api/coupons/:id/use - Registrar uso de cupón (cuando se completa orden)
router.post("/:id/use", verifyToken, useCoupon);

export default router;
