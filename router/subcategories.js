import { Router } from 'express';
import createSubcategory from "../controllers/subcategories/create.js";
import getAllSubcategories from "../controllers/subcategories/read.js";
import updateSubcategory from "../controllers/subcategories/update.js";
import deleteSubcategory from "../controllers/subcategories/delete.js";


const router = Router();


// GET /api/stores
router.get('/', getAllSubcategories);
// router.get('/:id', oneCategory);

// Endpoint para crear la tienda (solo si no existe)
// POST /api/stores
router.post('/create', createSubcategory);


// PUT /api/stores/:id
router.put('/:id', updateSubcategory);

// Endpoint para eliminar la tienda y todos sus datos
// DELETE /api/stores/:id
router.delete('/:id', deleteSubcategory);

export default router;

