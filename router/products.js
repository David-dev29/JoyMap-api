import { Router } from 'express';
import { verifyToken } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import { allProducts, oneProduct } from '../controllers/products/read.js';
import { createProduct } from '../controllers/products/create.js';
import { updateProduct } from '../controllers/products/update.js';
import { deleteProduct } from '../controllers/products/delete.js';


const router = Router();


// GET /api/stores
router.get('/', allProducts);
router.get('/:id', oneProduct);


// POST /api/products
router.post('/create', verifyToken, upload.single("image"), createProduct);

// PUT /api/products/:id
router.put("/:id", verifyToken, upload.single("image"), updateProduct);

// DELETE /api/products/:id
router.delete('/:id', verifyToken, deleteProduct);

export default router;

