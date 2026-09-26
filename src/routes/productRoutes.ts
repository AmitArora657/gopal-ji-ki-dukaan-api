import { Router } from "express";

import {
  addProduct,
  editProduct,
  getProduct,
  getProducts,
  removeProduct,
} from "../controllers/productController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin-only routes
router.post("/", authenticateToken, requireAdmin, addProduct);

router.put("/:id", authenticateToken, requireAdmin, editProduct);

router.delete("/:id", authenticateToken, requireAdmin, removeProduct);

export default router;
