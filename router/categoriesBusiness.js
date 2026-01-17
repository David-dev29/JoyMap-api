// routes/category.routes.js
import { Router } from "express";

import { getCategoriesBusiness, getCategoriesByType } from "../controllers/categoriesBusiness/read.js";
import { createCategoryBusiness } from "../controllers/categoriesBusiness/create.js";
import { updateCategoryBusiness } from "../controllers/categoriesBusiness/update.js";
import { deleteCategoryBusiness } from "../controllers/categoriesBusiness/delete.js";

const router = Router();

router.get("/", getCategoriesBusiness);
// ✅ NUEVO: Obtener categorías por tipo
router.get("/type/:type", getCategoriesByType);
router.post("/", createCategoryBusiness);
router.put("/:id", updateCategoryBusiness);
router.delete("/:id", deleteCategoryBusiness);

export default router;
