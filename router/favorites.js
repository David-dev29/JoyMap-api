import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from "../controllers/favorites.js";

const router = Router();

// Todas las rutas requieren autenticación
router.get("/", verifyToken, getFavorites);
router.get("/check/:businessId", verifyToken, checkFavorite);
router.post("/", verifyToken, addFavorite);
router.delete("/:businessId", verifyToken, removeFavorite);

export default router;
