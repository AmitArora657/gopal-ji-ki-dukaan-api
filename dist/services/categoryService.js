import db from "../config/database.js";
export const getAllCategories = async () => {
    return db("categories")
        .select("id_category", "name", "is_active", "created_at", "updated_at")
        .where("is_active", true)
        .orderBy("id_category", "asc");
};
export const getCategoryById = async (id) => {
    return db("categories")
        .select("id_category", "name", "is_active", "created_at", "updated_at")
        .where("id_category", id)
        .where("is_active", true)
        .first();
};
//# sourceMappingURL=categoryService.js.map