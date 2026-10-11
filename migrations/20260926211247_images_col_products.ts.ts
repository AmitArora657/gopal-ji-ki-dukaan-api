import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE TABLE IF NOT EXISTS public.product_images (
      id_image INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      id_product INTEGER NOT NULL,
      image_data BYTEA NOT NULL,
      image_mime_type VARCHAR(50) NOT NULL,
      is_primary BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_product_images_product
        FOREIGN KEY (id_product)
        REFERENCES public.products (id_product)
        ON DELETE CASCADE
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE IF EXISTS public.product_images;
  `);
}
