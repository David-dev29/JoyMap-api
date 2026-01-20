import { Router } from 'express';
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { checkBusinessOwnership } from "../middlewares/checkOwnership.js";
import { allMapBusinesses, getAllBusinesses, mapBusinessByID, getBusinessesByType, getBusinessBySlug } from "../controllers/businesses/read.js";
import { createBusiness } from '../controllers/businesses/create.js';
import { updateBusiness } from '../controllers/businesses/update.js';
import { deleteBusiness, softDeleteBusiness } from '../controllers/businesses/delete.js';
import { uploadBusinessImages } from '../middlewares/upload.js';

const router = Router();

// 🔥 RUTA PARA EL MAPA - Debe estar PRIMERO
// Responde a: /api/map/businesses
router.get("/businesses", allMapBusinesses);

// GET - Obtener todos los negocios activos
// Responde a: /api/businesses/
router.get("/", getAllBusinesses);

// ✅ NUEVA RUTA - debe ir ANTES de /:id
router.get("/slug/:slug", getBusinessBySlug);

// ✅ NUEVO: Obtener negocios por tipo
router.get("/type/:type", getBusinessesByType);

// GET - Obtener negocio por ID
// Responde a: /api/businesses/:id (sin /businesses/ duplicado)
router.get("/:id", mapBusinessByID);


// POST - Crear un nuevo negocio (solo admin)
router.post('/create', verifyToken, requireRole("admin"), uploadBusinessImages, createBusiness);

// PUT - Actualizar un negocio (admin o business_owner de ese negocio)
router.put('/:id', verifyToken, requireRole("admin", "business_owner"), checkBusinessOwnership, uploadBusinessImages, updateBusiness);

// DELETE - Eliminar negocio (solo admin)
router.delete('/:id', verifyToken, requireRole("admin"), deleteBusiness);

// PATCH - Desactivar negocio (solo admin)
router.patch('/:id/deactivate', verifyToken, requireRole("admin"), softDeleteBusiness);

export default router;