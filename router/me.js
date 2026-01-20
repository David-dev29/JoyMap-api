import { Router } from "express";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { getMyProfile, updateMyProfile } from "../controllers/me/profile.js";
import { getMyBusiness, updateMyBusiness } from "../controllers/me/business.js";
import { getMyProducts, getMyProductsStats } from "../controllers/me/products.js";
import { getMyOrders, getMyActiveOrders, getMyOrdersStats } from "../controllers/me/orders.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// ═══════════════════════════════════════════════════════════
// PERFIL - Todos los usuarios autenticados
// ═══════════════════════════════════════════════════════════
router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);

// ═══════════════════════════════════════════════════════════
// NEGOCIO - Solo business_owner
// ═══════════════════════════════════════════════════════════
router.get("/business", requireRole("business_owner", "admin"), getMyBusiness);
router.put("/business", requireRole("business_owner"), updateMyBusiness);

// ═══════════════════════════════════════════════════════════
// PRODUCTOS - Solo business_owner
// ═══════════════════════════════════════════════════════════
router.get("/products", requireRole("business_owner", "admin"), getMyProducts);
router.get("/products/stats", requireRole("business_owner", "admin"), getMyProductsStats);

// ═══════════════════════════════════════════════════════════
// ÓRDENES - Todos (filtrado por rol en controller)
// ═══════════════════════════════════════════════════════════
router.get("/orders", getMyOrders);
router.get("/orders/active", getMyActiveOrders);
router.get("/orders/stats", getMyOrdersStats);

export default router;
