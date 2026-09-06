import { Router } from "express";

import {
  addCategory,
  editCategory,
  getCategories,
  getCategory,
  removeCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", addCategory);
router.put("/:id", editCategory);
router.delete("/:id", removeCategory);

export default router;
