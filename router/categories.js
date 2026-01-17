import { Router } from 'express';
import { uploadCategoryImages } from '../middlewares/upload.js';
import { allCategories, oneCategory } from '../controllers/categories/read.js';
import { createCategory } from '../controllers/categories/create.js';
import { updateCategory } from '../controllers/categories/update.js';
import { deleteCategory } from '../controllers/categories/delete.js';


const router = Router();

// Endpoint para leer la información de la tienda
// GET /api/stores
router.get('/', allCategories);
router.get('/:id', oneCategory);

// Endpoint para crear la tienda (solo si no existe)
// POST /api/stores
router.post('/create', createCategory);


// PUT /api/stores/:id
router.put('/:id',uploadCategoryImages, updateCategory);

// Endpoint para eliminar la tienda y todos sus datos
// DELETE /api/stores/:id
router.delete('/:id', deleteCategory);

export default router;

