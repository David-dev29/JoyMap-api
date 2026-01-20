import { Router } from 'express';
import { verifyToken } from "../middlewares/auth.js";
import { allKitchens, KitchenById } from '../controllers/kitchens/read.js';
import { createKitchen } from '../controllers/kitchens/create.js';
import { updateKitchen } from '../controllers/kitchens/update.js';
import { deleteKitchen } from '../controllers/kitchens/delete.js';

const router = Router();

// GET - Público
router.get('/', allKitchens);
router.get('/:id', KitchenById);

// POST/PUT/DELETE - Protegido
router.post('/create', verifyToken, createKitchen);
router.put('/:id', verifyToken, updateKitchen);
router.delete('/:id', verifyToken, deleteKitchen);

export default router;

