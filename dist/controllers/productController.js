import { createProduct, getAllProducts, getProductById, } from "../services/productService.js";
export const getProducts = async (_req, res) => {
    try {
        const products = await getAllProducts();
        res.status(200).json({
            success: true,
            products,
        });
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};
export const getProduct = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
        });
    }
};
export const addProduct = async (req, res) => {
    try {
        const { id_category, name, description, price, stock_quantity, image_url } = req.body;
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
        if (stock_quantity !== undefined &&
            (!Number.isInteger(stock_quantity) || stock_quantity < 0)) {
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
    }
    catch (error) {
        console.error("Error creating product:", error);
        if (error instanceof Error &&
            error.message === "Category not found or inactive") {
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
//# sourceMappingURL=productController.js.map