import { Router } from 'express';
import upload from "../middlewares/upload.js";
import { allProducts, oneProduct } from '../controllers/products/read.js';
import { createProduct } from '../controllers/products/create.js';
import { updateProduct } from '../controllers/products/update.js';
import { deleteProduct } from '../controllers/products/delete.js';


const router = Router();


// GET /api/stores
router.get('/', allProducts);
router.get('/:id', oneProduct);


// POST /api/stores
router.post('/create',upload.single("image"), createProduct);


// PUT /api/stores/:id

router.put("/:id", upload.single("image"), updateProduct);


// DELETE /api/stores/:id
router.delete('/:id', deleteProduct);

export default router;

