import { Router } from 'express';
import { verifyToken } from "../middlewares/auth.js";
import { uploadCategoryImages } from '../middlewares/upload.js';
import { allCategories, oneCategory } from '../controllers/categories/read.js';
import { createCategory } from '../controllers/categories/create.js';
import { updateCategory } from '../controllers/categories/update.js';
import { deleteCategory } from '../controllers/categories/delete.js';

const router = Router();

// GET - Público
router.get('/', allCategories);
router.get('/:id', oneCategory);

// POST/PUT/DELETE - Protegido
router.post('/create', verifyToken, createCategory);
router.put('/:id', verifyToken, uploadCategoryImages, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

export default router;

