import { Router } from 'express';
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { uploadCategoryImages } from '../middlewares/upload.js';
import { allCategories, oneCategory } from '../controllers/categories/read.js';
import { createCategory } from '../controllers/categories/create.js';
import { updateCategory } from '../controllers/categories/update.js';
import { deleteCategory } from '../controllers/categories/delete.js';

const router = Router();

// GET - Público
router.get('/', allCategories);
router.get('/:id', oneCategory);

// POST/PUT/DELETE - Solo admin y business_owner
router.post('/create', verifyToken, requireRole("admin", "business_owner"), createCategory);
router.put('/:id', verifyToken, requireRole("admin", "business_owner"), uploadCategoryImages, updateCategory);
router.delete('/:id', verifyToken, requireRole("admin", "business_owner"), deleteCategory);

export default router;

