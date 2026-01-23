import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { createDiscount } from '../controllers/discounts/create.js';
import { getDiscounts, getDiscountById } from '../controllers/discounts/read.js';
import { updateDiscount } from '../controllers/discounts/update.js';
import { deleteDiscount } from '../controllers/discounts/delete.js';
import { validateDiscount } from '../controllers/discounts/validate.js';

const router = Router();

// POST /api/discounts/validate - Validar código de descuento (público, para checkout)
router.post('/validate', validateDiscount);

// POST /api/discounts/create - Crear descuento (admin o business_owner)
router.post('/create', verifyToken, requireRole("admin", "business_owner"), createDiscount);

// GET /api/discounts - Listar descuentos (admin ve todos, owner ve los suyos)
router.get('/', verifyToken, requireRole("admin", "business_owner"), getDiscounts);

// GET /api/discounts/:id - Obtener descuento por ID
router.get('/:id', verifyToken, requireRole("admin", "business_owner"), getDiscountById);

// PUT /api/discounts/:id - Actualizar descuento
router.put('/:id', verifyToken, requireRole("admin", "business_owner"), updateDiscount);

// DELETE /api/discounts/:id - Eliminar descuento
router.delete('/:id', verifyToken, requireRole("admin", "business_owner"), deleteDiscount);

export default router;
