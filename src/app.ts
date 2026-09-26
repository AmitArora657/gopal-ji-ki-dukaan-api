import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/database.js";

import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.get("/api/health", async (_req, res) => {
  try {
    await db.raw("SELECT 1");

    res.json({
      message: "Backend is running",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Backend is running",
      database: "connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
