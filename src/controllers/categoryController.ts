import type { Request, Response } from "express";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../services/categoryService.js";

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const category = await getCategoryById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // Validate category name
    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        success: false,
        message: "Category name is required",
      });
      return;
    }

    const category = await createCategory({
      name,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Category already exists") {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error("Error creating category:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

export const removeCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const category = await deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Category not found") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "Category is already inactive"
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error("Error deleting category:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        success: false,
        message: "Category name is required",
      });
      return;
    }

    const category = await updateCategory(id, {
      name,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Category not found") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message === "Category is inactive") {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && error.message === "Category already exists") {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error("Error updating category:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};
