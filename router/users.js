import { Router } from "express";
import { allUsers } from "../controllers/users/read.js";
import  createUser  from "../controllers/users/create.js";
import  updateUser  from "../controllers/users/update.js";
import  deleteUser  from "../controllers/users/delete.js";

const router = Router();

router.get('/', allUsers)

// POST /api/stores
router.post('/create', createUser);


// PUT /api/stores/:id
router.put('/:id', updateUser);


// DELETE /api/stores/:id
router.delete('/:id', deleteUser);

export default router