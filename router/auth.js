import { Router } from "express";
import { register } from "../controllers/auth/register.js";
import { login } from "../controllers/auth/login.js";
import { quickRegister } from "../controllers/auth/quickRegister.js";

const router = Router();

// Registro completo (con password)
router.post("/register", register);

// Login (con password)
router.post("/login", login);

// Registro rápido (sin password) - para flujo híbrido del cliente
router.post("/quick-register", quickRegister);

export default router;
