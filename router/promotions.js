import { Router } from "express";
import multer from "multer";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import {
  getActivePromotions,
  getAllPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
  reorderPromotions,
} from "../controllers/promotions.js";

const router = Router();

// Multer para imagen de promoción
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"), false);
    }
  },
});

// Rutas públicas
router.get("/", getActivePromotions);

// Rutas admin (deben ir ANTES de /:id)
router.get("/admin/all", verifyToken, requireRole("admin"), getAllPromotions);
router.post("/", verifyToken, requireRole("admin"), upload.single("image"), createPromotion);
router.put("/reorder", verifyToken, requireRole("admin"), reorderPromotions);

// Rutas con :id
router.get("/:id", getPromotion);
router.put("/:id", verifyToken, requireRole("admin"), upload.single("image"), updatePromotion);
router.delete("/:id", verifyToken, requireRole("admin"), deletePromotion);

export default router;
