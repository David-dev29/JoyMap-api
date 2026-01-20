// routes/category.routes.js
import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getCategoriesBusiness, getCategoriesByType } from "../controllers/categoriesBusiness/read.js";
import { createCategoryBusiness } from "../controllers/categoriesBusiness/create.js";
import { updateCategoryBusiness } from "../controllers/categoriesBusiness/update.js";
import { deleteCategoryBusiness } from "../controllers/categoriesBusiness/delete.js";

const router = Router();

// GET - Público
router.get("/", getCategoriesBusiness);
router.get("/type/:type", getCategoriesByType);

// POST/PUT/DELETE - Protegido
router.post("/", verifyToken, createCategoryBusiness);
router.put("/:id", verifyToken, updateCategoryBusiness);
router.delete("/:id", verifyToken, deleteCategoryBusiness);

export default router;
