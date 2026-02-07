// routes/category.routes.js
import { Router } from "express";
import multer from "multer";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { getCategoriesBusiness, getCategoriesByType } from "../controllers/categoriesBusiness/read.js";
import { createCategoryBusiness } from "../controllers/categoriesBusiness/create.js";
import { updateCategoryBusiness } from "../controllers/categoriesBusiness/update.js";
import { deleteCategoryBusiness } from "../controllers/categoriesBusiness/delete.js";

const router = Router();

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

// GET - Público
router.get("/", getCategoriesBusiness);
router.get("/type/:type", getCategoriesByType);

// POST/PUT/DELETE - Solo admin (categorías de negocio son globales)
router.post("/", verifyToken, requireRole("admin"), upload.single("image"), createCategoryBusiness);
router.put("/:id", verifyToken, requireRole("admin"), upload.single("image"), updateCategoryBusiness);
router.delete("/:id", verifyToken, requireRole("admin"), deleteCategoryBusiness);

export default router;
