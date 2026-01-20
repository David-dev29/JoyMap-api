import { Router } from "express";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import {
  assignBusiness,
  unassignBusiness,
  getBusinessAssignments
} from "../controllers/admin/assignBusiness.js";

const router = Router();

// Todas las rutas requieren autenticación + rol admin
router.use(verifyToken);
router.use(requireRole("admin"));

// ═══════════════════════════════════════════════════════════
// ASIGNACIÓN DE NEGOCIOS
// ═══════════════════════════════════════════════════════════

// Asignar negocio a usuario
router.post("/assign-business", assignBusiness);

// Desasignar negocio de usuario
router.post("/unassign-business", unassignBusiness);

// Ver todas las asignaciones
router.get("/business-assignments", getBusinessAssignments);

export default router;
