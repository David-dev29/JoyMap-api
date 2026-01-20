// routes/category.routes.js
import { Router } from "express";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { getCategoriesBusiness, getCategoriesByType } from "../controllers/categoriesBusiness/read.js";
import { createCategoryBusiness } from "../controllers/categoriesBusiness/create.js";
import { updateCategoryBusiness } from "../controllers/categoriesBusiness/update.js";
import { deleteCategoryBusiness } from "../controllers/categoriesBusiness/delete.js";

const router = Router();

// GET - Público
router.get("/", getCategoriesBusiness);
router.get("/type/:type", getCategoriesByType);

// POST/PUT/DELETE - Solo admin (categorías de negocio son globales)
router.post("/", verifyToken, requireRole("admin"), createCategoryBusiness);
router.put("/:id", verifyToken, requireRole("admin"), updateCategoryBusiness);
router.delete("/:id", verifyToken, requireRole("admin"), deleteCategoryBusiness);

export default router;
