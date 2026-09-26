import bcrypt from "bcrypt";
import db from "../config/database.js";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN";
}

export const getAllUsers = async () => {
  return db("users")
    .select(
      "id_user",
      "name",
      "email",
      "role",
      "is_active",
      "created_at",
      "updated_at",
    )
    .orderBy("id_user", "asc");
};

export const getUserById = async (id: number) => {
  return db("users")
    .select(
      "id_user",
      "name",
      "email",
      "role",
      "is_active",
      "created_at",
      "updated_at",
    )
    .where("id_user", id)
    .first();
};

export const getUserByEmail = async (email: string) => {
  return db("users")
    .select(
      "id_user",
      "name",
      "email",
      "password_hash",
      "role",
      "is_active",
      "created_at",
      "updated_at",
    )
    .whereRaw("LOWER(email) = LOWER(?)", [email.trim()])
    .first();
};

export const createUser = async (user: CreateUserInput) => {
  return db.transaction(async (trx) => {
    const userName = user.name.trim();
    const userEmail = user.email.trim().toLowerCase();
    const userRole = user.role ?? "USER";

    // Check whether user already exists
    const userExists = await trx("users")
      .select("id_user")
      .whereRaw("LOWER(email) = LOWER(?)", [userEmail])
      .first();

    if (userExists) {
      throw new Error("User already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(user.password, 10);

    // Insert user
    const [createdUser] = await trx("users")
      .insert({
        name: userName,
        email: userEmail,
        password_hash: passwordHash,
        role: userRole,
      })
      .returning([
        "id_user",
        "name",
        "email",
        "role",
        "is_active",
        "created_at",
        "updated_at",
      ]);

    return createdUser;
  });
};
