import { Router } from "express";
import { addProduct, getProduct, getProducts, } from "../controllers/productController.js";
const router = Router();
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", addProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map