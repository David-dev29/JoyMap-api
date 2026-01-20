import { Router } from 'express';
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { checkProductOwnership } from "../middlewares/checkOwnership.js";
import upload from "../middlewares/upload.js";
import { allProducts, oneProduct } from '../controllers/products/read.js';
import { createProduct } from '../controllers/products/create.js';
import { updateProduct } from '../controllers/products/update.js';
import { deleteProduct } from '../controllers/products/delete.js';

const router = Router();

// GET - Público
router.get('/', allProducts);
router.get('/:id', oneProduct);

// POST - Solo admin y business_owner pueden crear productos
router.post('/create', verifyToken, requireRole("admin", "business_owner"), upload.single("image"), createProduct);

// PUT - Solo admin y business_owner pueden editar productos
router.put("/:id", verifyToken, requireRole("admin", "business_owner"), checkProductOwnership, upload.single("image"), updateProduct);

// DELETE - Solo admin y business_owner pueden eliminar productos
router.delete('/:id', verifyToken, requireRole("admin", "business_owner"), checkProductOwnership, deleteProduct);

export default router;

