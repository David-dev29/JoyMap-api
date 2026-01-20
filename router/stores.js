import { Router } from "express";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { createStore } from "../controllers/stores/create.js";
import { allStores } from "../controllers/stores/read.js";
import { updateStore } from "../controllers/stores/update.js";
import { destroyStore } from "../controllers/stores/delete.js";
import upload from "../middlewares/upload.js";

const router = Router();

// GET - Público
router.get("/", allStores);

// POST - Solo admin
router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "textLogo", maxCount: 1 }
  ]),
  createStore
);

// PUT - Solo admin y business_owner
router.put(
  "/:id",
  verifyToken,
  requireRole("admin", "business_owner"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "textLogo", maxCount: 1 }
  ]),
  updateStore
);

// DELETE - Solo admin
router.delete("/:id", verifyToken, requireRole("admin"), destroyStore);

export default router;