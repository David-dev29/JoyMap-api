import { Router } from 'express';
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { allKitchens, KitchenById } from '../controllers/kitchens/read.js';
import { createKitchen } from '../controllers/kitchens/create.js';
import { updateKitchen } from '../controllers/kitchens/update.js';
import { deleteKitchen } from '../controllers/kitchens/delete.js';

const router = Router();

// GET - Público
router.get('/', allKitchens);
router.get('/:id', KitchenById);

// POST/PUT/DELETE - Solo admin y business_owner
router.post('/create', verifyToken, requireRole("admin", "business_owner"), createKitchen);
router.put('/:id', verifyToken, requireRole("admin", "business_owner"), updateKitchen);
router.delete('/:id', verifyToken, requireRole("admin", "business_owner"), deleteKitchen);

export default router;

