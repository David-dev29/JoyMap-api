import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { createStore } from "../controllers/stores/create.js";
import { allStores } from "../controllers/stores/read.js";
import { updateStore } from "../controllers/stores/update.js";
import { destroyStore } from "../controllers/stores/delete.js";
import upload from "../middlewares/upload.js";

const router = Router();

// GET - Público
router.get("/", allStores);

// POST - Protegido
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "textLogo", maxCount: 1 }
  ]),
  createStore
);

// PUT - Protegido
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "textLogo", maxCount: 1 }
  ]),
  updateStore
);

// DELETE - Protegido
router.delete("/:id", verifyToken, destroyStore);

export default router;