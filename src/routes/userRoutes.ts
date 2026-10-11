import { Router } from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  registerUser,
} from "../controllers/userController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

// Public customer registration
router.post("/register", registerUser);

// Admin-only user management
router.get("/", authenticateToken, requireAdmin, getAllUsers);

router.get("/:id", authenticateToken, requireAdmin, getUserById);

router.post("/", authenticateToken, requireAdmin, createUser);

export default router;
