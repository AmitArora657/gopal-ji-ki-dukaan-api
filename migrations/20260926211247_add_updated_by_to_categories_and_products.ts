import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE categories
    ADD COLUMN updated_by INTEGER NULL,
    ADD CONSTRAINT fk_categories_updated_by
      FOREIGN KEY (updated_by)
      REFERENCES users(id_user)
      ON DELETE SET NULL;
  `);

  await knex.raw(`
    ALTER TABLE products
    ADD COLUMN updated_by INTEGER NULL,
    ADD CONSTRAINT fk_products_updated_by
      FOREIGN KEY (updated_by)
      REFERENCES users(id_user)
      ON DELETE SET NULL;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE products
    DROP CONSTRAINT IF EXISTS fk_products_updated_by,
    DROP COLUMN IF EXISTS updated_by;
  `);

  await knex.raw(`
    ALTER TABLE categories
    DROP CONSTRAINT IF EXISTS fk_categories_updated_by,
    DROP COLUMN IF EXISTS updated_by;
  `);
}
