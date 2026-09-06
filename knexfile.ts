import type { Knex } from "knex";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("./src/.env", import.meta.url)),
});

const config: Knex.Config = {
  client: "pg",

  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  migrations: {
    directory: "./migrations",
  },

  seeds: {
    directory: "./seeds",
  },
};

export default config;
