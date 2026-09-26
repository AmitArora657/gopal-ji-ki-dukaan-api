import { Router } from "express";

import { login } from "../controllers/authController.js";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/login", login);

router.get("/me", authenticateToken, (req: AuthenticatedRequest, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    user: req.user,
  });
});

router.get(
  "/admin-test",
  authenticateToken,
  requireAdmin,
  (req: AuthenticatedRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
      user: req.user,
    });
  },
);

export default router;
