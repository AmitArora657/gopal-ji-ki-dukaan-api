import db from "../config/database.js";
export const getAllProducts = async () => {
    return db("products as p")
        .select("p.id_product", "p.id_category", "p.name", "p.description", "p.price", "p.stock_quantity", "p.image_url", "p.is_active", "p.created_at", "p.updated_at", "c.name as category_name")
        .join("categories as c", "p.id_category", "c.id_category")
        .where("p.is_active", true)
        .orderBy("p.id_product", "asc");
};
export const getProductById = async (id) => {
    return db("products as p")
        .select("p.id_product", "p.id_category", "p.name", "p.description", "p.price", "p.stock_quantity", "p.image_url", "p.is_active", "p.created_at", "p.updated_at", "c.name as category_name")
        .join("categories as c", "p.id_category", "c.id_category")
        .where("p.id_product", id)
        .where("p.is_active", true)
        .first();
};
export const createProduct = async (product) => {
    return db.transaction(async (trx) => {
        // Check that the category exists and is active
        const category = await trx("categories")
            .select("id_category")
            .where("id_category", product.id_category)
            .where("is_active", true)
            .first();
        if (!category) {
            throw new Error("Category not found or inactive");
        }
        // Insert the product
        const [createdProduct] = await trx("products")
            .insert({
            id_category: product.id_category,
            name: product.name,
            description: product.description ?? null,
            price: product.price,
            stock_quantity: product.stock_quantity ?? 0,
            image_url: product.image_url ?? null,
        })
            .returning([
            "id_product",
            "id_category",
            "name",
            "description",
            "price",
            "stock_quantity",
            "image_url",
            "is_active",
            "created_at",
            "updated_at",
        ]);
        return createdProduct;
    });
};
//# sourceMappingURL=productService.js.map