import { Router } from "express";

import {
  addCategory,
  editCategory,
  getCategories,
  getCategory,
  removeCategory,
} from "../controllers/categoryController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

// Public routes
router.get("/", getCategories);
router.get("/:id", getCategory);

// Admin-only routes
router.post("/", authenticateToken, requireAdmin, addCategory);

router.put("/:id", authenticateToken, requireAdmin, editCategory);

router.delete("/:id", authenticateToken, requireAdmin, removeCategory);

export default router;
