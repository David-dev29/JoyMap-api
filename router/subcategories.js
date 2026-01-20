import { Router } from 'express';
import { verifyToken } from "../middlewares/auth.js";
import createSubcategory from "../controllers/subcategories/create.js";
import getAllSubcategories from "../controllers/subcategories/read.js";
import updateSubcategory from "../controllers/subcategories/update.js";
import deleteSubcategory from "../controllers/subcategories/delete.js";

const router = Router();

// GET - Público
router.get('/', getAllSubcategories);

// POST/PUT/DELETE - Protegido
router.post('/create', verifyToken, createSubcategory);
router.put('/:id', verifyToken, updateSubcategory);
router.delete('/:id', verifyToken, deleteSubcategory);

export default router;

