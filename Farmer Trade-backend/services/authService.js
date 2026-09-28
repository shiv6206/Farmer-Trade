import jwt from "jsonwebtoken";
import tursoClient from "../config/turso.js";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "node:crypto";

const developmentJwtSecret = randomBytes(48).toString("base64url");

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 32 && !/replace-with|hackathon/i.test(secret)) {
    return secret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be a strong, unique secret of at least 32 characters");
  }
  return developmentJwtSecret;
};

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

const findUserByPhone = async (phone) => {
  const result = await tursoClient.execute({
    sql: "SELECT * FROM users WHERE phone = ?",
    args: [phone],
  });
  return result.rows[0] || null;
};

const createOrUpdateUser = async ({ phone, name, role, district }) => {
  const existing = await findUserByPhone(phone);

  if (existing) {
    return existing;
  }

  // Create new user
  const id = uuidv4();
  await tursoClient.execute({
    sql: "INSERT INTO users (id, name, phone, role, district) VALUES (?, ?, ?, ?, ?)",
    args: [id, name, phone, role, district],
  });
  return { id, name, role, district, phone };
};

const getUserById = async (id) => {
  const result = await tursoClient.execute({
    sql: "SELECT * FROM users WHERE id = ?",
    args: [id],
  });
  return result.rows[0] || null;
};

export { generateToken, verifyToken, findUserByPhone, createOrUpdateUser, getUserById };
