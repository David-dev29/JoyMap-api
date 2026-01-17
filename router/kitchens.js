import { Router } from 'express';
import { allKitchens, KitchenById } from '../controllers/kitchens/read.js';
import { createKitchen } from '../controllers/kitchens/create.js';
import { updateKitchen } from '../controllers/kitchens/update.js';
import { deleteKitchen } from '../controllers/kitchens/delete.js';


const router = Router();


// GET 
router.get('/', allKitchens);
router.get('/:id', KitchenById);


// POST 
router.post('/create', createKitchen);


// PUT 
router.put('/:id', updateKitchen);


// DELETE 
router.delete('/:id', deleteKitchen);

export default router;

