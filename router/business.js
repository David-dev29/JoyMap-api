import { Router } from 'express';
import { verifyToken } from "../middlewares/auth.js";
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


// POST - Crear un nuevo negocio
// Responde a: /api/businesses/create
router.post('/create', verifyToken, uploadBusinessImages, createBusiness);

// PUT - Actualizar un negocio
// Responde a: /api/businesses/:id
router.put('/:id', verifyToken, uploadBusinessImages, updateBusiness);

// DELETE - Eliminar negocio (físico)
// Responde a: /api/businesses/:id
router.delete('/:id', verifyToken, deleteBusiness);

// PATCH - Desactivar negocio (soft delete)
// Responde a: /api/businesses/:id/deactivate
router.patch('/:id/deactivate', verifyToken, softDeleteBusiness);

export default router;