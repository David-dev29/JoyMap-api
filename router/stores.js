import { Router } from "express";
import { createStore } from "../controllers/stores/create.js";
import { allStores } from "../controllers/stores/read.js";
import { updateStore } from "../controllers/stores/update.js";
import { destroyStore } from "../controllers/stores/delete.js";
import upload from "../middlewares/upload.js";

const router = Router();

// GET /api/stores → Obtener tienda
router.get("/", allStores);

// POST /api/stores → Crear tienda con logo, banner y textLogo
router.post(
  "/",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "textLogo", maxCount: 1 } // ✨ NUEVO
  ]),
  createStore
);

// PUT /api/stores/:id → Actualizar tienda con logo/banner/textLogo opcionales
router.put(
  "/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "textLogo", maxCount: 1 } // ✨ NUEVO
  ]),
  updateStore
);

// DELETE /api/stores/:id → Eliminar tienda
router.delete("/:id", destroyStore);

export default router;