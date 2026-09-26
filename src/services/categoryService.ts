import db from "../config/database.js";

export const getAllCategories = async () => {
  return db("categories")
    .select(
      "id_category",
      "name",
      "is_active",
      "created_at",
      "updated_at",
      "updated_by",
    )
    .where("is_active", true)
    .orderBy("id_category", "asc");
};

export const getCategoryById = async (id: number) => {
  return db("categories")
    .select(
      "id_category",
      "name",
      "is_active",
      "created_at",
      "updated_at",
      "updated_by",
    )
    .where("id_category", id)
    .where("is_active", true)
    .first();
};

interface CreateCategoryInput {
  name: string;
}

export const createCategory = async (category: CreateCategoryInput) => {
  return db.transaction(async (trx) => {
    const categoryName = category.name.trim();

    // Check that the category exists or not
    const categoryExists = await trx("categories")
      .select("id_category")
      .whereRaw("LOWER(name) = LOWER(?)", [categoryName])
      .first();

    if (categoryExists) {
      throw new Error("Category already exists");
    }

    // Insert the category
    const [createdCategory] = await trx("categories")
      .insert({
        name: categoryName,
      })
      .returning([
        "id_category",
        "name",
        "is_active",
        "created_at",
        "updated_at",
        "updated_by",
      ]);

    return createdCategory;
  });
};

export const deleteCategory = async (id: number, updatedBy: number) => {
  return db.transaction(async (trx) => {
    const category = await trx("categories")
      .select("id_category", "name", "is_active")
      .where("id_category", id)
      .first();

    if (!category) {
      throw new Error("Category not found");
    }

    if (!category.is_active) {
      throw new Error("Category is already inactive");
    }

    const [deletedCategory] = await trx("categories")
      .where("id_category", id)
      .update({
        is_active: false,
        updated_at: trx.fn.now(),
        updated_by: updatedBy,
      })
      .returning([
        "id_category",
        "name",
        "is_active",
        "created_at",
        "updated_at",
        "updated_by",
      ]);

    return deletedCategory;
  });
};

interface UpdateCategoryInput {
  name: string;
  updated_by: number;
}

export const updateCategory = async (
  id: number,
  category: UpdateCategoryInput,
) => {
  return db.transaction(async (trx) => {
    const categoryName = category.name.trim();

    // Check category exists
    const existingCategory = await trx("categories")
      .select("id_category", "name", "is_active")
      .where("id_category", id)
      .first();

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    if (!existingCategory.is_active) {
      throw new Error("Category is inactive");
    }

    // Check duplicate name
    const duplicateCategory = await trx("categories")
      .select("id_category")
      .whereRaw("LOWER(name) = LOWER(?)", [categoryName])
      .whereNot("id_category", id)
      .first();

    if (duplicateCategory) {
      throw new Error("Category already exists");
    }

    // Update category
    const [updatedCategory] = await trx("categories")
      .where("id_category", id)
      .update({
        name: categoryName,
        updated_at: trx.fn.now(),
        updated_by: category.updated_by,
      })
      .returning([
        "id_category",
        "name",
        "is_active",
        "created_at",
        "updated_at",
        "updated_by",
      ]);

    return updatedCategory;
  });
};
