import db from "../config/database.js";

export const getAllProducts = async () => {
  return db("products as p")
    .select(
      "p.id_product",
      "p.id_category",
      "p.name",
      "p.description",
      "p.price",
      "p.stock_quantity",
      "p.image_url",
      "p.is_active",
      "p.created_at",
      "p.updated_at",
      "p.updated_by",
      "c.name as category_name",
    )
    .join("categories as c", "p.id_category", "c.id_category")
    .where("p.is_active", true)
    .orderBy("p.id_product", "asc");
};

export const getProductById = async (id: number) => {
  return db("products as p")
    .select(
      "p.id_product",
      "p.id_category",
      "p.name",
      "p.description",
      "p.price",
      "p.stock_quantity",
      "p.image_url",
      "p.is_active",
      "p.created_at",
      "p.updated_at",
      "p.updated_by",
      "c.name as category_name",
    )
    .join("categories as c", "p.id_category", "c.id_category")
    .where("p.id_product", id)
    .where("p.is_active", true)
    .first();
};

interface CreateProductInput {
  id_category: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity?: number;
  image_url?: string;
}

export const createProduct = async (product: CreateProductInput) => {
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
        "updated_by",
      ]);

    return createdProduct;
  });
};

export const deleteProduct = async (id: number, updatedBy: number) => {
  return db.transaction(async (trx) => {
    const product = await trx("products")
      .select("id_product", "name", "is_active")
      .where("id_product", id)
      .first();

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.is_active) {
      throw new Error("Product is already inactive");
    }

    const [deletedProduct] = await trx("products")
      .where("id_product", id)
      .update({
        is_active: false,
        updated_at: trx.fn.now(),
        updated_by: updatedBy,
      })
      .returning([
        "id_product",
        "name",
        "id_category",
        "price",
        "stock_quantity",
        "image_url",
        "is_active",
        "created_at",
        "updated_at",
        "updated_by",
      ]);

    return deletedProduct;
  });
};

interface UpdateProductInput {
  id_category: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  updated_by: number;
}

export const updateProduct = async (
  id: number,
  product: UpdateProductInput,
) => {
  return db.transaction(async (trx) => {
    // Check product exists
    const existingProduct = await trx("products")
      .select("id_product", "name", "is_active")
      .where("id_product", id)
      .first();

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    if (!existingProduct.is_active) {
      throw new Error("Product is inactive");
    }

    // Check category exists and is active
    const category = await trx("categories")
      .select("id_category")
      .where("id_category", product.id_category)
      .where("is_active", true)
      .first();

    if (!category) {
      throw new Error("Category not found");
    }

    const productName = product.name.trim();

    // Check duplicate product name
    const duplicateProduct = await trx("products")
      .select("id_product")
      .whereRaw("LOWER(name) = LOWER(?)", [productName])
      .whereNot("id_product", id)
      .first();

    if (duplicateProduct) {
      throw new Error("Product already exists");
    }

    // Update product
    const [updatedProduct] = await trx("products")
      .where("id_product", id)
      .update({
        id_category: product.id_category,
        name: productName,
        description: product.description?.trim() || null,
        price: product.price,
        stock_quantity: product.stock_quantity,
        image_url: product.image_url?.trim() || null,
        updated_at: trx.fn.now(),
        updated_by: product.updated_by,
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
        "updated_by",
      ]);

    return updatedProduct;
  });
};
