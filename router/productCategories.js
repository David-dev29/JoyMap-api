import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { createProductCategory } from '../controllers/productCategories/create.js';
import { getProductCategories, getProductCategoriesByBusiness, getProductCategoryById } from '../controllers/productCategories/read.js';
import { updateProductCategory, reorderProductCategories } from '../controllers/productCategories/update.js';
import { deleteProductCategory } from '../controllers/productCategories/delete.js';

const router = Router();

// GET /api/product-categories/business/:businessId - Categorías de un negocio (público)
router.get('/business/:businessId', getProductCategoriesByBusiness);

// POST /api/product-categories/reorder - Reordenar categorías (admin o owner)
router.post('/reorder', verifyToken, requireRole("admin", "business_owner"), reorderProductCategories);

// POST /api/product-categories/create - Crear categoría (admin o owner)
router.post('/create', verifyToken, requireRole("admin", "business_owner"), createProductCategory);

// GET /api/product-categories - Listar todas (solo admin)
router.get('/', verifyToken, requireRole("admin"), getProductCategories);

// GET /api/product-categories/:id - Obtener por ID
router.get('/:id', verifyToken, requireRole("admin", "business_owner"), getProductCategoryById);

// PUT /api/product-categories/:id - Actualizar
router.put('/:id', verifyToken, requireRole("admin", "business_owner"), updateProductCategory);

// DELETE /api/product-categories/:id - Eliminar
router.delete('/:id', verifyToken, requireRole("admin", "business_owner"), deleteProductCategory);

export default router;
