import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../services/productService.js";

export const getProducts = async (
  _req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const getProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

export const addProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id_category, name, description, price, stock_quantity, image_url } =
      req.body;

    if (!Number.isInteger(id_category) || id_category <= 0) {
      res.status(400).json({
        success: false,
        message: "Valid category ID is required",
      });
      return;
    }

    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        success: false,
        message: "Product name is required",
      });
      return;
    }

    if (typeof price !== "number" || price < 0) {
      res.status(400).json({
        success: false,
        message: "Valid product price is required",
      });
      return;
    }

    if (
      stock_quantity !== undefined &&
      (!Number.isInteger(stock_quantity) || stock_quantity < 0)
    ) {
      res.status(400).json({
        success: false,
        message: "Stock quantity must be a non-negative integer",
      });
      return;
    }

    const product = await createProduct({
      id_category,
      name: name.trim(),
      description,
      price,
      stock_quantity,
      image_url,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    if (
      error instanceof Error &&
      error.message === "Category not found or inactive"
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

export const removeProduct = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const product = await deleteProduct(id, req.user.id_user);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Product not found") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "Product is already inactive"
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error("Error deleting product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

export const editProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const { id_category, name, description, price, stock_quantity, image_url } =
      req.body;

    // Basic validation
    if (!Number.isInteger(id_category) || id_category <= 0) {
      res.status(400).json({
        success: false,
        message: "Valid category ID is required",
      });
      return;
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        success: false,
        message: "Product name is required",
      });
      return;
    }

    if (typeof price !== "number" || price <= 0) {
      res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
      return;
    }

    if (!Number.isInteger(stock_quantity) || stock_quantity < 0) {
      res.status(400).json({
        success: false,
        message: "Stock quantity must be a non-negative integer",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const product = await updateProduct(id, {
      id_category,
      name,
      description,
      price,
      stock_quantity,
      image_url,
      updated_by: req.user.id_user,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Product not found") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message === "Product is inactive") {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message === "Category not found") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message === "Product already exists") {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error("Error updating product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};
