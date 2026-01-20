import { Router } from "express";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { allUsers } from "../controllers/users/read.js";
import createUser from "../controllers/users/create.js";
import updateUser from "../controllers/users/update.js";
import deleteUser from "../controllers/users/delete.js";

const router = Router();

// GET /users - Solo admin puede ver todos los usuarios
router.get("/", verifyToken, requireRole("admin"), allUsers);

// POST /users/create - Solo admin puede crear usuarios con roles
router.post("/create", verifyToken, requireRole("admin"), createUser);

// PUT /users/:id - Admin puede editar cualquiera, otros solo a sí mismos
router.put("/:id", verifyToken, updateUser);

// DELETE /users/:id - Solo admin puede eliminar usuarios
router.delete("/:id", verifyToken, requireRole("admin"), deleteUser);

export default router;