import { Router } from "express";

import {
  addProduct,
  editProduct,
  getProduct,
  getProducts,
  removeProduct,
} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", addProduct);
router.delete("/:id", removeProduct);
router.put("/:id", editProduct);

export default router;
