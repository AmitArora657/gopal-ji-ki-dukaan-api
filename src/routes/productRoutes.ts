import { Router } from "express";

import {
  addProduct,
  editProduct,
  getProduct,
  getProductImage,
  getProducts,
  removeProduct,
} from "../controllers/productController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import { uploadProductImages } from "../middleware/uploadMiddleware.js";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:id/image", getProductImage);
router.get("/:id", getProduct);

// Admin-only routes
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  uploadProductImages,
  addProduct,
);

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  uploadProductImages,
  editProduct,
);

router.delete("/:id", authenticateToken, requireAdmin, removeProduct);

export default router;
