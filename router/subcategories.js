import { Router } from 'express';
import { verifyToken, requireRole } from "../middlewares/auth.js";
import createSubcategory from "../controllers/subcategories/create.js";
import getAllSubcategories from "../controllers/subcategories/read.js";
import updateSubcategory from "../controllers/subcategories/update.js";
import deleteSubcategory from "../controllers/subcategories/delete.js";

const router = Router();

// GET - Público
router.get('/', getAllSubcategories);

// POST/PUT/DELETE - Solo admin y business_owner
router.post('/create', verifyToken, requireRole("admin", "business_owner"), createSubcategory);
router.put('/:id', verifyToken, requireRole("admin", "business_owner"), updateSubcategory);
router.delete('/:id', verifyToken, requireRole("admin", "business_owner"), deleteSubcategory);

export default router;

