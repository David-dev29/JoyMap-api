import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import { getSettings, getFullSettings } from '../controllers/settings/read.js';
import { updateSettings, uploadLogo } from '../controllers/settings/update.js';

const router = Router();

// GET /api/settings - PÚBLICO (para la app cliente)
router.get('/', getSettings);

// GET /api/settings/full - Solo ADMIN (incluye todos los campos)
router.get('/full', verifyToken, requireRole("admin"), getFullSettings);

// PUT /api/settings - Solo ADMIN (actualizar configuración)
router.put('/', verifyToken, requireRole("admin"), updateSettings);

// POST /api/settings/upload-logo - Solo ADMIN (subir logo)
// Body: form-data con 'logo' (file) y 'type' ('logo' o 'logoText')
router.post('/upload-logo', verifyToken, requireRole("admin"), upload.single('logo'), uploadLogo);

export default router;
