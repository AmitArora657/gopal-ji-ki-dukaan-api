import db from "../config/database.js";

interface ProductImageSummary {
  id_image: number;
  is_primary: boolean;
}

const attachImages = async <T extends { id_product: number }>(
  products: T[],
): Promise<(T & { images: ProductImageSummary[] })[]> => {
  if (products.length === 0) {
    return [];
  }

  const rows: (ProductImageSummary & { id_product: number })[] = await db(
    "product_images",
  )
    .select("id_image", "id_product", "is_primary")
    .whereIn(
      "id_product",
      products.map((product) => product.id_product),
    )
    .orderBy([
      { column: "is_primary", order: "desc" },
      { column: "id_image", order: "asc" },
    ]);

  return products.map((product) => ({
    ...product,
    images: rows
      .filter((row) => row.id_product === product.id_product)
      .map(({ id_image, is_primary }) => ({ id_image, is_primary })),
  }));
};

export const getAllProducts = async () => {
  const products = await db("products as p")
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

  return attachImages(products);
};

export const getProductById = async (id: number) => {
  const product = await db("products as p")
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

  if (!product) {
    return undefined;
  }

  const [productWithImages] = await attachImages([product]);

  return productWithImages;
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

export const saveProductImages = async (
  id_product: number,
  images: Express.Multer.File[],
) => {
  if (images.length === 0) {
    return [];
  }

  return db("product_images")
    .insert(
      images.map((image, index) => ({
        id_product,
        image_data: image.buffer,
        image_mime_type: image.mimetype,
        is_primary: index === 0,
      })),
    )
    .returning(["id_image", "id_product", "image_mime_type", "is_primary"]);
};

export const getProductImageById = async (
  id_product: number,
  id_image: number,
) => {
  return db("product_images")
    .select("image_data", "image_mime_type")
    .where("id_product", id_product)
    .where("id_image", id_image)
    .first();
};
