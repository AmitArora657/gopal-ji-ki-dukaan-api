import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getUserByEmail } from "./userService.js";

interface LoginInput {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const loginUser = async (loginData: LoginInput) => {
  const email = loginData.email.trim().toLowerCase();

  // Find user by email
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check whether user is active
  if (!user.is_active) {
    throw new Error("User account is inactive");
  }

  // Compare password with stored bcrypt hash
  const passwordMatches = await bcrypt.compare(
    loginData.password,
    user.password_hash,
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = jwt.sign(
    {
      id_user: user.id_user,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  return {
    token,
    user: {
      id_user: user.id_user,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    },
  };
};
