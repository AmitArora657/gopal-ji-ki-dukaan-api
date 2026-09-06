import knex from "knex";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
dotenv.config({
    path: fileURLToPath(new URL("../.env", import.meta.url)),
});
const db = knex({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
});
export default db;
//# sourceMappingURL=database.js.map