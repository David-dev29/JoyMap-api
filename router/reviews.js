import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { createReview } from '../controllers/reviews/create.js';
import { getReviews, getReviewsByBusiness, getReviewById } from '../controllers/reviews/read.js';
import { updateReview } from '../controllers/reviews/update.js';
import { deleteReview } from '../controllers/reviews/delete.js';

const router = Router();

// GET /api/reviews/business/:businessId - Reseñas de un negocio (público)
router.get('/business/:businessId', getReviewsByBusiness);

// POST /api/reviews/create - Crear reseña (solo customers)
router.post('/create', verifyToken, requireRole("customer"), createReview);

// GET /api/reviews - Listar todas las reseñas (solo admin)
router.get('/', verifyToken, requireRole("admin"), getReviews);

// GET /api/reviews/:id - Obtener reseña por ID
router.get('/:id', verifyToken, getReviewById);

// PUT /api/reviews/:id - Actualizar visibilidad (solo admin)
router.put('/:id', verifyToken, requireRole("admin"), updateReview);

// DELETE /api/reviews/:id - Eliminar reseña (solo admin)
router.delete('/:id', verifyToken, requireRole("admin"), deleteReview);

export default router;
