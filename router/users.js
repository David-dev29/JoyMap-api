import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { allUsers } from "../controllers/users/read.js";
import createUser from "../controllers/users/create.js";
import updateUser from "../controllers/users/update.js";
import deleteUser from "../controllers/users/delete.js";

const router = Router();

// Todas las rutas de users requieren autenticación
router.get('/', verifyToken, allUsers);
router.post('/create', verifyToken, createUser);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

export default router;