import { getAllCategories, getCategoryById, } from "../services/categoryService.js";
export const getCategories = async (_req, res) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json({
            success: true,
            categories,
        });
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};
export const getCategory = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch category",
        });
    }
};
//# sourceMappingURL=categoryController.js.map