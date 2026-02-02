import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { getGlobalStats } from '../controllers/stats/globalStats.js';

const router = Router();

// GET /api/stats/global - Estadísticas globales (solo admin)
router.get('/global', verifyToken, requireRole('admin'), getGlobalStats);

export default router;
